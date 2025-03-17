/**
 * Simple event emitter for browser environments
 */
class EventEmitter {
  private events: Record<string, Function[]> = {};

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(...args));
  }

  removeAllListeners(): void {
    this.events = {};
  }
}

/**
 * Enum representing the possible game states
 */
export enum GameState {
  START = 'start',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over'
}

/**
 * Interface for game state manager configuration
 */
export interface GameStateConfig {
  initialState?: GameState;
  onStateChange?: (prevState: GameState, newState: GameState) => void;
}

/**
 * Class that manages the game state and transitions between states
 */
export class GameStateManager {
  private currentState: GameState;
  private previousState: GameState | null;
  private events: EventEmitter;
  private score: number;
  private level: number;
  private lives: number;

  constructor(config: GameStateConfig = {}) {
    this.currentState = config.initialState || GameState.START;
    this.previousState = null;
    this.events = new EventEmitter();
    this.score = 0;
    this.level = 1;
    this.lives = 3;

    // Register default state change handler if provided
    if (config.onStateChange) {
      this.onStateChange(config.onStateChange);
    }
  }

  /**
   * Get the current game state
   */
  public getState(): GameState {
    return this.currentState;
  }

  /**
   * Transition to a new game state
   */
  public setState(newState: GameState): boolean {
    if (this.currentState === newState) {
      return false;
    }

    const prevState = this.currentState;
    this.previousState = prevState;
    this.currentState = newState;
    
    // Emit the state change event
    this.events.emit('stateChange', prevState, newState);
    
    return true;
  }

  /**
   * Start a new game
   */
  public startGame(): void {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.setState(GameState.PLAYING);
  }

  /**
   * Pause the current game
   */
  public pauseGame(): void {
    if (this.currentState === GameState.PLAYING) {
      this.setState(GameState.PAUSED);
    }
  }

  /**
   * Resume the current game from pause
   */
  public resumeGame(): void {
    if (this.currentState === GameState.PAUSED) {
      this.setState(GameState.PLAYING);
    }
  }

  /**
   * End the current game
   */
  public endGame(): void {
    this.setState(GameState.GAME_OVER);
  }

  /**
   * Reset to the start screen
   */
  public resetToStart(): void {
    this.setState(GameState.START);
  }

  /**
   * Add event listener for state changes
   */
  public onStateChange(callback: (prevState: GameState, newState: GameState) => void): void {
    this.events.on('stateChange', callback);
  }

  /**
   * Remove event listener for state changes
   */
  public offStateChange(callback: (prevState: GameState, newState: GameState) => void): void {
    this.events.off('stateChange', callback);
  }

  /**
   * Check if the game is currently in a specific state
   */
  public isInState(state: GameState): boolean {
    return this.currentState === state;
  }

  /**
   * Get the previous game state
   */
  public getPreviousState(): GameState | null {
    return this.previousState;
  }

  // Score management
  public getScore(): number {
    return this.score;
  }

  public addScore(points: number): void {
    this.score += points;
    this.events.emit('scoreChange', this.score);
  }

  public setScore(score: number): void {
    this.score = score;
    this.events.emit('scoreChange', this.score);
  }

  // Level management
  public getLevel(): number {
    return this.level;
  }

  public incrementLevel(): number {
    this.level += 1;
    this.events.emit('levelChange', this.level);
    return this.level;
  }

  public setLevel(level: number): void {
    this.level = level;
    this.events.emit('levelChange', this.level);
  }

  // Lives management
  public getLives(): number {
    return this.lives;
  }

  public decrementLives(): number {
    this.lives -= 1;
    this.events.emit('livesChange', this.lives);
    
    // Check if game over
    if (this.lives <= 0) {
      this.endGame();
    }
    
    return this.lives;
  }

  public addLife(): number {
    this.lives += 1;
    this.events.emit('livesChange', this.lives);
    return this.lives;
  }

  public setLives(lives: number): void {
    this.lives = lives;
    this.events.emit('livesChange', this.lives);
  }

  // Subscribe to game data changes
  public onScoreChange(callback: (score: number) => void): void {
    this.events.on('scoreChange', callback);
  }

  public onLevelChange(callback: (level: number) => void): void {
    this.events.on('levelChange', callback);
  }

  public onLivesChange(callback: (lives: number) => void): void {
    this.events.on('livesChange', callback);
  }

  // Clean up all event listeners
  public destroy(): void {
    this.events.removeAllListeners();
  }
}

/**
 * Create a new game state manager with the specified configuration
 */
export function createGameStateManager(config?: GameStateConfig): GameStateManager {
  return new GameStateManager(config);
}