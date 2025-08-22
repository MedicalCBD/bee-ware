import Phaser from 'phaser';
import { EnemySystem } from './EnemySystem';
import { GAME_CONFIG } from '../config/GameConfig';

/**
 * System responsible for managing magic circle abilities
 */
export class MagicCircleSystem {
  private scene: Phaser.Scene;
  private enemySystem: EnemySystem;
  private player: any; // Reference to player
  private magicCircle: Phaser.GameObjects.Graphics | null = null;
  private isActive: boolean = false;
  private magicCircleLevel: number = 0;
  private maxMagicCircleLevel: number = 3;
  private rotationAngle: number = 0;
  private damageTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, enemySystem: EnemySystem, player: any) {
    this.scene = scene;
    this.enemySystem = enemySystem;
    this.player = player;
  }

  /**
   * Activate magic circle
   */
  activate(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.createMagicCircle();
    
    // Start damage timer
    this.damageTimer = this.scene.time.addEvent({
      delay: 500, // Damage every 500ms
      callback: this.damageEnemiesInRange,
      callbackScope: this,
      loop: true
    });
    
    console.log('Magic Circle activated!');
  }

  /**
   * Deactivate magic circle
   */
  deactivate(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.magicCircle) {
      this.magicCircle.destroy();
      this.magicCircle = null;
    }
    
    if (this.damageTimer) {
      this.damageTimer.destroy();
      this.damageTimer = null;
    }
    
    console.log('Magic Circle deactivated!');
  }

  /**
   * Create the magic circle graphics
   */
  private createMagicCircle(): void {
    if (this.magicCircle) {
      this.magicCircle.destroy();
    }

    this.magicCircle = this.scene.add.graphics();
    this.magicCircle.setDepth(GAME_CONFIG.MAGIC_CIRCLE.DEPTH);
  }

  /**
   * Update magic circle position and rotation
   */
  update(): void {
    if (!this.isActive || !this.magicCircle) return;

    // Update rotation angle
    this.rotationAngle += GAME_CONFIG.MAGIC_CIRCLE.ROTATION_SPEED;
    if (this.rotationAngle >= Math.PI * 2) {
      this.rotationAngle = 0;
    }

    // Clear previous graphics
    this.magicCircle.clear();

    // Get player position
    const playerX = this.player.x;
    const playerY = this.player.y;

    // Calculate circle radius based on level
    const baseRadius = GAME_CONFIG.MAGIC_CIRCLE.BASE_RADIUS;
    const radiusIncrease = GAME_CONFIG.MAGIC_CIRCLE.RADIUS_INCREASE_PER_LEVEL;
    const currentRadius = baseRadius + (this.magicCircleLevel * radiusIncrease);

    // Draw magic circle
    this.magicCircle.lineStyle(3, GAME_CONFIG.MAGIC_CIRCLE.COLOR, 0.8);
    this.magicCircle.strokeCircle(playerX, playerY, currentRadius);

    // Draw rotating elements
    this.drawRotatingElements(playerX, playerY, currentRadius);
  }

  /**
   * Draw rotating elements on the magic circle
   */
  private drawRotatingElements(centerX: number, centerY: number, radius: number): void {
    if (!this.magicCircle) return;

    const elementCount = 4;
    const elementSize = 8;

    for (let i = 0; i < elementCount; i++) {
      const angle = this.rotationAngle + (i * Math.PI * 2 / elementCount);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw rotating element
      this.magicCircle.fillStyle(GAME_CONFIG.MAGIC_CIRCLE.COLOR, 0.9);
      this.magicCircle.fillCircle(x, y, elementSize);
      
      // Add glow effect
      this.magicCircle.fillStyle(GAME_CONFIG.MAGIC_CIRCLE.COLOR, 0.3);
      this.magicCircle.fillCircle(x, y, elementSize * 2);
    }
  }

  /**
   * Damage enemies within magic circle range
   */
  private damageEnemiesInRange(): void {
    if (!this.isActive) return;

    const enemies = this.enemySystem.getVisibleEnemies();
    const playerX = this.player.x;
    const playerY = this.player.y;

    // Calculate current radius
    const baseRadius = GAME_CONFIG.MAGIC_CIRCLE.BASE_RADIUS;
    const radiusIncrease = GAME_CONFIG.MAGIC_CIRCLE.RADIUS_INCREASE_PER_LEVEL;
    const currentRadius = baseRadius + (this.magicCircleLevel * radiusIncrease);
    const radiusSquared = currentRadius * currentRadius;

    // Calculate damage based on level
    const baseDamage = GAME_CONFIG.MAGIC_CIRCLE.BASE_DAMAGE;
    const damageIncrease = GAME_CONFIG.MAGIC_CIRCLE.DAMAGE_INCREASE_PER_LEVEL;
    const currentDamage = baseDamage + (this.magicCircleLevel * damageIncrease);

    for (const enemy of enemies) {
      const dx = enemy.x - playerX;
      const dy = enemy.y - playerY;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared <= radiusSquared) {
        // Apply magic circle damage
        this.enemySystem.damageEnemy(enemy, currentDamage);

        // Add magic damage visual effect
        enemy.setTint(GAME_CONFIG.MAGIC_CIRCLE.COLOR);

        this.scene.time.delayedCall(200, () => {
          if (enemy.active) {
            enemy.setTint(GAME_CONFIG.ENEMY.TINT);
          }
        });
      }
    }
  }

  /**
   * Get current magic circle level
   */
  getMagicCircleLevel(): number {
    return this.magicCircleLevel;
  }

  /**
   * Increase magic circle level
   */
  increaseMagicCircleLevel(): void {
    if (this.magicCircleLevel < this.maxMagicCircleLevel) {
      this.magicCircleLevel++;
      console.log(`Magic Circle level increased to ${this.magicCircleLevel}`);
    }
  }

  /**
   * Get max magic circle level
   */
  getMaxMagicCircleLevel(): number {
    return this.maxMagicCircleLevel;
  }

  /**
   * Check if magic circle is active
   */
  isMagicCircleActive(): boolean {
    return this.isActive;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.deactivate();
  }
}

