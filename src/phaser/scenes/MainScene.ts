import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { EnemySystem } from '../systems/EnemySystem';
import { GameUI } from '../ui/GameUI';
import { AssetManager } from '../systems/AssetManager';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { ExperienceSystem } from '../systems/ExperienceSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { UpgradeUI } from '../ui/UpgradeUI';
import { ThunderSystem } from '../systems/ThunderSystem';
import { MagicCircleSystem } from '../systems/MagicCircleSystem';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * Main game scene that coordinates all game systems and entities
 */
export default class MainScene extends Phaser.Scene {
  // Core systems
  private assetManager!: AssetManager;
  private player!: Player;
  private enemySystem!: EnemySystem;
  private projectileSystem!: ProjectileSystem;
  private experienceSystem!: ExperienceSystem;
  private upgradeSystem!: UpgradeSystem;
  private thunderSystem!: ThunderSystem;
  private magicCircleSystem!: MagicCircleSystem;
  private gameUI!: GameUI;
  private upgradeUI!: UpgradeUI;
  
  // Game state
  private isPaused: boolean = false;
  private isGameOver: boolean = false;
  private gameOverUI: Phaser.GameObjects.Container | null = null;
  
  // Performance tracking
  private perfText!: Phaser.GameObjects.Text;
  private lastFpsUpdate: number = 0;
  
  // Skin selection
  private selectedSkin: { id: string; image: string } = { id: 'default', image: '/assets/images/game/player1.png' };

  constructor() {
    super({ key: 'MainScene' });
  }

  /**
   * Set the selected skin for the player
   */
  setSelectedSkin(skin: { id: string; image: string }): void {
    this.selectedSkin = skin;
  }

  /**
   * Preload all game assets
   */
  preload(): void {
    // Initialize asset manager and load assets
    this.assetManager = new AssetManager(this);
    this.assetManager.preloadAssets(this.selectedSkin);
    
    // Create a circular texture for projectiles
    this.createProjectileTexture();
  }
  
  /**
   * Create a circular texture for projectiles
   */
  private createProjectileTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    
    // Draw a filled circle
    graphics.fillStyle(0xffffff); // White (will be tinted later)
    graphics.fillCircle(8, 8, 8); // 16x16 circle
    
    // Generate texture from graphics
    graphics.generateTexture(GAME_CONFIG.PROJECTILE.PLAYER.KEY, 16, 16);
    graphics.destroy();
    
