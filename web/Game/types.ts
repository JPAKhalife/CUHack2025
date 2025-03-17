/**
 * Types for the Shapesplosion game
 * Contains shared interfaces, types and enums used throughout the game
 */

import Matter from "matter-js";

/**
 * Available shape types in the game
 */
export enum ShapeType {
  CIRCLE = "circle",
  SQUARE = "square",
  TRIANGLE = "triangle",
  PENTAGON = "pentagon",
  HEXAGON = "hexagon"
}

/**
 * Game difficulty levels
 */
export enum DifficultyLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  INSANE = "insane"
}

/**
 * Game states
 */
export enum GameState {
  INITIALIZING = "initializing",
  MENU = "menu",
  PLAYING = "playing",
  PAUSED = "paused",
  GAME_OVER = "gameOver"
}

/**
 * Interface for a shape object
 */
export interface IShape {
  id: string;
  type: ShapeType;
  position: IVector;
  velocity: IVector;
  angle: number;
  angularVelocity: number;
  scale: number;
  color: string;
  opacity: number;
  zIndex: number;
  isStatic: boolean;
  body?: Matter.Body;
  texture?: string;
  health?: number;
  points?: number;
}

/**
 * Interface for a 2D vector
 */
export interface IVector {
  x: number;
  y: number;
}

/**
 * Interface for game settings
 */
export interface IGameSettings {
  width: number;
  height: number;
  gravity: IVector;
  maxShapes: number;
  spawnRate: number;
  difficulty: DifficultyLevel;
  soundEnabled: boolean;
  backgroundMusic: boolean;
  particleEffects: boolean;
}

/**
 * Interface for player data
 */
export interface IPlayer {
  id: string;
  score: number;
  highScore: number;
  lives: number;
  level: number;
  powerups: IPowerup[];
}

/**
 * Interface for powerups
 */
export interface IPowerup {
  id: string;
  type: PowerupType;
  duration: number;
  active: boolean;
  activatedAt?: number;
}

/**
 * Available powerup types
 */
export enum PowerupType {
  SLOW_TIME = "slowTime",
  SHIELD = "shield",
  MULTI_SCORE = "multiScore",
  EXTRA_LIFE = "extraLife",
  BOMB = "bomb"
}

/**
 * Interface for game levels
 */
export interface ILevel {
  id: number;
  name: string;
  targetScore: number;
  timeLimit?: number;
  shapeTypes: ShapeType[];
  spawnRate: number;
  special?: boolean;
  background?: string;
}

/**
 * Interface for collision data
 */
export interface ICollision {
  bodyA: Matter.Body;
  bodyB: Matter.Body;
  pairs: Matter.Pair[];
}

/**
 * Interface for particle effects
 */
export interface IParticle {
  id: string;
  position: IVector;
  velocity: IVector;
  size: number;
  color: string;
  opacity: number;
  lifespan: number;
  age: number;
}

/**
 * Interface for game progress/save data
 */
export interface IGameProgress {
  userId: string;
  lastLevel: number;
  unlockedLevels: number[];
  totalScore: number;
  achievements: string[];
  playTime: number;
}

/**
 * Interface for client session
 */
export interface IClientSession {
  clientId: string;
  startedAt: number;
  lastInteraction: number;
}

/**
 * Interface for game configuration
 */
export interface IGameConfig {
  width: number;
  height: number;
  difficulty: DifficultyLevel;
  maxShapes: number;
  initialShapes: number;
  mergeThreshold: number;
  gravity: IVector;
  spawnInterval: number;
  backgroundColor: string;
  shapeTypes: ShapeType[];
  soundEnabled: boolean;
  particleEffects: boolean;
  debugMode?: boolean;
}

/**
 * Interface for game callbacks
 */
export interface IGameCallbacks {
  onShapeMerge?: (shapes: IShape[], result: IShape) => void;
  onScoreUpdate?: (score: number) => void;
  onGameOver?: (finalScore: number, level: number) => void;
  onLevelComplete?: (level: number, score: number) => void;
  onStateChange?: (oldState: GameState, newState: GameState) => void;
  onShapeSpawn?: (shape: IShape) => void;
  onShapeDestroy?: (shape: IShape) => void;
  onPowerupCollected?: (powerup: IPowerup) => void;
}