import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ProjectileSystem } from './ProjectileSystem';
import { ThunderSystem } from './ThunderSystem';
import { MagicCircleSystem } from './MagicCircleSystem';

/**
 * Represents an upgrade that can be chosen by the player
 */
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  apply: (player: Player, _projectileSystem: ProjectileSystem, thunderSystem?: ThunderSystem, magicCircleSystem?: MagicCircleSystem) => void;
}

/**
 * System responsible for managing available upgrades and their effects
 */
export class UpgradeSystem {
  private player: Player;
  private projectileSystem: ProjectileSystem;
  private thunderSystem: ThunderSystem | null = null;
  private magicCircleSystem: MagicCircleSystem | null = null;
  private availableUpgrades: Upgrade[] = [];
  private acquiredUpgrades: Map<string, number> = new Map();
  
  constructor(_scene: Phaser.Scene, player: Player, projectileSystem: ProjectileSystem) {
    this.player = player;
    this.projectileSystem = projectileSystem;
    
    // Initialize available upgrades
    this.initializeUpgrades();
  }

  /**
   * Set the thunder system reference
   */
  setThunderSystem(thunderSystem: ThunderSystem): void {
    this.thunderSystem = thunderSystem;
  }

  /**
   * Set the magic circle system reference
   */
  setMagicCircleSystem(magicCircleSystem: MagicCircleSystem): void {
    this.magicCircleSystem = magicCircleSystem;
  }
  
  /**
   * Initialize the list of available upgrades
   */
  private initializeUpgrades(): void {
    // Add damage upgrade
    this.availableUpgrades.push({
      id: 'damage',
      name: 'Increased Damage',
      description: 'Increase projectile damage by 25%',
      icon: 'damage_icon',
      level: 0,
      maxLevel: 5,
      apply: (player, _projectileSystem) => {
        player.increaseDamage(0.25);
      }
    });
    
    // Add attack speed upgrade
    this.availableUpgrades.push({
      id: 'attack_speed',
      name: 'Attack Speed',
      description: 'Increase attack speed by 15%',
      icon: 'speed_icon',
      level: 0,
      maxLevel: 5,
      apply: (player, _projectileSystem) => {
        player.increaseAttackSpeed(0.15);
      }
    });
    
    // Add projectile count upgrade
    this.availableUpgrades.push({
      id: 'projectile_count',
      name: 'Multi-Shot',
      description: 'Fire an additional projectile',
      icon: 'multishot_icon',
      level: 0,
      maxLevel: 3,
      apply: (player, _projectileSystem) => {
        player.increaseProjectileCount(1);
      }
    });
    
    // Add projectile size upgrade
    this.availableUpgrades.push({
      id: 'projectile_size',
      name: 'Larger Projectiles',
      description: 'Increase projectile size by 20%',
      icon: 'size_icon',
      level: 0,
      maxLevel: 3,
      apply: (player, _projectileSystem) => {
        player.increaseProjectileSize(0.2);
      }
    });
    
    // Add health upgrade
    this.availableUpgrades.push({
      id: 'max_health',
      name: 'Max Health',
      description: 'Increase maximum health by 20',
      icon: 'health_icon',
      level: 0,
      maxLevel: 5,
      apply: (player, _projectileSystem) => {
        player.increaseMaxHealth(20);
      }
    });
    
    // Add movement speed upgrade
    this.availableUpgrades.push({
      id: 'movement_speed',
      name: 'Movement Speed',
      description: 'Increase movement speed by 10%',
      icon: 'movement_icon',
      level: 0,
      maxLevel: 3,
      apply: (player, _projectileSystem) => {
        player.increaseMovementSpeed(0.1);
      }
    });

    // Add thunder magic upgrade (initial activation)
    this.availableUpgrades.push({
      id: 'thunder_magic',
      name: 'Thunder Magic',
      description: 'Summon lightning strikes every 4 seconds',
      icon: 'thunder_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, thunderSystem) => {
        if (thunderSystem) {
          thunderSystem.activate();
        }
      }
    });