    // Verify the texture was created
    if (!this.textures.exists(GAME_CONFIG.PROJECTILE.PLAYER.KEY)) {
      console.error(`Failed to create projectile texture: ${GAME_CONFIG.PROJECTILE.PLAYER.KEY}`);
    }
  }

  /**
   * Create game objects and initialize systems
   */
  create(): void {
    // Create the game world
    this.assetManager = new AssetManager(this);
    this.assetManager.createWorld();
    this.assetManager.createPlayerAnimations();
    
    // Get the center coordinates for player placement
    const centerX = GAME_CONFIG.WORLD.WIDTH / 2;
    const centerY = GAME_CONFIG.WORLD.HEIGHT / 2;
    
    // Ensure projectile texture exists before creating the system
    if (!this.textures.exists(GAME_CONFIG.PROJECTILE.PLAYER.KEY)) {
      this.createProjectileTexture();
    }
    
    // Create projectile system
    this.projectileSystem = new ProjectileSystem(this);
    
    // Create player at center of screen with selected skin
    this.player = new Player(this, centerX, centerY, this.selectedSkin.id);
    
    // Set up camera to follow player
    this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WORLD.WIDTH, GAME_CONFIG.WORLD.HEIGHT);
    
    // Set up player attacks
    this.player.setupAttacks(this.projectileSystem);
    
    // Create enemy system targeting the player
    this.enemySystem = new EnemySystem(this, this.player.getSprite(), this.player);
    
    // Create experience system
    this.experienceSystem = new ExperienceSystem(this, this.player.getSprite());
    
    // Connect enemy system to experience system
    this.enemySystem.setExperienceSystem(this.experienceSystem);
    
    // Create upgrade system
    this.upgradeSystem = new UpgradeSystem(this, this.player, this.projectileSystem);
    
    // Create thunder system
    this.thunderSystem = new ThunderSystem(this, this.enemySystem, this.player.getSprite());
    
    // Create magic circle system
    this.magicCircleSystem = new MagicCircleSystem(this, this.enemySystem, this.player.getSprite());
    
    // Connect thunder system to upgrade system
    this.upgradeSystem.setThunderSystem(this.thunderSystem);
    
    // Connect magic circle system to upgrade system
    this.upgradeSystem.setMagicCircleSystem(this.magicCircleSystem);
    
    // Set up optimized collisions
    this.setupCollisions();
    
    // Create game UI
    this.gameUI = new GameUI(this);
    
    // Create upgrade UI
    this.upgradeUI = new UpgradeUI(this, this.upgradeSystem);
    
    // Listen for upgrade UI events
    this.events.on('show-upgrade-ui', this.showUpgradeUI, this);
    
    // Listen for player level up events to adjust enemy spawn rate
    this.events.on('player-level-up', this.onPlayerLevelUp, this);
    
    // Listen for game over events
    this.events.on('game-over', this.handleGameOver, this);
    
    // Add performance monitor
    this.perfText = this.add.text(10, this.cameras.main.height - 30, 'FPS: 0', {
      fontSize: '16px',
      color: '#00ff00',
      backgroundColor: '#000000'
    });
    this.perfText.setScrollFactor(0);
  }

  /**
   * Set up optimized collision detection between game objects
   */
  private setupCollisions(): void {
    // We'll use overlap instead of collider for better control
    // and only check collisions between visible enemies and player
    
    // Basic physics collisions between enemies for minimal physics interactions
    this.physics.add.collider(
      this.enemySystem.getEnemyGroup(),
      this.enemySystem.getEnemyGroup(),
      undefined,
      // Only perform collision for visible enemies that are close to each other 
      this.filterEnemyCollisions as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      this
    );
    
    // Set up projectile-enemy collisions for each projectile type
    const projectileGroup = this.projectileSystem.getProjectileGroup(GAME_CONFIG.PROJECTILE.PLAYER.KEY);
    
    if (projectileGroup) {
      this.physics.add.overlap(
        projectileGroup,
        this.enemySystem.getEnemyGroup(),
        this.handleProjectileEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        // Only check collisions for active projectiles and enemies
        (projectile, enemy) => {
          return (projectile as Phaser.Physics.Arcade.Sprite).active && 
                 (enemy as Phaser.Physics.Arcade.Sprite).active;
        },
        this
      );
    }
  }
  
  /**
   * Handle collision between projectile and enemy
   */
  private handleProjectileEnemyCollision(
    projectile: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const p = projectile as Phaser.Physics.Arcade.Sprite;
    const e = enemy as Phaser.Physics.Arcade.Sprite;
    
    // Deactivate the projectile
    this.projectileSystem.deactivateProjectile(p);
    
    // Get damage value from projectile
    const damage = (p as any).damage || 1;
    
    // Apply damage to enemy with knockback
    const wasDefeated = this.enemySystem.damageEnemy(
      e, 
      damage, 
      GAME_CONFIG.ENEMY.KNOCKBACK_FORCE
    );
    
    // If enemy wasn't defeated, we can add additional visual feedback
    if (!wasDefeated) {
      // Flash the enemy (additional visual feedback)
      this.tweens.add({
        targets: e,
        alpha: 0.5,
        duration: 50,
        yoyo: true,
        repeat: 1
      });
    }
  }
  
  /**
   * Custom filter to optimize enemy-enemy collisions
   * Only performs collision checks when necessary
   */
  private filterEnemyCollisions(
    enemy1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): boolean {
    // Skip collision checks between enemies that are far apart
    // This greatly reduces the number of collision checks
    const e1 = enemy1 as Phaser.Physics.Arcade.Sprite;
    const e2 = enemy2 as Phaser.Physics.Arcade.Sprite;
    
    // Skip inactive enemies
    if (!e1.active || !e2.active) {
      return false;
    }
    
    // Calculate squared distance
    const dx = e1.x - e2.x;
    const dy = e1.y - e2.y;
    const distSquared = dx * dx + dy * dy;
    
    // Only collide if they're close enough (avoid sqrt for performance)
    // Assuming enemies are about 32 pixels wide
    const collisionThreshold = 64; // 2x enemy width
    
    return distSquared < (collisionThreshold * collisionThreshold);
  }

  /**
   * Check for collisions between player and enemies
   */
  private checkPlayerEnemyCollisions(): void {
    // Get visible enemies
    const enemies = this.enemySystem.getVisibleEnemies();
    
    // Check if player is overlapping with any enemies
    let isOverlapping = false;
    
    for (const enemy of enemies) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getSprite().getBounds(),
        enemy.getBounds()
      )) {
        isOverlapping = true;
        break;
      }
    }
    
    // Update player's overlapping state
    this.player.setOverlapping(isOverlapping);
  }

  /**
   * Show the upgrade UI and pause the game
   */
  private showUpgradeUI(): void {
    // Pause the game
    this.pauseGame();
    
    // Show upgrade UI
    this.upgradeUI.show(3, (upgradeId: string) => {
      // Apply the selected upgrade
      if (upgradeId) {
        this.upgradeSystem.applyUpgrade(upgradeId);
      }
      
      // Resume the game
      this.resumeGame();
      
      // Notify player that upgrade is complete
      this.player.onUpgradeSelected();
    });
  }
  
  /**
   * Pause the game
   */
  private pauseGame(): void {
    this.isPaused = true;
    
    // Pause physics
    this.physics.pause();
    
    // Pause all timers
    this.time.paused = true;
  }
  
  /**
   * Resume the game
   */
  private resumeGame(): void {
    this.isPaused = false;
    
    // Resume physics
    this.physics.resume();
    
    // Resume all timers
    this.time.paused = false;
  }

  /**
   * Main update loop
   */
  update(time: number, _delta: number): void {
    // Skip update if game is paused or over
    if (this.isPaused || this.isGameOver) return;
    
    // Update player
    this.player.update();
    
    // Update enemy system
    this.enemySystem.update();
    
    // Update experience system
    this.experienceSystem.update();
    
    // Update projectile system
    this.projectileSystem.update();
    
    // Update magic circle system
    this.magicCircleSystem.update();
    
    // Check for collisions between player and enemies
    this.checkPlayerEnemyCollisions();
    
    // Update UI elements
    this.updateUI();
    
    // Update FPS counter every 500ms
    if (time - this.lastFpsUpdate > 500) {
      this.updateFpsCounter();
      this.lastFpsUpdate = time;
    }
  }

  /**
   * Update UI elements
   */
  private updateUI(): void {
    // Update enemy count
    this.gameUI.updateEnemyCount(this.enemySystem.getEnemyCount());
    
    // Update player health
    this.gameUI.updateHealth(this.player.getHealth(), this.player.getMaxHealth());
    
    // Update player level
    this.gameUI.updateLevel(this.player.getLevel());
    
    // Update experience bar
    this.gameUI.updateExperience(
      this.player.getExperience(),
      this.player.getExperienceToNextLevel(),
      this.player.getLevel()
    );
  }

  /**
   * Update the FPS counter
   */
  private updateFpsCounter(): void {
    this.perfText.setText(`FPS: ${Math.round(this.game.loop.actualFps)} | Enemies: ${this.enemySystem.getEnemyCount()} | Level: ${this.player.getLevel()}`);
  }

  /**
   * Clean up resources before scene shutdown
   */
  shutdown(): void {
    // Remove event listeners
    this.events.off('show-upgrade-ui', this.showUpgradeUI, this);
    this.events.off('player-level-up', this.onPlayerLevelUp, this);
    this.events.off('game-over', this.handleGameOver, this);
    
    // Clean up systems
    if (this.thunderSystem) {
      this.thunderSystem.cleanup();
    }
    
    if (this.magicCircleSystem) {
      this.magicCircleSystem.cleanup();
    }
  }

  /**
   * Handle player level up event
   */
  private onPlayerLevelUp(level: number): void {
    // Update enemy spawn rate based on new player level
    this.enemySystem.updateSpawnRate();
    
    console.log(`Player reached level ${level}! Adjusting enemy spawn rate.`);
  }

  /**
   * Handle game over event
   */
  private handleGameOver(): void {
    this.isGameOver = true;
    
    // Pause the game
    this.pauseGame();
    
    // Show game over screen
    this.showGameOverScreen();
  }

  /**
   * Show game over screen with restart option
   */
  private showGameOverScreen(): void {
    // Create a semi-transparent background
    const background = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );
    background.setScrollFactor(0);
    background.setDepth(1000);

    // Create game over text
    const gameOverText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 50,
      'Game Over!',
      {
        fontSize: '48px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold'
      }
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setScrollFactor(0);
    gameOverText.setDepth(1001);

    // Create restart button
    const restartButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 50,
      'Press SPACE to Restart',
      {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    restartButton.setOrigin(0.5);
    restartButton.setScrollFactor(0);
    restartButton.setDepth(1001);

    // Make button interactive
    restartButton.setInteractive();
    restartButton.on('pointerdown', this.restartGame, this);
    restartButton.on('pointerover', () => {
      restartButton.setColor('#ffff00');
    });
    restartButton.on('pointerout', () => {
      restartButton.setColor('#ffffff');
    });

    // Store UI elements for cleanup
    this.gameOverUI = this.add.container(0, 0, [background, gameOverText, restartButton]);
    this.gameOverUI.setDepth(1000);

    // Listen for space key to restart
    this.input.keyboard?.on('keydown-SPACE', this.restartGame, this);
  }

  /**
   * Restart the game
   */
  private restartGame(): void {
    // Remove game over UI
    if (this.gameOverUI) {
      this.gameOverUI.destroy();
      this.gameOverUI = null;
    }

    // Remove space key listener
    this.input.keyboard?.off('keydown-SPACE', this.restartGame, this);

    // Reset game state
    this.isGameOver = false;

    // Clear all enemies
    this.enemySystem.clearAllEnemies();

    // Clear all projectiles
    this.projectileSystem.clearAllProjectiles();

    // Clear all experience orbs
    this.experienceSystem.clearAllOrbs();

    // Deactivate thunder magic
    this.thunderSystem.deactivate();
    
    // Deactivate magic circle
    this.magicCircleSystem.deactivate();

    // Reset player
    this.player.reset();

    // Reset UI
    this.gameUI.updateHealth(this.player.getHealth(), this.player.getMaxHealth());
    this.gameUI.updateLevel(this.player.getLevel());
    this.gameUI.updateExperience(0, 25, 1);

    // Resume the game
    this.resumeGame();
  }
} 