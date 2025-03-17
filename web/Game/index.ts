import { IGameSettings, IShape } from './types';
import { PHYSICS, CANVAS } from './constants';
import { createPhysicsWorld, removeFromWorld } from './physics';
import { renderTextDisplay, renderScoreDisplay } from './ui';
import { GameStateManager, GameState as GameStateEnum, createGameStateManager } from './gameState';
import { createStartScreen, StartScreen } from './startScreen';
import { MergerGame } from './mergerGame';
import { LosingScreen } from './losingScreen';

/**
 * Main game class that orchestrates all game components
 */
class Game {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private score: number = 0;
  private engine: any; // Matter.js engine type
  private gameStateManager: GameStateManager;
  private startScreen: StartScreen | null = null;
  private losingScreen: LosingScreen | null = null;
  private mergerGame: MergerGame | null = null;
  private shapes: IShape[] = []; // Kept for compatibility, but primarily using MergerGame
  private settings: IGameSettings;

  constructor(settings: IGameSettings) {
    this.settings = settings;
    this.gameStateManager = createGameStateManager();
  }

  /**
   * Initialize the game with the provided canvas element
   */
  public initialize(canvasElement: HTMLCanvasElement): void {
    this.canvas = canvasElement;
    this.context = this.canvas.getContext('2d');
    
    if (!this.context) {
      throw new Error('Failed to get 2D context from canvas');
    }
    
    // Set canvas dimensions
    this.canvas.width = CANVAS.WIDTH;
    this.canvas.height = CANVAS.HEIGHT;
    
    // Initialize physics engine
    const physicsWorld = createPhysicsWorld({
      width: CANVAS.WIDTH,
      height: CANVAS.HEIGHT,
      gravity: this.settings.gravity || { x: 0, y: PHYSICS.GRAVITY }
    });
    this.engine = physicsWorld.engine;
    
    // Initialize game state to START instead of PLAYING
    this.gameStateManager.setState(GameStateEnum.START);
    
    // Initialize start screen with callback to start the game
    this.startScreen = createStartScreen(
      this.canvas, 
      this.context, 
      () => {
        this.gameStateManager.startGame();
        this.initMergerGame();
      }
    );
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start the game loop
    this.startGameLoop();
    
    // Render initial UI
    this.renderGameUI();
  }

  /**
   * Initialize the Suika-style merger game
   */
  private initMergerGame(): void {
    if (!this.canvas || !this.context) return;
    
    // Clear any existing shapes
    this.shapes = [];
    
    // Initialize the Suika-style gameplay
    this.mergerGame = new MergerGame(this.canvas, this.context, {
      onScoreUpdate: (score: number) => {
        this.score = score;
        this.renderGameUI();
      },
      onGameOver: () => this.gameOver()
    });
    
    // Initialize the merger game without external physics engine
    // as MergerGame is self-contained
    this.mergerGame.initialize();
    
    // Reset score when starting a new game
    this.score = 0;
  }