    // Add thunder magic improvements
    this.availableUpgrades.push({
      id: 'thunder_improve',
      name: 'Double Thunder',
      description: 'Upgrade to 2 lightning strikes every 4 seconds',
      icon: 'thunder_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, thunderSystem) => {
        if (thunderSystem && thunderSystem.isThunderActive()) {
          thunderSystem.increaseThunderLevel();
        }
      }
    });

    this.availableUpgrades.push({
      id: 'thunder_improve_2',
      name: 'Triple Thunder',
      description: 'Upgrade to 3 lightning strikes every 4 seconds',
      icon: 'thunder_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, thunderSystem) => {
        if (thunderSystem && thunderSystem.isThunderActive()) {
          thunderSystem.increaseThunderLevel();
        }
      }
    });

    this.availableUpgrades.push({
      id: 'thunder_improve_3',
      name: 'Quad Thunder',
      description: 'Upgrade to 4 lightning strikes every 4 seconds',
      icon: 'thunder_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, thunderSystem) => {
        if (thunderSystem && thunderSystem.isThunderActive()) {
          thunderSystem.increaseThunderLevel();
        }
      }
    });

    // Add magic circle upgrade (initial activation)
    this.availableUpgrades.push({
      id: 'magic_circle',
      name: 'Magic Circle',
      description: 'Summon a rotating magic circle that damages nearby enemies',
      icon: 'magic_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, _thunderSystem, magicCircleSystem) => {
        if (magicCircleSystem) {
          magicCircleSystem.activate();
        }
      }
    });

    // Add magic circle improvements
    this.availableUpgrades.push({
      id: 'magic_circle_improve',
      name: 'Larger Circle',
      description: 'Increase magic circle radius and damage',
      icon: 'magic_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, _thunderSystem, magicCircleSystem) => {
        if (magicCircleSystem && magicCircleSystem.isMagicCircleActive()) {
          magicCircleSystem.increaseMagicCircleLevel();
        }
      }
    });

    this.availableUpgrades.push({
      id: 'magic_circle_improve_2',
      name: 'Enhanced Circle',
      description: 'Further increase magic circle radius and damage',
      icon: 'magic_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, _thunderSystem, magicCircleSystem) => {
        if (magicCircleSystem && magicCircleSystem.isMagicCircleActive()) {
          magicCircleSystem.increaseMagicCircleLevel();
        }
      }
    });

    this.availableUpgrades.push({
      id: 'magic_circle_improve_3',
      name: 'Master Circle',
      description: 'Maximum magic circle radius and damage',
      icon: 'magic_icon',
      level: 0,
      maxLevel: 1,
      apply: (_player, _projectileSystem, _thunderSystem, magicCircleSystem) => {
        if (magicCircleSystem && magicCircleSystem.isMagicCircleActive()) {
          magicCircleSystem.increaseMagicCircleLevel();
        }
      }
    });
  }
  
  /**
   * Get a random selection of upgrades to choose from
   */
  getRandomUpgrades(count: number = 3): Upgrade[] {
    // Filter upgrades that haven't reached max level
    let availableUpgrades = this.availableUpgrades.filter(upgrade => {
      const currentLevel = this.acquiredUpgrades.get(upgrade.id) || 0;
      return currentLevel < upgrade.maxLevel;
    });
    
    // If no upgrades available, return empty array
    if (availableUpgrades.length === 0) {
      return [];
    }
    
    // Check if thunder magic is active
    const hasThunderMagic = this.acquiredUpgrades.get('thunder_magic') || 0;
    const thunderLevel = this.thunderSystem?.getThunderLevel() || 0;
    
    // Check if magic circle is active
    const hasMagicCircle = this.acquiredUpgrades.get('magic_circle') || 0;
    const magicCircleLevel = this.magicCircleSystem?.getMagicCircleLevel() || 0;
    
    // Filter thunder improvements based on thunder status
    if (hasThunderMagic === 0) {
      // If no thunder magic, only show basic thunder magic
      availableUpgrades = availableUpgrades.filter(upgrade => 
        upgrade.id === 'thunder_magic' || 
        !upgrade.id.startsWith('thunder_improve')
      );
    } else {
      // If thunder magic is active, show only the next improvement in sequence
      availableUpgrades = availableUpgrades.filter(upgrade => {
        if (upgrade.id === 'thunder_magic') {
          return false; // Don't show basic thunder if already active
        }
        // Only show the next improvement based on current thunder level
        if (thunderLevel === 0 && upgrade.id === 'thunder_improve') {
          return true; // Show double thunder when at level 0
        }
        if (thunderLevel === 1 && upgrade.id === 'thunder_improve_2') {
          return true; // Show triple thunder when at level 1
        }
        if (thunderLevel === 2 && upgrade.id === 'thunder_improve_3') {
          return true; // Show quad thunder when at level 2
        }
        // Hide all thunder improvements if not the next one in sequence
        if (upgrade.id.startsWith('thunder_improve')) {
          return false;
        }
        return true;
      });
    }
    
    // Filter magic circle improvements based on magic circle status
    if (hasMagicCircle === 0) {
      // If no magic circle, only show basic magic circle
      availableUpgrades = availableUpgrades.filter(upgrade => 
        upgrade.id === 'magic_circle' || 
        !upgrade.id.startsWith('magic_circle_improve')
      );
    } else {
      // If magic circle is active, show only the next improvement in sequence
      availableUpgrades = availableUpgrades.filter(upgrade => {
        if (upgrade.id === 'magic_circle') {
          return false; // Don't show basic magic circle if already active
        }
        // Only show the next improvement based on current magic circle level
        if (magicCircleLevel === 0 && upgrade.id === 'magic_circle_improve') {
          return true; // Show larger circle when at level 0
        }
        if (magicCircleLevel === 1 && upgrade.id === 'magic_circle_improve_2') {
          return true; // Show enhanced circle when at level 1
        }
        if (magicCircleLevel === 2 && upgrade.id === 'magic_circle_improve_3') {
          return true; // Show master circle when at level 2
        }
        // Hide all magic circle improvements if not the next one in sequence
        if (upgrade.id.startsWith('magic_circle_improve')) {
          return false;
        }
        return true;
      });
    }
    
    // Shuffle and select upgrades
    const shuffled = [...availableUpgrades].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
  
  /**
   * Apply an upgrade to the player
   */
  applyUpgrade(upgradeId: string): void {
    // Find the upgrade
    const upgrade = this.availableUpgrades.find(u => u.id === upgradeId);
    
    if (!upgrade) {
      console.warn(`Upgrade with id ${upgradeId} not found`);
      return;
    }
    
    // Get current level of this upgrade
    const currentLevel = this.acquiredUpgrades.get(upgradeId) || 0;
    
    // Check if already at max level
    if (currentLevel >= upgrade.maxLevel) {
      console.warn(`Upgrade ${upgradeId} already at max level`);
      return;
    }
    
    // Apply the upgrade effect
    upgrade.apply(this.player, this.projectileSystem, this.thunderSystem || undefined, this.magicCircleSystem || undefined);
    
    // Update acquired upgrades
    this.acquiredUpgrades.set(upgradeId, currentLevel + 1);
    
    console.log(`Applied upgrade: ${upgrade.name} (Level ${currentLevel + 1})`);
  }
  
  /**
   * Get the current level of an upgrade
   */
  getUpgradeLevel(upgradeId: string): number {
    return this.acquiredUpgrades.get(upgradeId) || 0;
  }

  /**
   * Get all acquired upgrades
   */
  getAcquiredUpgrades(): Map<string, number> {
    return this.acquiredUpgrades;
  }

  /**
   * Get all available upgrades
   */
  getAvailableUpgrades(): Upgrade[] {
    return this.availableUpgrades;
  }

  /**
   * Get dynamic description for thunder magic based on upgrade ID
   */
  getThunderDescription(upgradeId: string): string {
    switch (upgradeId) {
      case 'thunder_magic':
        return 'Summon lightning strikes every 4 seconds';
      case 'thunder_improve':
        return 'Upgrade to 2 lightning strikes every 4 seconds';
      case 'thunder_improve_2':
        return 'Upgrade to 3 lightning strikes every 4 seconds';
      case 'thunder_improve_3':
        return 'Upgrade to 4 lightning strikes every 4 seconds';
      default:
        return 'Summon lightning strikes every 4 seconds';
    }
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    // Clear upgrade data
    this.availableUpgrades = [];
    this.acquiredUpgrades.clear();
  }
} 