export const PERFORMANCE_CONFIG = {
  // Upgrade system performance settings
  UPGRADE_SYSTEM: {
    MAX_UPGRADES_PER_FRAME: 3, // Limit upgrades processed per frame
    UPDATE_THROTTLE_MS: 100, // Minimum time between updates
    MAX_RETRY_ATTEMPTS: 3, // Maximum retry attempts for failed operations
  },
  
  // UI update settings
  UI_UPDATES: {
    SPELL_PANEL_UPDATE_INTERVAL: 1000, // Update spell panel every 1 second
    MAX_SPELLS_DISPLAYED: 10, // Maximum spells to display at once
    SCROLL_THRESHOLD: 8, // Start scrolling after this many spells
  },
  
  // Game pause protection
  PAUSE_PROTECTION: {
    CHECK_PAUSE_STATE: true, // Check if game is paused before updates
    PAUSE_UPDATE_DELAY: 500, // Delay updates when game is paused
  },
  
  // Memory management
  MEMORY: {
    CLEANUP_INTERVAL: 30000, // Cleanup every 30 seconds
    MAX_CACHED_OBJECTS: 100, // Maximum cached objects
  }
};

