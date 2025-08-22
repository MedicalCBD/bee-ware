export class DailyGamesManager {
  private static readonly STORAGE_KEY = 'bee-ware-daily-games';
  private static readonly MAX_GAMES_PER_DAY = 3;
  private static readonly DEV_MAX_GAMES = 999; // Partidas ilimitadas en desarrollo

  /**
   * Check if we're in development mode
   */
  private static isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  /**
   * Get the maximum games per day based on environment
   */
  private static getMaxGamesPerDay(): number {
    return this.isDevelopment() ? this.DEV_MAX_GAMES : this.MAX_GAMES_PER_DAY;
  }

  /**
   * Get the current date string in YYYY-MM-DD format
   */
  private static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get the stored daily games data
   */
  private static getStoredData(): { date: string; gamesPlayed: number } {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, return default
      }
    }
    return { date: '', gamesPlayed: 0 };
  }

  /**
   * Save the daily games data
   */
  private static saveData(data: { date: string; gamesPlayed: number }): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Check if a new day has started and reset if necessary
   */
  private static checkAndResetDaily(): void {
    const currentDate = this.getCurrentDate();
    const storedData = this.getStoredData();

    // If it's a new day, reset the counter
    if (storedData.date !== currentDate) {
      this.saveData({ date: currentDate, gamesPlayed: 0 });
    }
  }

  /**
   * Get the number of games played today
   */
  static getGamesPlayedToday(): number {
    this.checkAndResetDaily();
    return this.getStoredData().gamesPlayed;
  }

  /**
   * Get the number of games remaining today
   */
  static getGamesRemainingToday(): number {
    const gamesPlayed = this.getGamesPlayedToday();
    const maxGames = this.getMaxGamesPerDay();
    return Math.max(0, maxGames - gamesPlayed);
  }

  /**
   * Check if the player can play another game today
   */
  static canPlayGame(): boolean {
    return this.getGamesRemainingToday() > 0;
  }

  /**
   * Record that a game was played
   */
  static recordGamePlayed(): void {
    this.checkAndResetDaily();
    const storedData = this.getStoredData();
    const maxGames = this.getMaxGamesPerDay();
    const newGamesPlayed = Math.min(storedData.gamesPlayed + 1, maxGames);
    
    this.saveData({
      date: this.getCurrentDate(),
      gamesPlayed: newGamesPlayed
    });
  }

  /**
   * Get the time until next reset (in milliseconds)
   */
  static getTimeUntilReset(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return tomorrow.getTime() - now.getTime();
  }

  /**
   * Format time until reset as a readable string
   */
  static getTimeUntilResetFormatted(): string {
    const ms = this.getTimeUntilReset();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  /**
   * Get the maximum games per day for display
   */
  static getMaxGamesPerDayDisplay(): number {
    return this.MAX_GAMES_PER_DAY; // Always show 3 for display purposes
  }

  /**
   * Check if we're in development mode (for UI display)
   */
  static isDevelopmentMode(): boolean {
    return this.isDevelopment();
  }

  /**
   * Reset games for testing (development only)
   */
  static resetGamesForTesting(): void {
    if (this.isDevelopment()) {
      this.saveData({ date: this.getCurrentDate(), gamesPlayed: 0 });
    }
  }
}
