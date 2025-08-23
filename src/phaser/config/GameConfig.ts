/**
 * Main game configuration constants
 */
export const GAME_CONFIG = {
  WORLD: {
    WIDTH: 2048, // Double the original width
    HEIGHT: 1536, // Double the original height
    BORDER_THICKNESS: 50, // Thickness of world borders
    BORDER_COLOR: 0x2d1b0e // Dark brown border color
  },
  PLAYER: {
    SPEED: 200,
    SCALE: 2.0,
    DEPTH: 10,
    HITBOX_SCALE: 0.8,
    ATTACK_INTERVAL: 500, // ms between attacks
    MAX_HEALTH: 100, // Maximum player health
    DAMAGE_INTERVAL: 500, // ms between damage ticks when overlapping enemies
    DAMAGE_AMOUNT: 5, // Amount of damage taken per tick
    DAMAGE_TINT: 0xff0000, // Red tint when damaged
    INVULNERABLE_DURATION: 1000, // ms of invulnerability after taking damage
    HEALTH_BAR_WIDTH: 200, // Width of health bar in pixels
    HEALTH_BAR_HEIGHT: 20, // Height of health bar in pixels
    EXPERIENCE: {
      PICKUP_RADIUS: 10, // Radius in pixels for auto-pickup
      MAGNET_RADIUS: 150, // Radius in pixels for experience magnet effect
      MAGNET_SPEED: 300 // Speed at which orbs move toward player when in magnet radius
    }
  },
  ENEMY: {
    SPEED: 120,
    SCALE: 0.6,
    DEPTH: 5,
    SPAWN_INTERVAL: 1000, // ms between spawns
    MAX_COUNT: 50,
    SPAWN_PADDING: 20, // Distance from edge
    HITBOX_SCALE: 0.8,
    TINT: 0xffffff,
    MAX_HEALTH: 3, // Number of hits to defeat an enemy
    DAMAGE_TINT: 0xff8800, // Orange tint when damaged
    KNOCKBACK_FORCE: 150, // Force applied when hit
    KNOCKBACK_DURATION: 200, // ms of knockback effect
    EXPERIENCE_DROP_CHANCE: 1.0 // Chance (0-1) of dropping an experience orb
  },
  ENEMY2: {
    SPEED: 100, // Slightly slower due to larger size
    SCALE: 1.2, // Even bigger than regular enemies (0.6 -> 1.2)
    DEPTH: 5,
    SPAWN_INTERVAL: 1000, // ms between spawns
    MAX_COUNT: 50,
    SPAWN_PADDING: 20, // Distance from edge
    HITBOX_SCALE: 0.8,
    TINT: 0xffffff,
    MAX_HEALTH: 5, // 50% more health than regular enemies (3 -> 4.5, rounded to 5)
    DAMAGE_TINT: 0xff8800, // Orange tint when damaged
    KNOCKBACK_FORCE: 150, // Force applied when hit
    KNOCKBACK_DURATION: 200, // ms of knockback effect
    EXPERIENCE_DROP_CHANCE: 1.0 // Chance (0-1) of dropping an experience orb
  },
  ENEMY3: {
    SPEED: 90, // Even slower due to larger size
    SCALE: 1.4, // Bigger than enemy2 (1.2 -> 1.4)
    DEPTH: 5,
    SPAWN_INTERVAL: 1000, // ms between spawns
    MAX_COUNT: 50,
    SPAWN_PADDING: 20, // Distance from edge
    HITBOX_SCALE: 0.8,
    TINT: 0xffffff,
    MAX_HEALTH: 7, // More health than enemy2 (5 -> 7)
    DAMAGE_TINT: 0xff8800, // Orange tint when damaged
    KNOCKBACK_FORCE: 150, // Force applied when hit
    KNOCKBACK_DURATION: 200, // ms of knockback effect
    EXPERIENCE_DROP_CHANCE: 1.0 // Chance (0-1) of dropping an experience orb
  },
  EXPERIENCE_ORB: {
    KEY: 'experience_orb',
    SCALE: 0.3,
    DEPTH: 3,
    TINT: 0x00ffff, // Cyan color
    VALUE: 1, // Each orb gives 1 XP, player needs 25 for first level up
    LIFESPAN: 10000, // ms before disappearing
    MAX_COUNT: 100, // Maximum number of orbs
    PULSE_DURATION: 1000, // ms for pulse animation
    PULSE_SCALE: 1.2 // Maximum scale during pulse
  },
  PROJECTILE: {
    PLAYER: {
      KEY: 'player_projectile',
      SPEED: 400,
      SCALE: 0.3,
      DEPTH: 8,
      MAX_COUNT: 100,
      LIFESPAN: 2000, // ms
      TINT: 0xffff00, // Yellow color
      DAMAGE: 1
    }
  },
  THUNDER: {
    KEY: 'thunder_strike',
    INTERVAL: 4000, // 4 seconds between strikes
    DAMAGE: 3,
    RADIUS: 80, // Area of effect radius
    DEPTH: 9,
    LIGHTNING_COLOR: 0x00ffff, // Cyan color for lightning
    EXPLOSION_COLOR: 0xffff00, // Yellow for explosion
    STRIKE_DURATION: 500, // How long the lightning effect lasts
    EXPLOSION_DURATION: 300 // How long the explosion effect lasts
  },
  MAGIC_CIRCLE: {
    BASE_RADIUS: 60, // Base radius of the magic circle
    RADIUS_INCREASE_PER_LEVEL: 20, // Radius increase per upgrade
    BASE_DAMAGE: 1, // Base damage per tick
    DAMAGE_INCREASE_PER_LEVEL: 1, // Damage increase per upgrade
    ROTATION_SPEED: 0.02, // Speed of rotation (radians per frame)
    DEPTH: 7, // Render depth
    COLOR: 0x9932cc // Purple color for magic circle
  },
  UI: {
    TEXT_STYLE: {
      fontSize: '18px',
      color: '#ffffff',
      strokeThickness: 2,
      stroke: '#000000'
    }
  }
};

/**
 * Default camera dimensions if not specified elsewhere
 */
export const DEFAULT_DIMENSIONS = {
  WIDTH: 1024,
  HEIGHT: 768
}; 