  /**
   * Set up event listeners for user interaction
   */
  private setupEventListeners(): void {
    if (!this.canvas) return;
    
    // Handle click/tap events
    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      this.handleInteraction(x, y);
    });
    
    // Handle touch events
    this.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      if (event.touches.length > 0) {
        const rect = this.canvas!.getBoundingClientRect();
        const x = event.touches[0].clientX - rect.left;
        const y = event.touches[0].clientY - rect.top;
        
        this.handleInteraction(x, y);
      }
    });
    
    // Handle keyboard events
    window.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        // Space bar to pause/resume
        if (this.gameStateManager.getState() === GameStateEnum.PLAYING) {
          this.gameStateManager.pauseGame();
        } else if (this.gameStateManager.getState() === GameStateEnum.PAUSED) {
          this.gameStateManager.startGame();
        }
      }
    });
  }
  
  /**
   * Handle interaction (clicks/taps)
   */
  private handleInteraction(x: number, y: number): void {
    const currentState = this.gameStateManager.getState();
    
    if (currentState === GameStateEnum.START) {
      // If on start screen, begin the game
      this.gameStateManager.startGame();
      this.initMergerGame();
      return;
    }
    
    if (currentState === GameStateEnum.GAME_OVER) {
      // If game over, restart the game on interaction
      this.restart();
      return;
    }
    
    if (currentState === GameStateEnum.PLAYING && this.mergerGame) {
      // In Suika-style gameplay, x coordinate determines where to drop the shape
      this.mergerGame.handleInteraction(x, y);
    }
  }

  
  /**
   * Handle game over state
   */
  private gameOver(): void {
    this.gameStateManager.endGame();
    
    // Initialize the losing screen with the final score and restart callback
    if (this.context && this.canvas) {
      this.losingScreen = new LosingScreen(
        this.canvas,
        this.context,
        {
          score: this.score,
          onRestart: () => this.restart()
        }
      );
    }
  }
  
  /**
   * Restart the game
   */
  public restart(): void {
    // Reset game variables
    this.score = 0;
    this.shapes = [];
    
    // Reset the physics engine if it exists
    if (this.engine) {
      const physicsWorld = createPhysicsWorld({
        width: CANVAS.WIDTH,
        height: CANVAS.HEIGHT,
        gravity: this.settings.gravity || { x: 0, y: PHYSICS.GRAVITY }
      });
      this.engine = physicsWorld.engine;
    }
    
    // Initialize a fresh merger game
    this.initMergerGame();
    
    // Change game state to PLAYING
    this.gameStateManager.startGame();
  }

  /**
   * Update game state based on elapsed time
   */
  private update(deltaTime: number): void {
    // Convert deltaTime from milliseconds to seconds
    const deltaTimeInSeconds = deltaTime / 1000;
    
    const currentState = this.gameStateManager.getState();
    
    // Update start screen if in START state
    if (currentState === GameStateEnum.START && this.startScreen) {
      this.startScreen.update(deltaTimeInSeconds);
      return;
    }
    
    // In PLAYING state, only update the merger game
    if (currentState === GameStateEnum.PLAYING && this.mergerGame) {
      this.mergerGame.update(deltaTimeInSeconds);
    }
  }

  /**
   * Render the current game state
   */
  private render(): void {
    if (!this.context || !this.canvas) return;
    
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const currentState = this.gameStateManager.getState();
    
    // If in START state, render start screen
    if (currentState === GameStateEnum.START) {
      if (this.startScreen) {
        this.startScreen.render();
      }
      return;
    }
    
    // If in GAME_OVER state, render losing screen
    if (currentState === GameStateEnum.GAME_OVER) {
      if (this.losingScreen) {
        this.losingScreen.render();
      }
      return;
    }
    
    // In PLAYING state, render the Suika-style merger game
    if (currentState === GameStateEnum.PLAYING && this.mergerGame) {
      this.mergerGame.render();
    }
    
    // Render UI elements based on game state
    this.renderGameUI();
  }

  /**
   * Render game UI based on current state
   */
  private renderGameUI(): void {
    if (!this.context) return;
    
    const currentState = this.gameStateManager.getState();
    
    // Don't render UI elements if we're on the start screen
    if (currentState === GameStateEnum.START) {
      return;
    }
    
    // Render score (except when on game over screen which has its own score display)
    if (currentState !== GameStateEnum.GAME_OVER) {
      renderScoreDisplay(this.context, this.score);
    }
    
    // Render state-specific UI elements
    if (currentState === GameStateEnum.PAUSED) {
      renderTextDisplay(this.context, "PAUSED", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
    }
  }

  /**
   * Start the main game loop
   */
  private startGameLoop(): void {
    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Update game based on current state
      this.update(deltaTime);
      
      // Always render
      this.render();
      
      // Continue the loop
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Start the loop
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

/**
 * Create and return a new game instance
 */
export function createGame(settings: IGameSettings): Game {
  return new Game(settings);
}

/**
 * Initialize a game on the provided canvas element
 */
export function initializeGame(canvasElement: HTMLCanvasElement, settings: IGameSettings): Game {
  const game = createGame(settings);
  game.initialize(canvasElement);
  return game;
}

// Export the Game class for direct access
export { Game };