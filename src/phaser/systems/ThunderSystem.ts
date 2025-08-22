import Phaser from 'phaser';
import { EnemySystem } from './EnemySystem';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * System responsible for managing thunder magic abilities
 */
export class ThunderSystem {
  private scene: Phaser.Scene;
  private enemySystem: EnemySystem;
  private player: any; // Reference to player
  private thunderTimer: Phaser.Time.TimerEvent | null = null;
  private isActive: boolean = false;
  private thunderLevel: number = 0;
  private maxThunderLevel: number = 3;

  constructor(scene: Phaser.Scene, enemySystem: EnemySystem, player: any) {
    this.scene = scene;
    this.enemySystem = enemySystem;
    this.player = player;
  }

  /**
   * Activate thunder magic
   */
  activate(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Start the thunder timer
    this.thunderTimer = this.scene.time.addEvent({
      delay: GAME_CONFIG.THUNDER.INTERVAL,
      callback: this.castThunder,
      callbackScope: this,
      loop: true
    });
    
    console.log('Thunder magic activated!');
  }

  /**
   * Deactivate thunder magic
   */
  deactivate(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.thunderTimer) {
      this.thunderTimer.destroy();
      this.thunderTimer = null;
    }
    
    console.log('Thunder magic deactivated!');
  }

  /**
   * Cast thunder strike on enemies
   */
  private castThunder(): void {
    const enemies = this.enemySystem.getVisibleEnemies();
    
    if (enemies.length === 0) return;
    
    // Get player position from the player sprite
    const playerX = this.player.x;
    const playerY = this.player.y;
    
    // Calculate number of strikes based on thunder level
    const strikeCount = Math.min(this.thunderLevel + 1, enemies.length);
    
    // Get the closest enemies to target
    const targetEnemies = this.getClosestEnemies(enemies, playerX, playerY, strikeCount);
    
    // Create lightning strikes for each target
    for (const enemy of targetEnemies) {
      this.createLightningStrike(enemy.x, enemy.y);
    }
  }

  /**
   * Get the closest enemies to the player
   */
  private getClosestEnemies(enemies: any[], playerX: number, playerY: number, count: number): any[] {
    // Calculate distances and sort enemies by distance
    const enemiesWithDistance = enemies.map(enemy => {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return { enemy, distance };
    });
    
    // Sort by distance (closest first)
    enemiesWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Return the closest enemies
    return enemiesWithDistance.slice(0, count).map(item => item.enemy);
  }

  /**
   * Create a lightning strike effect
   */
  private createLightningStrike(x: number, y: number): void {
    // Create lightning bolt effect
    const lightning = this.scene.add.graphics();
    lightning.setDepth(GAME_CONFIG.THUNDER.DEPTH);
    
    // Draw lightning bolt
    lightning.lineStyle(4, GAME_CONFIG.THUNDER.LIGHTNING_COLOR, 1);
    
    // Create zigzag lightning pattern from above the target to the target
    const startY = y - 100; // Start 100 pixels above the target
    const endY = y; // End at the target position
    const segments = 8;
    const segmentHeight = (endY - startY) / segments;
    
    lightning.beginPath();
    lightning.moveTo(x, startY);
    
    let currentY = startY;
    for (let i = 0; i < segments; i++) {
      currentY += segmentHeight;
      const offsetX = (Math.random() - 0.5) * 20; // Random zigzag
      lightning.lineTo(x + offsetX, currentY);
    }
    
    lightning.strokePath();
    
    // Create explosion effect
    this.createExplosion(x, y);
    
    // Damage enemies in radius
    this.damageEnemiesInRadius(x, y);
    
    // Remove lightning after duration
    this.scene.time.delayedCall(GAME_CONFIG.THUNDER.STRIKE_DURATION, () => {
      lightning.destroy();
    });
  }

  /**
   * Create explosion effect
   */
  private createExplosion(x: number, y: number): void {
    // Create area of effect indicator (larger, more visible)
    const areaIndicator = this.scene.add.circle(
      x, y, 
      GAME_CONFIG.THUNDER.RADIUS, 
      GAME_CONFIG.THUNDER.EXPLOSION_COLOR, 
      0.2
    );
    areaIndicator.setDepth(GAME_CONFIG.THUNDER.DEPTH - 2);
    
    // Add border to make area more visible
    areaIndicator.setStrokeStyle(3, GAME_CONFIG.THUNDER.LIGHTNING_COLOR, 0.8);
    
    // Create main explosion circle (larger and more visible)
    const explosion = this.scene.add.circle(
      x, y, 
      GAME_CONFIG.THUNDER.RADIUS * 0.8, 
      GAME_CONFIG.THUNDER.EXPLOSION_COLOR, 
      0.6
    );
    explosion.setDepth(GAME_CONFIG.THUNDER.DEPTH - 1);
    
    // Animate area indicator
    this.scene.tweens.add({
      targets: areaIndicator,
      radius: GAME_CONFIG.THUNDER.RADIUS * 1.3,
      alpha: 0,
      duration: GAME_CONFIG.THUNDER.EXPLOSION_DURATION,
      ease: 'Power2',
      onComplete: () => {
        areaIndicator.destroy();
      }
    });
    
    // Animate main explosion
    this.scene.tweens.add({
      targets: explosion,
      radius: GAME_CONFIG.THUNDER.RADIUS * 1.2,
      alpha: 0,
      duration: GAME_CONFIG.THUNDER.EXPLOSION_DURATION,
      ease: 'Power2',
      onComplete: () => {
        explosion.destroy();
      }
    });
    
    // Add particle effect
    this.createExplosionParticles(x, y);
    
    // Add screen flash effect
    this.createScreenFlash(x, y);
  }

  /**
   * Create explosion particles
   */
  private createExplosionParticles(x: number, y: number): void {
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = GAME_CONFIG.THUNDER.RADIUS * 0.8;
      
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;
      
      const particle = this.scene.add.circle(
        x, y, 
        3, 
        GAME_CONFIG.THUNDER.EXPLOSION_COLOR, 
        1
      );
      particle.setDepth(GAME_CONFIG.THUNDER.DEPTH);
      
      // Animate particle
      this.scene.tweens.add({
        targets: particle,
        x: particleX,
        y: particleY,
        alpha: 0,
        scale: 0,
        duration: GAME_CONFIG.THUNDER.EXPLOSION_DURATION,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  /**
   * Create screen flash effect
   */
  private createScreenFlash(x: number, y: number): void {
    // Create a large flash circle around the explosion
    const flash = this.scene.add.circle(
      x, y,
      GAME_CONFIG.THUNDER.RADIUS * 2,
      GAME_CONFIG.THUNDER.LIGHTNING_COLOR,
      0.3
    );
    flash.setDepth(GAME_CONFIG.THUNDER.DEPTH - 3);
    
    // Animate flash
    this.scene.tweens.add({
      targets: flash,
      radius: GAME_CONFIG.THUNDER.RADIUS * 3,
      alpha: 0,
      duration: GAME_CONFIG.THUNDER.EXPLOSION_DURATION * 0.5,
      ease: 'Power2',
      onComplete: () => {
        flash.destroy();
      }
    });
  }

  /**
   * Damage all enemies within the thunder radius
   */
  private damageEnemiesInRadius(x: number, y: number): void {
    const enemies = this.enemySystem.getVisibleEnemies();
    const radiusSquared = GAME_CONFIG.THUNDER.RADIUS * GAME_CONFIG.THUNDER.RADIUS;
    
    for (const enemy of enemies) {
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared <= radiusSquared) {
        // Apply thunder damage
        this.enemySystem.damageEnemy(enemy, GAME_CONFIG.THUNDER.DAMAGE);
        
        // Add thunder damage visual effect
        enemy.setTint(GAME_CONFIG.THUNDER.LIGHTNING_COLOR);
        
        this.scene.time.delayedCall(200, () => {
          if (enemy.active) {
            enemy.setTint(GAME_CONFIG.ENEMY.TINT);
          }
        });
      }
    }
  }

  /**
   * Check if thunder magic is active
   */
  isThunderActive(): boolean {
    return this.isActive;
  }

  /**
   * Get current thunder level
   */
  getThunderLevel(): number {
    return this.thunderLevel;
  }

  /**
   * Increase thunder level
   */
  increaseThunderLevel(): void {
    if (this.thunderLevel < this.maxThunderLevel) {
      this.thunderLevel++;
      console.log(`Thunder level increased to ${this.thunderLevel}`);
    }
  }

  /**
   * Get max thunder level
   */
  getMaxThunderLevel(): number {
    return this.maxThunderLevel;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.deactivate();
  }
}
