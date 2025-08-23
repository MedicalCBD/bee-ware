import Phaser from 'phaser';
import { DEFAULT_DIMENSIONS, GAME_CONFIG } from '../config/GameConfig';

/**
 * Manages loading and creating game assets
 */
export class AssetManager {
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  /**
   * Preload all game assets
   */
  preloadAssets(): void {
    // Load all player sprite sheets
    this.scene.load.spritesheet('player', '/assets/images/game/player1.png', { 
      frameWidth: 34, 
      frameHeight: 48 
    });
    
    this.scene.load.spritesheet('wizard', '/assets/images/game/wizard1.png', { 
      frameWidth: 34, 
      frameHeight: 48 
    });
    
    this.scene.load.spritesheet('mesmer', '/assets/images/game/mesmer1.png', { 
      frameWidth: 34, 
      frameHeight: 48 
    });
    
    // Load enemy sprites
    this.scene.load.image('enemy', '/assets/images/game/enemy.png');
    this.scene.load.image('enemy2', '/assets/images/game/enemy2.png');
    
    // Load world background
    this.scene.load.image('background', '/assets/images/game/game-bg.png');
    
    // Create upgrade icons
    this.createUpgradeIcons();
  }
  
  /**
   * Create player animations
   */
  createPlayerAnimations(): void {
    // Create animations for each skin
    this.createSkinAnimations('player');
    this.createSkinAnimations('wizard');
    this.createSkinAnimations('mesmer');
  }
  
  /**
   * Create animations for a specific skin
   */
  private createSkinAnimations(skinKey: string): void {
    // Frame order: abajo, arriba, derecha, izquierda (0, 1, 2, 3)
    
    // Down animation (frame 0)
    this.scene.anims.create({
      key: `${skinKey}-down`,
      frames: this.scene.anims.generateFrameNumbers(skinKey, { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    
    // Up animation (frame 1)
    this.scene.anims.create({
      key: `${skinKey}-up`,
      frames: this.scene.anims.generateFrameNumbers(skinKey, { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
    
    // Right animation (frame 2)
    this.scene.anims.create({
      key: `${skinKey}-right`,
      frames: this.scene.anims.generateFrameNumbers(skinKey, { start: 2, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    
    // Left animation (frame 3)
    this.scene.anims.create({
      key: `${skinKey}-left`,
      frames: this.scene.anims.generateFrameNumbers(skinKey, { start: 3, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }

  /**
   * Create the game world
   */
  createWorld(): void {
    const worldWidth = GAME_CONFIG.WORLD.WIDTH;
    const worldHeight = GAME_CONFIG.WORLD.HEIGHT;
    
    // Set world physics boundaries to the larger world size
    this.scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    
    // Create a larger background by tiling the background image
    const bgWidth = this.getCameraWidth();
    const bgHeight = this.getCameraHeight();
    
    // Calculate how many background tiles we need
    const tilesX = Math.ceil(worldWidth / bgWidth);
    const tilesY = Math.ceil(worldHeight / bgHeight);
    
    // Create tiled background
    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const bgX = x * bgWidth + bgWidth / 2;
        const bgY = y * bgHeight + bgHeight / 2;
        
        this.scene.add.image(bgX, bgY, 'background')
          .setDisplaySize(bgWidth, bgHeight)
          .setDepth(0);
      }
    }
    
    // Create world borders
    this.createWorldBorders();
  }
  
  /**
   * Create world borders
   */
  private createWorldBorders(): void {
    const worldWidth = GAME_CONFIG.WORLD.WIDTH;
    const worldHeight = GAME_CONFIG.WORLD.HEIGHT;
    const borderThickness = GAME_CONFIG.WORLD.BORDER_THICKNESS;
    const borderColor = GAME_CONFIG.WORLD.BORDER_COLOR;
    
    // Create border graphics
    const borders = this.scene.add.graphics();
    borders.setDepth(1);
    
    // Fill with border color
    borders.fillStyle(borderColor, 1);
    
    // Top border
    borders.fillRect(0, 0, worldWidth, borderThickness);
    
    // Bottom border
    borders.fillRect(0, worldHeight - borderThickness, worldWidth, borderThickness);
    
    // Left border
    borders.fillRect(0, 0, borderThickness, worldHeight);
    
    // Right border
    borders.fillRect(worldWidth - borderThickness, 0, borderThickness, worldHeight);
  }
  
  /**
   * Create upgrade icons as textures
   */
  private createUpgradeIcons(): void {
    // Create damage icon (red sword)
    this.createIconTexture('damage_icon', 0xff0000);
    
    // Create attack speed icon (yellow lightning)
    this.createIconTexture('speed_icon', 0xffff00);
    
    // Create multi-shot icon (blue triple dots)
    this.createIconTexture('multishot_icon', 0x0000ff);
    
    // Create size icon (green circle)
    this.createIconTexture('size_icon', 0x00ff00);
    
    // Create health icon (pink heart)
    this.createIconTexture('health_icon', 0xff00ff);
    
    // Create movement icon (cyan boots)
    this.createIconTexture('movement_icon', 0x00ffff);
    
    // Create thunder icon (yellow lightning)
    this.createIconTexture('thunder_icon', 0xffff00);
    
    // Create magic circle icon (purple)
    this.createIconTexture('magic_icon', 0x9932cc);
  }
  
  /**
   * Create a simple colored icon texture
   */
  private createIconTexture(key: string, color: number): void {
    // Skip if texture already exists
    if (this.scene.textures.exists(key)) {
      return;
    }
    
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    
    // Draw a filled circle with border
    graphics.fillStyle(color, 1);
    graphics.fillCircle(32, 32, 28);
    
    // Add border
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeCircle(32, 32, 28);
    
    // Generate texture
    graphics.generateTexture(key, 64, 64);
    graphics.destroy();
  }
  
  /**
   * Get camera width
   */
  getCameraWidth(): number {
    return this.scene.cameras.main?.width || DEFAULT_DIMENSIONS.WIDTH;
  }
  
  /**
   * Get camera height
   */
  getCameraHeight(): number {
    return this.scene.cameras.main?.height || DEFAULT_DIMENSIONS.HEIGHT;
  }
} 