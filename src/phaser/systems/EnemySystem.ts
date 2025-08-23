import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import { getRandomEdgePosition } from '../utils/MathUtils';
import { ExperienceSystem } from './ExperienceSystem';
import { Player } from '../entities/Player';

/**
 * System responsible for enemy spawning, movement, and management
 */
export class EnemySystem {
  private scene: Phaser.Scene;
  private enemies: Phaser.Physics.Arcade.Group;
  private spawnTimer: Phaser.Time.TimerEvent;
  private target: Phaser.Physics.Arcade.Sprite;
  private player: Player;
  private experienceSystem: ExperienceSystem | null = null;
  
  // Tracking active enemies for improved performance
  private activeEnemies: Set<Phaser.Physics.Arcade.Sprite> = new Set();
  private cameraRect: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle();
  private visibleEnemies: Array<Phaser.Physics.Arcade.Sprite> = [];
  
  // Health bars for enemies
  private healthBars: Map<Phaser.Physics.Arcade.Sprite, Phaser.GameObjects.Graphics> = new Map();
  
  // Buffer to avoid allocations in update loop
  private vectorBuffer = { x: 0, y: 0 };
  
  // Track which enemies have been damaged by which trail circles to prevent spam
  private trailDamageTracker: Map<Phaser.Physics.Arcade.Sprite, Set<Phaser.GameObjects.Graphics>> = new Map();
  
  constructor(scene: Phaser.Scene, target: Phaser.Physics.Arcade.Sprite, player: Player) {
    this.scene = scene;
    this.target = target;
    this.player = player;
    
    // Initialize enemy group with preallocated pool
    this.enemies = this.createEnemyGroup();
    
    // Pre-populate the object pool to avoid runtime allocations
    this.prepopulateEnemyPool();
    
    // Set up spawn timer
    this.spawnTimer = this.startSpawnTimer();
    

  }

