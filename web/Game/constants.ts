/**
 * Game Constants
 * This file contains all the constants used throughout the game
 */

// Shape Types
export const SHAPE_TYPES = {
  CIRCLE: 'circle',
  SQUARE: 'square',
  TRIANGLE: 'triangle',
  PENTAGON: 'pentagon',
  HEXAGON: 'hexagon',
  STAR: 'star'
} as const;

// Shape Hierarchy (higher value = more powerful)
export const SHAPE_HIERARCHY = {
  [SHAPE_TYPES.CIRCLE]: 1,
  [SHAPE_TYPES.SQUARE]: 2,
  [SHAPE_TYPES.TRIANGLE]: 3,
  [SHAPE_TYPES.PENTAGON]: 4,
  [SHAPE_TYPES.HEXAGON]: 5,
  [SHAPE_TYPES.STAR]: 6
} as const;

// Shape Colors
export const SHAPE_COLORS = {
  [SHAPE_TYPES.CIRCLE]: '#FF5252', // Red
  [SHAPE_TYPES.SQUARE]: '#4CAF50', // Green
  [SHAPE_TYPES.TRIANGLE]: '#2196F3', // Blue
  [SHAPE_TYPES.PENTAGON]: '#FFC107', // Amber
  [SHAPE_TYPES.HEXAGON]: '#9C27B0', // Purple
  [SHAPE_TYPES.STAR]: '#FFEB3B' // Yellow
} as const;

// Shape Sizes (in pixels)
export const SHAPE_SIZES = {
  SMALL: 30,
  MEDIUM: 50,
  LARGE: 70,
  HUGE: 100
} as const;

// Physics Constants
export const PHYSICS = {
  GRAVITY: 0.2,
  BOUNCE: 0.7,
  FRICTION: 0.05,
  AIR_RESISTANCE: 0.02,
  MAX_VELOCITY: 15,
  EXPLOSION_FORCE: 10
} as const;

// Game Difficulty Levels
export const DIFFICULTY = {
  EASY: {
    SPAWN_RATE: 2000, // ms between spawns
    INITIAL_SHAPES: 5,
    MAX_SHAPES: 20,
    TIME_LIMIT: 120000 // 2 minutes
  },
  MEDIUM: {
    SPAWN_RATE: 1500,
    INITIAL_SHAPES: 8,
    MAX_SHAPES: 30,
    TIME_LIMIT: 90000 // 1.5 minutes
  },
  HARD: {
    SPAWN_RATE: 1000,
    INITIAL_SHAPES: 12,
    MAX_SHAPES: 40,
    TIME_LIMIT: 60000 // 1 minute
  },
  IMPOSSIBLE: {
    SPAWN_RATE: 500,
    INITIAL_SHAPES: 15,
    MAX_SHAPES: 50,
    TIME_LIMIT: 45000 // 45 seconds
  }
} as const;

// Scoring Constants
export const SCORING = {
  BASE_POINTS: 10,
  COMBO_MULTIPLIER: 1.5,
  SHAPE_POINTS: {
    [SHAPE_TYPES.CIRCLE]: 10,
    [SHAPE_TYPES.SQUARE]: 20,
    [SHAPE_TYPES.TRIANGLE]: 30,
    [SHAPE_TYPES.PENTAGON]: 50,
    [SHAPE_TYPES.HEXAGON]: 75,
    [SHAPE_TYPES.STAR]: 100
  },
  TIME_BONUS_FACTOR: 0.1 // points per second remaining
} as const;

// Game States
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  HIGH_SCORES: 'high_scores'
} as const;

// Canvas Settings
export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: '#1E1E1E',
  BORDER_COLOR: '#333333',
  BORDER_WIDTH: 2
} as const;

// UI Constants
export const UI = {
  FONT_FAMILY: '"Roboto", sans-serif',
  TITLE_FONT_SIZE: '48px',
  SUBTITLE_FONT_SIZE: '24px',
  BUTTON_FONT_SIZE: '18px',
  TEXT_COLOR: '#FFFFFF',
  BUTTON_COLORS: {
    BACKGROUND: '#4CAF50',
    HOVER: '#45A049',
    TEXT: '#FFFFFF'
  },
  BUTTON_PADDING: '10px 15px',
  BUTTON_BORDER_RADIUS: '5px',
  SCORE_POSITION: { x: 20, y: 30 },
  TIME_POSITION: { x: 20, y: 60 },
  COMBO_POSITION: { x: 20, y: 90 }
} as const;

// Animation Constants
export const ANIMATION = {
  EXPLOSION_DURATION: 500, // ms
  EXPLOSION_PARTICLE_COUNT: 20,
  EXPLOSION_RADIUS: 100,
  SHAPE_SPAWN_ANIMATION_DURATION: 300, // ms
  SHAPE_DEATH_ANIMATION_DURATION: 200, // ms
  COMBO_TEXT_ANIMATION_DURATION: 1000 // ms
} as const;

// Sound Effects
export const SOUNDS = {
  BACKGROUND_MUSIC_VOLUME: 0.5,
  EFFECTS_VOLUME: 0.7,
  CLICK_SOUND: 'click',
  EXPLOSION_SOUND: 'explosion',
  COMBO_SOUND: 'combo',
  GAME_OVER_SOUND: 'gameOver',
  LEVEL_UP_SOUND: 'levelUp'
} as const;

// Game URLs
export const ASSETS = {
  SHAPEY_HAPPY: '/ShapeyHappy.png',
  SHAPEY_ANGRY: '/ShapeyAngry.png',
  SHAPEY_ROLLING: '/ShapeyRolling.png'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  HIGH_SCORES: 'shapesplosionHighScores',
  SETTINGS: 'shapesplosionSettings',
  LAST_PLAYED: 'shapesplosionLastPlayed'
} as const;