  /**
   * Create the enemy physics group with pooling
   */
  private createEnemyGroup(): Phaser.Physics.Arcade.Group {
    return this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: GAME_CONFIG.ENEMY.MAX_COUNT,
      runChildUpdate: false // We'll handle updates manually for better control
    });
  }
  
  /**
   * Prepopulate the enemy pool to avoid runtime allocations
   */
  private prepopulateEnemyPool(): void {
    // Preallocate enemy objects to avoid allocations during gameplay
    // We'll create a mix of all enemy types for the pool
    for (let i = 0; i < GAME_CONFIG.ENEMY.MAX_COUNT; i++) {
      // Alternate between enemy types for the pool
      let enemyType = 'enemy';
      if (i % 3 === 1) enemyType = 'enemy2';
      else if (i % 3 === 2) enemyType = 'enemy3';
      
      const enemy = this.enemies.create(0, 0, enemyType) as Phaser.Physics.Arcade.Sprite;
      enemy.setActive(false);
      enemy.setVisible(false);
      
      // Configure enemy properties once
      this.configureEnemyProperties(enemy);
    }
  }

  /**
   * Start the enemy spawning timer
   */
  private startSpawnTimer(): Phaser.Time.TimerEvent {
    // Calculate spawn interval based on player level
    const spawnInterval = this.calculateSpawnInterval();
    
    return this.scene.time.addEvent({
      delay: spawnInterval,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }
  
  /**
   * Calculate spawn interval based on player level
   * Enemies spawn faster as player level increases
   */
  private calculateSpawnInterval(): number {
    const baseInterval = GAME_CONFIG.ENEMY.SPAWN_INTERVAL;
    const playerLevel = this.player.getLevel();
    
    // Reduce spawn interval by 15% per level (minimum 30% of base interval)
    const reductionFactor = Math.max(0.3, 1 - (playerLevel - 1) * 0.15);
    
    return Math.floor(baseInterval * reductionFactor);
  }
  
  /**
   * Update spawn timer when player levels up
   * Should be called when player level changes
   */
  updateSpawnRate(): void {
    // Destroy existing timer
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }
    
    // Create new timer with updated interval
    this.spawnTimer = this.startSpawnTimer();
    
    console.log(`Enemy spawn rate updated: ${this.calculateSpawnInterval()}ms (Player Level: ${this.player.getLevel()})`);
  }

  /**
   * Spawn a new enemy at a random edge position
   */
  private spawnEnemy(): void {
    // Don't spawn if we've reached the maximum number of enemies
    if (this.getEnemyCount() >= GAME_CONFIG.ENEMY.MAX_COUNT) {
      return;
    }
    
    const width = this.scene.cameras.main?.width || 1024;
    const height = this.scene.cameras.main?.height || 768;
    const padding = GAME_CONFIG.ENEMY.SPAWN_PADDING;
    
    // Get random position on the edge of the screen
    const { x, y } = getRandomEdgePosition(width, height, padding);
    
    // Choose enemy type based on player level
    const playerLevel = this.player.getLevel();
    let enemyType = 'enemy';
    
    if (playerLevel >= 6) {
      // From level 6 onwards, enemy3.png starts spawning with higher probability
      const rand = Math.random();
      if (rand < 0.4) {
        enemyType = 'enemy3'; // 40% chance for enemy3
      } else if (rand < 0.6) {
        enemyType = 'enemy2'; // 20% chance for enemy2
      } else {
        enemyType = 'enemy'; // 40% chance for enemy
      }
    } else if (playerLevel >= 3) {
      // From level 3 onwards, enemy2.png starts spawning
      // 30% chance for enemy2, 70% chance for enemy
      enemyType = Math.random() < 0.3 ? 'enemy2' : 'enemy';
    }
    
    // Get an inactive enemy from the pool with the appropriate texture
    const enemy = this.getEnemyFromPool(enemyType);
    
    if (enemy) {
      this.activateEnemy(enemy, x, y);
    }
  }
  
  /**
   * Get an inactive enemy from the pool with the specified texture
   */
  private getEnemyFromPool(enemyType: string): Phaser.Physics.Arcade.Sprite | null {
    // Find an inactive enemy with the correct texture
    for (const enemy of this.enemies.getChildren()) {
      const sprite = enemy as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active && sprite.texture.key === enemyType) {
        return sprite;
      }
    }
    
    // If no enemy with the correct texture is available, create a new one
    return this.enemies.create(0, 0, enemyType) as Phaser.Physics.Arcade.Sprite;
  }

  /**
   * Activate an enemy from the pool with specific position
   */
  private activateEnemy(enemy: Phaser.Physics.Arcade.Sprite, x: number, y: number): void {
    enemy.setPosition(x, y);
    enemy.setActive(true);
    enemy.setVisible(true);
    enemy.setVelocity(0, 0);
    
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Reset any enemy state that needs resetting
    enemy.setTint(config.TINT);
    
    // Reset health to max
    (enemy as any).health = config.MAX_HEALTH;
    
    // Create or update health bar
    this.createOrUpdateHealthBar(enemy);
    
    // Add to our tracking set for faster iteration
    this.activeEnemies.add(enemy);
  }
  
  /**
   * Deactivate an enemy and return it to the pool
   */
  private deactivateEnemy(enemy: Phaser.Physics.Arcade.Sprite): void {
    enemy.setActive(false);
    enemy.setVisible(false);
    enemy.setVelocity(0, 0);
    
    // Remove health bar
    const healthBar = this.healthBars.get(enemy);
    if (healthBar) {
      healthBar.setVisible(false);
    }
    
    // Clean up trail damage tracker
    this.trailDamageTracker.delete(enemy);
    
    this.activeEnemies.delete(enemy);
  }

  /**
   * Configure an enemy sprite with appropriate properties
   * Only needs to be done once when enemy is first created
   */
  private configureEnemyProperties(enemy: Phaser.Physics.Arcade.Sprite): void {
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    enemy.setScale(config.SCALE);
    enemy.setDepth(config.DEPTH);
    enemy.setCollideWorldBounds(true);
    
    // Initialize health property
    (enemy as any).health = config.MAX_HEALTH;
    
    if (enemy.body) {
      enemy.body.setSize(
        enemy.width * config.HITBOX_SCALE, 
        enemy.height * config.HITBOX_SCALE
      );
    }
  }

  /**
   * Update all active enemies - optimized for large quantities
   */
  update(): void {
    // Update camera rectangle for visibility checks
    const camera = this.scene.cameras.main;
    if (camera) {
      this.cameraRect.setTo(
        camera.scrollX - 100, // Buffer zone outside camera
        camera.scrollY - 100,
        camera.width + 200,
        camera.height + 200
      );
    }
    
    // Clear visible enemies array without allocating new one
    this.visibleEnemies.length = 0;
    
    // Process active enemies
    for (const enemy of this.activeEnemies) {
      // Only process on-screen enemies or those close to screen
      if (Phaser.Geom.Rectangle.Contains(this.cameraRect, enemy.x, enemy.y)) {
        this.visibleEnemies.push(enemy);
        this.moveEnemyTowardTarget(enemy);
        
        // Update health bar position
        this.updateHealthBarPosition(enemy);
      } else {
        // Optionally apply simplified physics for off-screen enemies
        this.moveOffscreenEnemyBasic(enemy);
        
        // Hide health bar for off-screen enemies
        const healthBar = this.healthBars.get(enemy);
        if (healthBar) {
          healthBar.setVisible(false);
        }
      }
    }
    
    // Check Mesmer trail collisions
    this.checkMesmerTrailCollisions();
  }
  
  /**
   * Basic movement for off-screen enemies (less accurate but more efficient)
   */
  private moveOffscreenEnemyBasic(enemy: Phaser.Physics.Arcade.Sprite): void {
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Simplified movement toward player (less frequent updates, less precision)
    if (Math.random() < 0.1) { // Only update direction occasionally
      this.vectorBuffer.x = this.target.x - enemy.x;
      this.vectorBuffer.y = this.target.y - enemy.y;
      
      const length = Math.sqrt(
        this.vectorBuffer.x * this.vectorBuffer.x + 
        this.vectorBuffer.y * this.vectorBuffer.y
      );
      
      if (length > 0) {
        enemy.setVelocity(
          (this.vectorBuffer.x / length) * config.SPEED * 0.8,
          (this.vectorBuffer.y / length) * config.SPEED * 0.8
        );
      }
    }
  }

  /**
   * Move an enemy toward the target (player) - accurate version for visible enemies
   */
  private moveEnemyTowardTarget(enemy: Phaser.Physics.Arcade.Sprite): void {
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Calculate direction vector to target using buffer to avoid allocation
    this.vectorBuffer.x = this.target.x - enemy.x;
    this.vectorBuffer.y = this.target.y - enemy.y;
    
    // Normalize the direction vector manually to avoid allocation
    const length = Math.sqrt(
      this.vectorBuffer.x * this.vectorBuffer.x + 
      this.vectorBuffer.y * this.vectorBuffer.y
    );
    
    if (length > 0) {
      enemy.setVelocity(
        (this.vectorBuffer.x / length) * config.SPEED,
        (this.vectorBuffer.y / length) * config.SPEED
      );
    }
  }
  
  /**
   * Set the experience system reference
   */
  setExperienceSystem(experienceSystem: ExperienceSystem): void {
    this.experienceSystem = experienceSystem;
  }

  /**
   * Apply damage to an enemy and handle effects
   * Returns true if the enemy was defeated
   */
  damageEnemy(enemy: Phaser.Physics.Arcade.Sprite, damage: number, knockbackForce?: number): boolean {
    if (!enemy.active) return false;
    
    // Reduce health
    (enemy as any).health -= damage;
    
    // Update health bar
    this.updateHealthBar(enemy);
    
    // Check if enemy is defeated
    if ((enemy as any).health <= 0) {
      // Drop experience orb before deactivating
      this.dropExperienceOrb(enemy);
      
      // Deactivate the enemy
      this.deactivateEnemy(enemy);
      return true;
    }
    
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Apply damage visual effect
    enemy.setTint(config.DAMAGE_TINT);
    
    // Reset tint after a short delay
    this.scene.time.delayedCall(200, () => {
      if (enemy.active) {
        enemy.setTint(config.TINT);
      }
    });
    
    // Apply knockback if specified
    if (knockbackForce && enemy.body) {
      // Use the enemy's current velocity direction for knockback
      const vx = enemy.body.velocity.x;
      const vy = enemy.body.velocity.y;
      
      // Calculate knockback direction (opposite of movement)
      const length = Math.sqrt(vx * vx + vy * vy);
      
      if (length > 0) {
        const knockbackX = -(vx / length) * knockbackForce;
        const knockbackY = -(vy / length) * knockbackForce;
        
        // Apply knockback velocity
        enemy.setVelocity(knockbackX, knockbackY);
        
        // Reset velocity after knockback duration
        this.scene.time.delayedCall(config.KNOCKBACK_DURATION, () => {
          if (enemy.active) {
            // Don't set to zero, just let the normal movement take over again
            enemy.setVelocity(0, 0);
          }
        });
      }
    }
    
    return false;
  }
  
  /**
   * Drop an experience orb at the enemy's position
   */
  private dropExperienceOrb(enemy: Phaser.Physics.Arcade.Sprite): void {
    // Skip if no experience system is set
    if (!this.experienceSystem) return;
    
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Check drop chance
    if (Math.random() <= config.EXPERIENCE_DROP_CHANCE) {
      // Spawn experience orb at enemy position
      this.experienceSystem.spawnOrb(enemy.x, enemy.y);
      
      // Add a small visual effect
      this.createDeathEffect(enemy.x, enemy.y, enemy.texture.key);
    }
  }
  
  /**
   * Create a visual effect when an enemy is defeated
   */
  private createDeathEffect(x: number, y: number, enemyType: string = 'enemy'): void {
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemyType === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemyType === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Create particles for death effect
    const particles = this.scene.add.particles(x, y, GAME_CONFIG.EXPERIENCE_ORB.KEY, {
      speed: { min: 50, max: 100 },
      scale: { start: 0.2, end: 0 },
      quantity: 5,
      lifespan: 500,
      tint: config.TINT
    });
    
    // Auto-destroy after animation completes
    this.scene.time.delayedCall(500, () => {
      particles.destroy();
    });
  }
  
  /**
   * Create or update a health bar for an enemy
   */
  private createOrUpdateHealthBar(enemy: Phaser.Physics.Arcade.Sprite): void {
    let healthBar = this.healthBars.get(enemy);
    
    if (!healthBar) {
      // Create new health bar
      healthBar = this.scene.add.graphics();
      this.healthBars.set(enemy, healthBar);
    }
    
    // Update health bar appearance
    this.updateHealthBar(enemy);
    
    // Position the health bar
    this.updateHealthBarPosition(enemy);
  }
  
  /**
   * Update health bar appearance based on current health
   */
  private updateHealthBar(enemy: Phaser.Physics.Arcade.Sprite): void {
    const healthBar = this.healthBars.get(enemy);
    if (!healthBar) return;
    
    // Determine which config to use based on enemy texture
    let config = GAME_CONFIG.ENEMY;
    if (enemy.texture.key === 'enemy2') {
      config = GAME_CONFIG.ENEMY2;
    } else if (enemy.texture.key === 'enemy3') {
      config = GAME_CONFIG.ENEMY3;
    }
    
    // Clear previous graphics
    healthBar.clear();
    
    // Get current health percentage
    const health = (enemy as any).health || 0;
    const maxHealth = config.MAX_HEALTH;
    const healthPercent = Math.max(0, Math.min(1, health / maxHealth));
    
    // Set health bar dimensions
    const width = 30;
    const height = 4;
    
    // Draw background (empty health)
    healthBar.fillStyle(0x222222, 0.8);
    healthBar.fillRect(-width/2, -20, width, height);
    
    // Draw health (filled portion)
    if (healthPercent > 0) {
      // Color based on health percentage
      if (healthPercent > 0.6) {
        healthBar.fillStyle(0x00ff00, 0.8); // Green
      } else if (healthPercent > 0.3) {
        healthBar.fillStyle(0xffff00, 0.8); // Yellow
      } else {
        healthBar.fillStyle(0xff0000, 0.8); // Red
      }
      
      healthBar.fillRect(-width/2, -20, width * healthPercent, height);
    }
    
    // Set depth to ensure it renders above the enemy
    healthBar.setDepth(config.DEPTH + 1);
  }
  
  /**
   * Update health bar position to follow the enemy
   */
  private updateHealthBarPosition(enemy: Phaser.Physics.Arcade.Sprite): void {
    const healthBar = this.healthBars.get(enemy);
    if (!healthBar) return;
    
    healthBar.setPosition(enemy.x, enemy.y);
    healthBar.setVisible(true);
  }
  
  /**
   * Clean up and destroy enemies if necessary
   */
  cleanup(): void {
    // Stop the spawn timer
    this.spawnTimer.destroy();
    
    // Deactivate all enemies
    for (const enemy of this.activeEnemies) {
      this.deactivateEnemy(enemy);
    }
    
    // Clean up health bars
    for (const healthBar of this.healthBars.values()) {
      healthBar.destroy();
    }
    this.healthBars.clear();
    
    // Clean up trail damage tracker
    this.trailDamageTracker.clear();
  }

  /**
   * Get the enemy group for collision detection
   */
  getEnemyGroup(): Phaser.Physics.Arcade.Group {
    return this.enemies;
  }
  
  /**
   * Get array of visible enemies for optimized collision
   */
  getVisibleEnemies(): Array<Phaser.Physics.Arcade.Sprite> {
    return this.visibleEnemies;
  }

  /**
   * Get the current number of active enemies
   */
  getEnemyCount(): number {
    return this.activeEnemies.size;
  }
  
  /**
   * Set a new target for enemies to follow
   */
  setTarget(target: Phaser.Physics.Arcade.Sprite): void {
    this.target = target;
  }

  /**
   * Clear all enemies from the game
   */
  clearAllEnemies(): void {
    // Deactivate all enemies
    for (const enemy of this.activeEnemies) {
      this.deactivateEnemy(enemy);
    }
    
    // Clear arrays
    this.activeEnemies.clear();
    this.visibleEnemies = [];
    
    // Clear health bars
    for (const healthBar of this.healthBars.values()) {
      healthBar.destroy();
    }
    this.healthBars.clear();
  }
  
  /**
   * Check collisions with Mesmer trail circles
   */
  checkMesmerTrailCollisions(): void {
    const trailCircles = this.player.getMesmerTrailCircles();
    
    for (const circle of trailCircles) {
      for (const enemy of this.activeEnemies) {
        if (enemy.active && enemy.visible) {
          const distance = Phaser.Math.Distance.Between(circle.x, circle.y, enemy.x, enemy.y);
          
          if (distance <= circle.radius) {
            // Check if this enemy has already been damaged by this circle
            let damagedCircles = this.trailDamageTracker.get(enemy);
            if (!damagedCircles) {
              damagedCircles = new Set();
              this.trailDamageTracker.set(enemy, damagedCircles);
            }
            
            // Only damage if this circle hasn't damaged this enemy yet
            if (!damagedCircles.has(circle.graphics)) {
              damagedCircles.add(circle.graphics);
              this.damageEnemy(enemy, 1);
            }
          }
        }
      }
    }
  }
} 