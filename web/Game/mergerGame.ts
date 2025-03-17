


/**
 * Enum representing different types of shapes in the game
 */
export enum ShapeType {
  Circle = "circle",
  Square = "square",
  Triangle = "triangle",
  Trapezoid = "trapezoid",
  Pentagon = "pentagon",
  Rhombus = "rhombus",
  Octagon = "octagon",
  Star = "star"
}

/**
 * Interface for a 2D vector
 */
export interface Vector {
  x: number;
  y: number;
}

/**
 * Interface for a physical shape in the game
 */
export interface IShape {
  type: ShapeType;
  position: Vector;
  velocity: Vector;
  radius: number;
  rotation: number;
  angularVelocity: number;
  color: string;
  isStatic: boolean;
  restTimer?: number;      // Timer to track how long the shape has been at rest
  isResting?: boolean;     // Flag to indicate the shape has settled and is at rest
  mergeCandidate?: boolean; // Flag to indicate this shape is a candidate for merging (for debug visuals)
}

/**
 * Interface for game configuration options
 */
export interface IGameConfig {
  containerWidth?: number;
  containerHeight?: number;
  gravity?: number;
  friction?: number;
  restitution?: number;
  dropZoneHeight?: number;
}

/**
 * Interface for game callback functions
 */
export interface IGameCallbacks {
  onScoreUpdate?: (score: number) => void;
  onGameOver?: (finalScore: number) => void;
}

/**
 * MergerGame class that handles the core game mechanics for a Suika-like merger game
 * Self-contained with all necessary logic for physics, rendering, and game mechanics
 */
export class MergerGame {
  // Default physics constants
  private static readonly PHYSICS = {
    GRAVITY: 980, // pixels per second squared
    FRICTION: 0.05,
    RESTITUTION: 0.5, // bounciness
    MOVE_SPEED: 300, // pixels per second
    MAX_VELOCITY: 2000,
    MAX_ANGULAR_VELOCITY: 4.0, // radians per second
    ANGULAR_DAMPING: 0.95 // angular velocity multiplier per second
  };
  
  // Default canvas settings
  private static readonly CANVAS = {
    DROP_ZONE_HEIGHT: 100,
    BOUNDARY_COLOR: '#333',
    DROP_LINE_COLOR: '#ff0000'
  };
  
  // Collision detection constants
  private static readonly MERGE_THRESHOLD_MULTIPLIER = 1.15; // More generous threshold for merging
  
  /**
   * Represents the merger progression for shapes
   * When two identical shapes collide, they merge into the next shape in the hierarchy
   */
  private static readonly MERGE_HIERARCHY: { [key in ShapeType]?: ShapeType } = {
    [ShapeType.Circle]: ShapeType.Square,
    [ShapeType.Square]: ShapeType.Triangle,
    [ShapeType.Triangle]: ShapeType.Trapezoid,
    [ShapeType.Trapezoid]: ShapeType.Pentagon,
    [ShapeType.Pentagon]: ShapeType.Rhombus,
    [ShapeType.Rhombus]: ShapeType.Octagon,
    [ShapeType.Octagon]: ShapeType.Star,
    // Star is the final shape with no upgrade
  };
  
  // Points awarded for each merge based on the resulting shape
  private static readonly MERGE_POINTS: { [key in ShapeType]: number } = {
    [ShapeType.Circle]: 0, // Base shape, no points
    [ShapeType.Square]: 10,
    [ShapeType.Triangle]: 25,
    [ShapeType.Trapezoid]: 50,
    [ShapeType.Pentagon]: 100,
    [ShapeType.Rhombus]: 200,
    [ShapeType.Octagon]: 400,
    [ShapeType.Star]: 800,
  };
  
  private shapes: IShape[] = [];
  private config: IGameConfig;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  
  private activeShape: IShape | null = null;
  private nextShape: IShape | null = null;
  private dropPosition: number; // X position for dropping
  private isGameOver: boolean = false;
  private score: number = 0;
  private mergeAnimations: { shape: IShape, timer: number }[] = [];
  private pendingMergeChecks: boolean = false;
  private mergeCheckDelay: number = 0.5; // Delay in seconds before checking for merges
  private mergeCheckTimer: number = 0;
  private debugMode: boolean = false; // Toggle for showing debug visuals
  
  // Controls
  private leftPressed: boolean = false;
  private rightPressed: boolean = false;
  private dropPressed: boolean = false;
  private mousePosition: Vector = { x: 0, y: 0 };
  private isDragging: boolean = false;
  
  // Shape sizes mapping to handle any potential mismatches
  private shapeSizes: { [key in ShapeType]: number };
  private shapeColors: { [key in ShapeType]: string };
  // Shape-specific collision radius modifiers
  private shapeCollisionModifiers: { [key in ShapeType]: number };
  
  // Callback functions
  private onScoreUpdate: (score: number) => void = () => {};
  private onGameOver: (finalScore: number) => void = () => {};
  
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    config?: IGameConfig,
    callbacks?: IGameCallbacks
  ) {
    this.canvas = canvas;
    this.context = context;
    this.config = {
      containerWidth: canvas.width,
      containerHeight: canvas.height,
      gravity: MergerGame.PHYSICS.GRAVITY,
      friction: MergerGame.PHYSICS.FRICTION,
      restitution: MergerGame.PHYSICS.RESTITUTION,
      dropZoneHeight: MergerGame.CANVAS.DROP_ZONE_HEIGHT,
      ...config
    };
    this.shapes = [];
    
    // Initialize drop position to the middle of the canvas
    this.dropPosition = this.canvas.width / 2;
    
    // Define shape sizes and colors with hardcoded values
    this.shapeSizes = {
      [ShapeType.Circle]: 25,
      [ShapeType.Square]: 35,
      [ShapeType.Triangle]: 45,
      [ShapeType.Trapezoid]: 55,
      [ShapeType.Pentagon]: 65,
      [ShapeType.Rhombus]: 75,
      [ShapeType.Octagon]: 85,
      [ShapeType.Star]: 95
    };
    
    this.shapeColors = {
      [ShapeType.Circle]: '#FF5733', // Orange-red
      [ShapeType.Square]: '#33FF57', // Green
      [ShapeType.Triangle]: '#3357FF', // Blue
      [ShapeType.Trapezoid]: '#FFD700', // Gold
      [ShapeType.Pentagon]: '#F033FF', // Purple
      [ShapeType.Rhombus]: '#00FFFF', // Cyan
      [ShapeType.Octagon]: '#FF1493', // Deep pink
      [ShapeType.Star]: '#FFFF00' // Yellow
    };
    
    // Initialize collision modifiers for each shape type
    this.shapeCollisionModifiers = {
      [ShapeType.Circle]: 1.0,
      [ShapeType.Square]: 1.0,
      [ShapeType.Triangle]: 1.1, // 10% larger collision radius for triangles
      [ShapeType.Trapezoid]: 1.0,
      [ShapeType.Pentagon]: 1.0,
      [ShapeType.Rhombus]: 1.0,
      [ShapeType.Octagon]: 1.0,
      [ShapeType.Star]: 1.0
    };
    
    // Set up callbacks
    if (callbacks) {
      if (callbacks.onScoreUpdate) {
        this.onScoreUpdate = callbacks.onScoreUpdate;
      }
      if (callbacks.onGameOver) {
        this.onGameOver = callbacks.onGameOver;
      }
    }
  }
  
  /**
   * Initializes the game when the start button is clicked
   */
  /**
   * Set debug mode state
   * @param enabled Whether debug mode should be enabled
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }
  
  /**
   * Initializes the game when the start button is clicked
   */
  public initialize(): void {
    this.shapes = [];
    this.isGameOver = false;
    this.score = 0;
    this.mergeAnimations = [];
    this.pendingMergeChecks = false;
    this.dropPosition = this.canvas.width / 2;
    
    // Set up event listeners for controls
    this.setupControls();
    
    // Generate the first active and next shapes
    this.generateNewActiveShape();
    this.generateNextShape();
    
    // Ensure the active shape starts at the top
    if (this.activeShape) {
      this.activeShape.position.y = this.activeShape.radius + 10;
      this.activeShape.isStatic = true;
    }
  }
  
  /**
   * Set up keyboard and mouse event listeners for controlling the game
   */
  private setupControls(): void {
    // Remove any existing event listeners to prevent duplicates
    this.removeEventListeners();
    
    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.leftPressed = true;
          break;
        case 'ArrowRight':
          this.rightPressed = true;
          break;
        case 'ArrowDown':
        case ' ': // Space
          if (this.isGameOver) {
            this.restart();
          } else {
            this.dropPressed = true;
          }
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.leftPressed = false;
          break;
        case 'ArrowRight':
          this.rightPressed = false;
          break;
        case 'ArrowDown':
        case ' ': // Space
          this.dropPressed = false;
          break;
      }
    };
    
    // Mouse/Touch controls for mobile support
    const handleMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      if (this.activeShape && this.activeShape.isStatic && this.isDragging) {
        this.dropPosition = Math.max(
          this.activeShape.radius,
          Math.min(this.config.containerWidth! - this.activeShape.radius, this.mousePosition.x)
        );
      }
    };
    
    const handleMouseDown = () => {
      this.isDragging = true;
    };
    
    const handleMouseUp = () => {
      this.isDragging = false;
      if (this.activeShape && this.activeShape.isStatic) {
        this.activeShape.isStatic = false;
        this.activeShape.velocity = { x: 0, y: 50 };
      }
    };
    
    // Touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
      
      if (this.activeShape && this.activeShape.isStatic) {
        this.dropPosition = Math.max(
          this.activeShape.radius,
          Math.min(this.config.containerWidth! - this.activeShape.radius, this.mousePosition.x)
        );
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      this.isDragging = true;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      this.isDragging = false;
      if (this.activeShape && this.activeShape.isStatic) {
        this.activeShape.isStatic = false;
        this.activeShape.velocity = { x: 0, y: 50 };
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    this.canvas.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mousedown', handleMouseDown);
    this.canvas.addEventListener('mouseup', handleMouseUp);
    this.canvas.addEventListener('touchmove', handleTouchMove);
    this.canvas.addEventListener('touchstart', handleTouchStart);
    this.canvas.addEventListener('touchend', handleTouchEnd);
    
    // Store event listeners for later removal
    this._eventListeners = {
      keydown: handleKeyDown,
      keyup: handleKeyUp,
      mousemove: handleMouseMove,
      mousedown: handleMouseDown,
      mouseup: handleMouseUp,
      touchmove: handleTouchMove,
      touchstart: handleTouchStart,
      touchend: handleTouchEnd
    };
  }
  
  // Store event listeners for cleanup
  private _eventListeners: {
    keydown: (e: KeyboardEvent) => void;
    keyup: (e: KeyboardEvent) => void;
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    mouseup: (e: MouseEvent) => void;
    touchmove: (e: TouchEvent) => void;
    touchstart: (e: TouchEvent) => void;
    touchend: (e: TouchEvent) => void;
  } | null = null;
  
  /**
   * Cleanup event listeners to prevent memory leaks
   */
  private removeEventListeners(): void {
    if (this._eventListeners) {
      window.removeEventListener('keydown', this._eventListeners.keydown);
      window.removeEventListener('keyup', this._eventListeners.keyup);
      this.canvas.removeEventListener('mousemove', this._eventListeners.mousemove);
      this.canvas.removeEventListener('mousedown', this._eventListeners.mousedown);
      this.canvas.removeEventListener('mouseup', this._eventListeners.mouseup);
      this.canvas.removeEventListener('touchmove', this._eventListeners.touchmove);
      this.canvas.removeEventListener('touchstart', this._eventListeners.touchstart);
      this.canvas.removeEventListener('touchend', this._eventListeners.touchend);
      this._eventListeners = null;
    }
  }
  
  /**
   * Cleanup resources when the game is no longer needed
   */
  public dispose(): void {
    this.removeEventListeners();
  }
  
  /**
   * Handle mouse/touch interaction with the game
   * @param x X coordinate of the interaction
   * @param y Y coordinate of the interaction
   * @param type Type of interaction (click, move, etc)
   */
  public handleInteraction(x: number, y: number, type?: 'click' | 'move' | 'down' | 'up'): void {
    this.mousePosition = { x, y };
    
    // If type is not provided, default to 'move'
    const interactionType = type || 'move';
    
    switch (interactionType) {
      case 'move':
        // Always update the drop position when moving, no need to drag
        if (this.activeShape && this.activeShape.isStatic) {
          this.dropPosition = Math.max(
            this.activeShape.radius,
            Math.min(this.canvas.width - this.activeShape.radius, x)
          );
          this.activeShape.position.x = this.dropPosition;
        }
        break;
      case 'down':
        this.isDragging = true;
        // On mouse down, drop the active shape
        if (!this.isGameOver && this.activeShape && this.activeShape.isStatic) {
          this.dropActiveShape();
        }
        break;
      case 'up':
      case 'click':
        this.isDragging = false;
        if (this.isGameOver) {
          this.restart();
        } else if (this.activeShape && this.activeShape.isStatic) {
          this.dropActiveShape();
        }
        break;
    }
  }
  
  /**
   * Drops the active shape into the game
   */
  private dropActiveShape(): void {
    if (this.activeShape && this.activeShape.isStatic) {
      this.activeShape.isStatic = false;
      this.activeShape.velocity = { x: 0, y: 50 };
    }
  }
  
  /**
   * Create a new shape with the given properties
   */
  private createShape(
    type: ShapeType,
    position: Vector,
    radius: number,
    color: string,
    rotation: number
  ): IShape {
    return {
      type,
      position: { ...position },
      velocity: { x: 0, y: 0 },
      radius,
      rotation,
      angularVelocity: 0,
      color,
      isStatic: true
    };
  }
  
  /**
   * Draw a shape on the canvas
   */
  private drawShape(ctx: CanvasRenderingContext2D, shape: IShape): void {
    ctx.save();
    ctx.translate(shape.position.x, shape.position.y);
    ctx.rotate(shape.rotation);
    
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    switch (shape.type) {
      case ShapeType.Circle:
        ctx.beginPath();
        ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Square:
        const size = shape.radius * 1.8;
        ctx.beginPath();
        ctx.rect(-size / 2, -size / 2, size, size);
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Triangle:
        const triangleSize = shape.radius * 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -triangleSize);
        ctx.lineTo(triangleSize * Math.cos(Math.PI/6), triangleSize * Math.sin(Math.PI/6));
        ctx.lineTo(-triangleSize * Math.cos(Math.PI/6), triangleSize * Math.sin(Math.PI/6));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Trapezoid:
        const trapWidth = shape.radius * 1.8;
        const trapHeight = shape.radius * 1.5;
        const topWidth = trapWidth * 0.6;
        ctx.beginPath();
        ctx.moveTo(-topWidth / 2, -trapHeight / 2);
        ctx.lineTo(topWidth / 2, -trapHeight / 2);
        ctx.lineTo(trapWidth / 2, trapHeight / 2);
        ctx.lineTo(-trapWidth / 2, trapHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Pentagon:
        const pentagonSize = shape.radius * 1.5;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = pentagonSize * Math.cos(angle);
          const y = pentagonSize * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Rhombus:
        const rhombusSize = shape.radius * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -rhombusSize);
        ctx.lineTo(rhombusSize * 0.8, 0);
        ctx.lineTo(0, rhombusSize);
        ctx.lineTo(-rhombusSize * 0.8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Octagon:
        const octagonSize = shape.radius * 1.4;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          const x = octagonSize * Math.cos(angle);
          const y = octagonSize * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.Star:
        const starOuterRadius = shape.radius * 1.5;
        const starInnerRadius = starOuterRadius * 0.5;
        const starPoints = 5;
        
        ctx.beginPath();
        for (let i = 0; i < starPoints * 2; i++) {
          const radius = i % 2 === 0 ? starOuterRadius : starInnerRadius;
          const angle = (Math.PI * i) / starPoints - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }
  
  /**
   * Generate a new shape to become the active dropping shape
   */
  private generateNewActiveShape(): void {
    // If we have a next shape, make it the active shape
    if (this.nextShape) {
      this.activeShape = this.nextShape;
      this.activeShape.position = { 
        x: this.dropPosition, 
        y: this.activeShape.radius + 10 // Position at the top of the screen with small margin
      };
    } else {
      // Create a new shape if there's no next shape (first run)
      const shapeType = this.getRandomShapeType();
      this.activeShape = this.createShape(
        shapeType,
        { 
          x: this.dropPosition, 
          y: this.shapeSizes[shapeType] + 10 // Position at the top with small margin
        },
        this.shapeSizes[shapeType],
        this.shapeColors[shapeType],
        0 // Initial rotation
      );
      this.activeShape.velocity = { x: 0, y: 0 };
    }
    
    // Set as static so it follows mouse movement
    this.activeShape.isStatic = true;
    
    // Generate the next shape
    this.generateNextShape();
    
    // Check if the new active shape immediately collides with existing shapes
    // If it does, the game is over
    const collides = this.shapes.some(shape => 
      this.bodiesAreColliding(this.activeShape!, shape)
    );
    
    if (collides) {
      this.isGameOver = true;
      this.onGameOver(this.score);
    }
  }
  
  /**
   * Generate the next shape to be dropped
   */
  private generateNextShape(): void {
    const shapeType = this.getRandomShapeType();
    this.nextShape = this.createShape(
      shapeType,
      { 
        x: this.canvas.width - 100, 
        y: 50 
      },
      this.shapeSizes[shapeType],
      this.shapeColors[shapeType],
      0 // Initial rotation
    );
    this.nextShape.velocity = { x: 0, y: 0 };
    this.nextShape.isStatic = true;
  }
  
  /**
   * Get a random shape type with a bias towards smaller shapes
   */
  private getRandomShapeType(): ShapeType {
    // Weight the distribution to favor smaller shapes
    // Only include shapes that exist in our ShapeType enum
    const weights = [
      { type: ShapeType.Circle, weight: 60 },
      { type: ShapeType.Square, weight: 25 },
      { type: ShapeType.Triangle, weight: 10 },
      { type: ShapeType.Trapezoid, weight: 3 },
      { type: ShapeType.Pentagon, weight: 1 },
      { type: ShapeType.Rhombus, weight: 0.5 },
      { type: ShapeType.Octagon, weight: 0.3 },
      { type: ShapeType.Star, weight: 0.2 },
    ];
    
    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of weights) {
      if (random < item.weight) {
        return item.type;
      }
      random -= item.weight;
    }
    
    // Fallback to circle if something goes wrong
    return ShapeType.Circle;
  }
  
  /**
   * Main game update loop
   * @param deltaTime Time elapsed since last update in seconds
   */
  public update(deltaTime: number): void {
    if (this.isGameOver) return;
    
    // Handle user input
    this.handleInput(deltaTime);
    
    // Update dropping shape
    this.updateActiveShape(deltaTime);
    
    // Update all shapes in the game state
    this.updatePhysics(deltaTime);
    
    // Update merge check timer if needed
    if (this.pendingMergeChecks) {
      this.mergeCheckTimer -= deltaTime;
      // When timer expires, check for merges
      if (this.mergeCheckTimer <= 0) {
        this.checkForMerges();
        this.pendingMergeChecks = false;
      }
    }
    
    // Clear merge candidate flags before next physics update
    this.clearMergeCandidateFlags();
    
    // Update merge animations
    this.updateMergeAnimations(deltaTime);
    
    // Check for game over condition (shapes above the container limit)
    this.checkGameOverCondition();
  }
  
  /**
   * Handle player input for moving and dropping shapes
   */
  private handleInput(deltaTime: number): void {
    if (!this.activeShape) return;
    
    const moveSpeed = MergerGame.PHYSICS.MOVE_SPEED * deltaTime;
    
    // Move left and right
    if (this.leftPressed) {
      this.dropPosition = Math.max(
        this.activeShape.radius,
        this.dropPosition - moveSpeed
      );
    }
    
    if (this.rightPressed) {
      this.dropPosition = Math.min(
        this.canvas.width - this.activeShape.radius,
        this.dropPosition + moveSpeed
      );
    }
    
    // Update the active shape X position
    if (this.activeShape.isStatic) {
      this.activeShape.position.x = this.dropPosition;
    }
    
    // Drop the shape when down is pressed
    if (this.dropPressed && this.activeShape.isStatic) {
      this.activeShape.isStatic = false;
      // Apply a small initial velocity
      this.activeShape.velocity = { x: 0, y: 50 };
    }
  }
  
  /**
   * Update the active (falling) shape
   */
  private updateActiveShape(deltaTime: number): void {
    if (!this.activeShape) return;
    
    // If the active shape is no longer falling (has landed), generate a new one
    if (!this.activeShape.isStatic && Math.abs(this.activeShape.velocity.y) < 10) {
      // Set velocity to zero to ensure it's really stopped
      this.activeShape.velocity.y = 0;
      this.activeShape.velocity.x = 0;
      // Add the shape to the game state
      this.shapes.push(this.activeShape);
      // Start a delayed merge check
      this.pendingMergeChecks = true;
      this.mergeCheckTimer = this.mergeCheckDelay;
      // Generate a new active shape
      this.generateNewActiveShape();
    } else if (this.activeShape.isStatic) {
      // If still in drop zone, update position based on drop position
      this.activeShape.position.x = this.dropPosition;
    }
  }
  
  /**
   * Update physics for all shapes in the game
   * @param deltaTime Time elapsed since last update in seconds
   */
  private updatePhysics(deltaTime: number): void {
    const gravity = this.config.gravity || MergerGame.PHYSICS.GRAVITY;
    const friction = this.config.friction || MergerGame.PHYSICS.FRICTION;
    const restitution = this.config.restitution || MergerGame.PHYSICS.RESTITUTION;
    const maxVelocity = MergerGame.PHYSICS.MAX_VELOCITY;
    
    // Update the active shape if it's not static
    if (this.activeShape && !this.activeShape.isStatic) {
      this.updateShapePhysics(this.activeShape, deltaTime, gravity, friction, restitution, maxVelocity);
      
      // Check for collisions with other shapes
      for (const shape of this.shapes) {
        if (this.bodiesAreColliding(this.activeShape, shape)) {
          this.resolveCollision(this.activeShape, shape, restitution);
        }
      }
      
      // Check for collisions with container boundaries
      this.handleContainerCollisions(this.activeShape, restitution);
    }
    
    // Update all existing shapes
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      
      if (shape.isStatic) continue;
      
      this.updateShapePhysics(shape, deltaTime, gravity, friction, restitution, maxVelocity);
      
      // Check for collisions with other shapes
      for (let j = i + 1; j < this.shapes.length; j++) {
        const otherShape = this.shapes[j];
        
        if (otherShape.isStatic) continue;
        
        if (this.bodiesAreColliding(shape, otherShape)) {
          this.resolveCollision(shape, otherShape, restitution);
        }
      }
      
      // Check for collisions with container boundaries
      this.handleContainerCollisions(shape, restitution);
    }
  }
  
  /**
   * Update physics for a single shape
   */
  private updateShapePhysics(shape: IShape, deltaTime: number, gravity: number, friction: number, restitution: number, maxVelocity: number): void {
    // Apply gravity
    if (!shape.isStatic) {
      shape.velocity.y += gravity * deltaTime;
    }
    
    // Apply friction (only when touching ground or moving very slowly)
    const isOnGround = Math.abs(shape.position.y + shape.radius - this.config.containerHeight!) < 1;
    if (isOnGround) {
      shape.velocity.x *= (1 - friction);
      
      // Stop very slow movement
      if (Math.abs(shape.velocity.x) < 1) {
        shape.velocity.x = 0;
      }
      
      // Apply enhanced ground friction to angular velocity
      shape.angularVelocity *= (1 - friction * 3);
    }
    
    // Always apply some angular damping to prevent excessive spinning
    shape.angularVelocity *= Math.pow(MergerGame.PHYSICS.ANGULAR_DAMPING, deltaTime);
    
    // Dampen angular velocity more when shape is moving slowly
    if (Math.abs(shape.velocity.x) < 20 && Math.abs(shape.velocity.y) < 20) {
      shape.angularVelocity *= 0.97;
    }
    
    // Update position based on velocity
    shape.position.x += shape.velocity.x * deltaTime;
    shape.position.y += shape.velocity.y * deltaTime;
    
    // Update rotation based on angular velocity
    shape.rotation += shape.angularVelocity * deltaTime;
    
    // Clamp velocity to maximum values to prevent extreme physics behavior
    const speed = Math.sqrt(shape.velocity.x * shape.velocity.x + shape.velocity.y * shape.velocity.y);
    if (speed > maxVelocity) {
      shape.velocity.x = (shape.velocity.x / speed) * maxVelocity;
      shape.velocity.y = (shape.velocity.y / speed) * maxVelocity;
    }
    
    // Clamp angular velocity to prevent excessive spinning
    if (Math.abs(shape.angularVelocity) > MergerGame.PHYSICS.MAX_ANGULAR_VELOCITY) {
      shape.angularVelocity = Math.sign(shape.angularVelocity) * MergerGame.PHYSICS.MAX_ANGULAR_VELOCITY;
    }
    
    // Track if shape is resting
    if (!shape.isStatic) {
      if (Math.abs(shape.velocity.x) < 5 && Math.abs(shape.velocity.y) < 5) {
        // Shape is moving very slowly, may be coming to rest
        if (!shape.restTimer) {
          shape.restTimer = 0;
        }
        shape.restTimer += deltaTime;
        
        // If shape has been slow for a while, consider it at rest
        if (shape.restTimer > 0.2) {
          shape.isResting = true;
          
          // If many shapes are coming to rest, schedule a merge check
          if (!this.pendingMergeChecks) {
            this.pendingMergeChecks = true;
            this.mergeCheckTimer = this.mergeCheckDelay;
          }
        }
      } else {
        // Shape is moving, reset rest timer
        shape.restTimer = 0;
        shape.isResting = false;
      }
    }
  }
  
  /**
   * Check if two shapes are colliding
   * @param shapeA First shape
   * @param shapeB Second shape
   * @param mergeCheck If true, use a slightly more lenient collision threshold for merging
   * @returns True if the shapes are colliding
   */
  private bodiesAreColliding(shapeA: IShape, shapeB: IShape, mergeCheck: boolean = false): boolean {
    // Calculate the distance between centers
    const dx = shapeA.position.x - shapeB.position.x;
    const dy = shapeA.position.y - shapeB.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Apply shape-specific collision modifiers
    const modifierA = this.shapeCollisionModifiers[shapeA.type] || 1.0;
    const modifierB = this.shapeCollisionModifiers[shapeB.type] || 1.0;
    
    // Compare with the sum of modified radii
    // Using modified circle-based collision for all shapes
    const minDistance = (shapeA.radius * modifierA) + (shapeB.radius * modifierB);
    
    // For merge checks, use a more generous threshold to ensure merges happen reliably
    const threshold = mergeCheck ? 
      minDistance * MergerGame.MERGE_THRESHOLD_MULTIPLIER : 
      minDistance;
    
    // Update merge candidate flag for debugging
    if (mergeCheck && distance < threshold && shapeA.type === shapeB.type) {
      shapeA.mergeCandidate = true;
      shapeB.mergeCandidate = true;
    }
    
    return distance < threshold;
  }
  
  /**
   * Handle collisions with container boundaries
   */
  private handleContainerCollisions(shape: IShape, restitution: number): void {
    const containerWidth = this.config.containerWidth!;
    const containerHeight = this.config.containerHeight!;
    
    // Collision with left/right walls
    if (shape.position.x - shape.radius < 0) {
      shape.position.x = shape.radius;
      shape.velocity.x = Math.abs(shape.velocity.x) * restitution;
      shape.angularVelocity += shape.velocity.y * 0.01; // Add some spin
    } else if (shape.position.x + shape.radius > containerWidth) {
      shape.position.x = containerWidth - shape.radius;
      shape.velocity.x = -Math.abs(shape.velocity.x) * restitution;
      shape.angularVelocity -= shape.velocity.y * 0.01; // Add some spin
    }
    
    // Collision with bottom wall
    if (shape.position.y + shape.radius > containerHeight) {
      shape.position.y = containerHeight - shape.radius;
      
      // Only bounce if coming in with sufficient velocity
      if (shape.velocity.y > 10) {
        shape.velocity.y = -Math.abs(shape.velocity.y) * restitution;
        shape.angularVelocity += shape.velocity.x * 0.01; // Add some spin based on horizontal velocity
      } else {
        // Object is settling
        shape.velocity.y = 0;
      }
    }
  }
  
  /**
   * Resolve a collision between two shapes
   */
  private resolveCollision(shapeA: IShape, shapeB: IShape, restitution: number): void {
    // Calculate collision normal
    const dx = shapeB.position.x - shapeA.position.x;
    const dy = shapeB.position.y - shapeA.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Avoid division by zero
    if (distance === 0) return;
    
    // Normal vector
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Minimum translation distance to push shapes apart after collision
    const mtd = (shapeA.radius + shapeB.radius - distance) / 2;
    
    // Push shapes apart if not static
    if (!shapeA.isStatic) {
      shapeA.position.x -= nx * mtd;
      shapeA.position.y -= ny * mtd;
    }
    
    if (!shapeB.isStatic) {
      shapeB.position.x += nx * mtd;
      shapeB.position.y += ny * mtd;
    }
    
    // Only resolve velocity if both shapes are not static
    if (!shapeA.isStatic && !shapeB.isStatic) {
      // Calculate relative velocity
      const relVelX = shapeB.velocity.x - shapeA.velocity.x;
      const relVelY = shapeB.velocity.y - shapeA.velocity.y;
      
      // Calculate relative velocity along the normal
      const relVelAlongNormal = relVelX * nx + relVelY * ny;
      
      // Do not resolve if velocities are separating
      if (relVelAlongNormal > 0) return;
      
      // Calculate impulse scalar
      const impulseScalar = -(1 + restitution) * relVelAlongNormal;
      
      // Apply impulse
      shapeA.velocity.x -= nx * impulseScalar * 0.5;
      shapeA.velocity.y -= ny * impulseScalar * 0.5;
      
      shapeB.velocity.x += nx * impulseScalar * 0.5;
      shapeB.velocity.y += ny * impulseScalar * 0.5;
      
      // Add some angular velocity based on where the collision occurred
      // Using reduced multipliers to prevent excessive spinning
      const impactPointX = nx * shapeA.radius;
      const impactPointY = ny * shapeA.radius;
      
      shapeA.angularVelocity += (impactPointX * relVelY - impactPointY * relVelX) * 0.0015;
      shapeB.angularVelocity -= (impactPointX * relVelY - impactPointY * relVelX) * 0.0015;
    } else if (!shapeA.isStatic) {
      // If only shapeA is dynamic, reflect its velocity
      const dotProduct = 2 * (shapeA.velocity.x * nx + shapeA.velocity.y * ny);
      shapeA.velocity.x = (shapeA.velocity.x - dotProduct * nx) * restitution;
      shapeA.velocity.y = (shapeA.velocity.y - dotProduct * ny) * restitution;
      
      // Add some spin with reduced value
      shapeA.angularVelocity += (nx * shapeA.velocity.y - ny * shapeA.velocity.x) * 0.003;
    } else if (!shapeB.isStatic) {
      // If only shapeB is dynamic, reflect its velocity
      const dotProduct = 2 * (shapeB.velocity.x * -nx + shapeB.velocity.y * -ny);
      shapeB.velocity.x = (shapeB.velocity.x - dotProduct * -nx) * restitution;
      shapeB.velocity.y = (shapeB.velocity.y - dotProduct * -ny) * restitution;
      
      // Add some spin with reduced value
      shapeB.angularVelocity += (-nx * shapeB.velocity.y - -ny * shapeB.velocity.x) * 0.003;
    }
  }

  /**
   * Clear all merge candidate flags
   */
  private clearMergeCandidateFlags(): void {
    for (const shape of this.shapes) {
      shape.mergeCandidate = false;
    }
  }
  
  /**
   * Check for merges between shapes of the same type
   */
  private checkForMerges(): void {
    const shapesToRemove: Set<IShape> = new Set();
    const newShapes: IShape[] = [];
    
    // First identify all potential merge candidates
    const mergePairs: Array<{shapeA: IShape, shapeB: IShape}> = [];
    
    // Check each pair of shapes for potential merges
    for (let i = 0; i < this.shapes.length; i++) {
      const shapeA = this.shapes[i];
      
      if (shapesToRemove.has(shapeA)) continue;
      
      for (let j = i + 1; j < this.shapes.length; j++) {
        const shapeB = this.shapes[j];
        
        if (shapesToRemove.has(shapeB)) continue;
        
        // Check if shapes are the same type and are colliding
        if (
          shapeA.type === shapeB.type && 
          this.bodiesAreColliding(shapeA, shapeB, true) && // Use true for merge check to be more lenient
          MergerGame.MERGE_HIERARCHY[shapeA.type] !== undefined // Can only merge if it has a next type
        ) {
          // Add to merge pairs
          mergePairs.push({shapeA, shapeB});
        }
      }
    }
    
    // Now process the merge pairs (could be multiple merges in one check)
    for (const pair of mergePairs) {
      const {shapeA, shapeB} = pair;
      
      // Skip if either shape was already merged in this pass
      if (shapesToRemove.has(shapeA) || shapesToRemove.has(shapeB)) continue;
      
      // Mark both shapes for removal
      shapesToRemove.add(shapeA);
      shapesToRemove.add(shapeB);
      
      // Create a new merged shape of the next type
      const nextType = MergerGame.MERGE_HIERARCHY[shapeA.type]!;
      const midPosition: Vector = {
        x: (shapeA.position.x + shapeB.position.x) / 2,
        y: (shapeA.position.y + shapeB.position.y) / 2
      };
       
      const newShape = this.createShape(
        nextType,
        midPosition,
        this.shapeSizes[nextType],
        this.shapeColors[nextType],
        0 // Initial rotation
      );
      newShape.velocity = { x: 0, y: 0 };
      newShape.isStatic = false;
      
      // Add the new shape
      newShapes.push(newShape);
      
      // Add merge animation
      this.mergeAnimations.push({
        shape: newShape,
        timer: 0.5 // Animation duration in seconds
      });
      
      // Update score
      this.score += MergerGame.MERGE_POINTS[nextType];
      this.onScoreUpdate(this.score);
    }
    
    // Remove merged shapes
    this.shapes = this.shapes.filter(shape => !shapesToRemove.has(shape));
    
    // Add new merged shapes
    this.shapes.push(...newShapes);
    
    // If we performed any merges, schedule another check after a delay
    if (newShapes.length > 0) {
      this.pendingMergeChecks = true;
      this.mergeCheckTimer = this.mergeCheckDelay;
    }
  }
  
  /**
   * Update merge animation effects
   */
  private updateMergeAnimations(deltaTime: number): void {
    for (let i = this.mergeAnimations.length - 1; i >= 0; i--) {
      const animation = this.mergeAnimations[i];
      animation.timer -= deltaTime;
      
      // Remove completed animations
      if (animation.timer <= 0) {
        this.mergeAnimations.splice(i, 1);
      }
    }
  }
  
  /**
   * Check if game over condition is met
   */
  private checkGameOverCondition(): void {
    const dropZoneHeight = MergerGame.CANVAS.DROP_ZONE_HEIGHT || 100;
    // Game over if any shape crosses the drop zone line
    for (const shape of this.shapes) {
      if (shape.position.y - shape.radius <= dropZoneHeight) {
        this.isGameOver = true;
        this.onGameOver(this.score);
        return;
      }
    }
  }
  
  /**
   * Render the game
   */
  public render(): void {
    const ctx = this.context;
    // Clear the canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw the game boundary
    this.drawBoundary(ctx);
    
    // Draw the drop zone
    this.drawDropZone(ctx);
    
    // Draw the drop preview when there's an active shape
    if (this.activeShape && this.activeShape.isStatic) {
      this.drawDropPreview(ctx);
    }
    
    // Draw potential merge connections and collision areas in debug mode
    if (this.debugMode) {
      this.drawMergeConnections(ctx);
      this.drawCollisionAreas(ctx);
    }
    
    // Draw all shapes in the gameState
    for (const shape of this.shapes) {
      this.drawShape(ctx, shape);
      
      // Draw rest indicator for debugging
      if (this.debugMode && shape.isResting) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(shape.position.x, shape.position.y, shape.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Show merge candidate indicator
      if (this.debugMode && shape.mergeCandidate) {
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(shape.position.x, shape.position.y, shape.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Show effective collision area in debug mode
      if (this.debugMode) {
        const modifier = this.shapeCollisionModifiers[shape.type] || 1.0;
        if (modifier > 1.0) {
          ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)'; // Orange
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(shape.position.x, shape.position.y, shape.radius * modifier, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
    
    // Draw merge animations
    this.drawMergeAnimations(ctx);
    
    // Draw the active shape (draw last so it's on top)
    if (this.activeShape) {
      this.drawShape(ctx, this.activeShape);
      
      // Draw "click to drop" indicator if shape is static
      if (this.activeShape.isStatic && !this.isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click to Drop', this.activeShape.position.x, this.activeShape.position.y - this.activeShape.radius - 10);
        ctx.textAlign = 'left';
      }
    }
    
    // Draw merge check timer indicator when pending
    if (this.debugMode && this.pendingMergeChecks) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.font = '16px Arial';
      ctx.fillText(`Merge check in: ${this.mergeCheckTimer.toFixed(1)}s`, 20, 60);
    }
    
    // Draw next shape indicator
    this.drawNextShapeIndicator(ctx);
    
    // Draw score
    this.drawScore(ctx);
    
    // Draw game over message if game is over
    if (this.isGameOver) {
      this.drawGameOver(ctx);
    }
  }
  
  /**
   * Draw the game boundary
   */
  private drawBoundary(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Draw the drop zone line
   */
  private drawDropZone(ctx: CanvasRenderingContext2D): void {
    const dropZoneHeight = MergerGame.CANVAS.DROP_ZONE_HEIGHT || 100;
    
    // Draw a semi-transparent background for the drop zone
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.fillRect(0, 0, this.canvas.width, dropZoneHeight);
    
    // Draw a more prominent line
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, dropZoneHeight);
    ctx.lineTo(this.canvas.width, dropZoneHeight);
    ctx.stroke();
    
    // Add a "drop zone" label
    ctx.fillStyle = '#ff0000';
    ctx.font = '14px Arial';
    ctx.fillText("DROP ZONE", 10, dropZoneHeight - 10);
  }
  
  /**
   * Draw a preview of where the active shape will drop
   */
  private drawDropPreview(ctx: CanvasRenderingContext2D): void {
    if (!this.activeShape || !this.activeShape.isStatic) return;
    
    // Draw a vertical line from the active shape to bottom
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // Create a dashed line
    ctx.beginPath();
    ctx.moveTo(this.activeShape.position.x, this.activeShape.position.y + this.activeShape.radius);
    ctx.lineTo(this.activeShape.position.x, this.config.containerHeight!);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash
    
    // Create a ghost/shadow of the shape at the predicted landing spot
    const landingY = this.predictLandingY();
    
    // Draw a shadow of the active shape
    ctx.globalAlpha = 0.3;
    const shadowShape = {
      ...this.activeShape,
      position: {
        x: this.activeShape.position.x,
        y: landingY
      }
    };
    this.drawShape(ctx, shadowShape);
    ctx.globalAlpha = 1.0;
  }
  
  /**
   * Predict where the shape will land
   * Uses a simplified physics model
   */
  private predictLandingY(): number {
    if (!this.activeShape) return this.config.containerHeight!;
    
    let landingY = this.config.containerHeight! - this.activeShape.radius;
    
    // Check for collisions with other shapes
    for (const shape of this.shapes) {
      // Only consider shapes that are beneath the active shape
      if (shape.position.x + shape.radius >= this.activeShape.position.x - this.activeShape.radius &&
          shape.position.x - shape.radius <= this.activeShape.position.x + this.activeShape.radius &&
          shape.position.y - shape.radius < landingY) {
        
        // Simple collision check - assumes the shape will land directly on top
        const potentialY = shape.position.y - shape.radius - this.activeShape.radius;
        
        // Update the landing spot if this shape is higher in the stack
        if (potentialY < landingY) {
          landingY = potentialY;
        }
      }
    }
    
    return landingY;
  }
  
  /**
   * Draw the next shape indicator
   */
  private drawNextShapeIndicator(ctx: CanvasRenderingContext2D): void {
    if (!this.nextShape) return;
    
    // Draw "Next" text
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Next:', this.config.containerWidth - 140, 30);
    
    // Draw the next shape
    this.drawShape(ctx, this.nextShape);
  }
  
  /**
   * Draw lines between shapes that are candidates for merging (debug visualization)
   */
  private drawMergeConnections(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.shapes.length; i++) {
      const shapeA = this.shapes[i];
      
      for (let j = i + 1; j < this.shapes.length; j++) {
        const shapeB = this.shapes[j];
        
        // Draw lines between shapes of the same type that are close to each other
        if (shapeA.type === shapeB.type && 
            MergerGame.MERGE_HIERARCHY[shapeA.type] !== undefined) {
          
          // Calculate distance
          const dx = shapeA.position.x - shapeB.position.x;
          const dy = shapeA.position.y - shapeB.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Draw connection if they're close enough for potential merge
          const minDistance = (shapeA.radius + shapeB.radius) * 1.2; // More generous for visualization
          if (distance < minDistance) {
            // Calculate color based on how close they are to merging
            const proximityRatio = distance / minDistance;
            const colorValue = Math.floor(255 * proximityRatio);
            
            ctx.strokeStyle = `rgb(${255-colorValue}, ${colorValue}, 0)`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(shapeA.position.x, shapeA.position.y);
            ctx.lineTo(shapeB.position.x, shapeB.position.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    }
  }
  
  /**
   * Draw collision areas for debugging
   */
  private drawCollisionAreas(ctx: CanvasRenderingContext2D): void {
    // Draw merge threshold indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = '14px Arial';
    ctx.fillText(`Merge Threshold: ${MergerGame.MERGE_THRESHOLD_MULTIPLIER.toFixed(2)}x`, 20, 80);
    
    // Visualize merge areas for all shapes
    for (const shape of this.shapes) {
      const mergeRadius = shape.radius * MergerGame.MERGE_THRESHOLD_MULTIPLIER;
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(shape.position.x, shape.position.y, mergeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  /**
   * Draw merge animations
   */
  private drawMergeAnimations(ctx: CanvasRenderingContext2D): void {
    for (const animation of this.mergeAnimations) {
      // Draw a pulsing circle around the merged shape
      const { shape, timer } = animation;
      const pulseScale = 1 + Math.sin((1 - timer) * Math.PI) * 0.3;
      
      ctx.save();
      ctx.globalAlpha = timer * 2; // Fade out
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(shape.position.x, shape.position.y, shape.radius * pulseScale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  
  /**
   * Draw the score
   */
  private drawScore(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${this.score}`, 20, 30);
  }
  
  /**
   * Draw game over message
   */
  private drawGameOver(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 24);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 24);
    
    ctx.font = '18px Arial';
    ctx.fillText('Press Space to Restart', this.canvas.width / 2, this.canvas.height / 2 + 64);
    
    ctx.textAlign = 'left';
  }
  
  /**
   * Reset the game state to start a new game
   */
  public restart(): void {
    this.shapes = [];
    this.isGameOver = false;
    this.score = 0;
    this.mergeAnimations = [];
    this.dropPosition = this.canvas.width / 2;
    this.pendingMergeChecks = false;
    
    // Generate new shapes
    this.activeShape = null;
    this.nextShape = null;
    this.generateNewActiveShape();
    this.generateNextShape();
  }
  
  /**
   * Check if the game is over
   */
  public getIsGameOver(): boolean {
    return this.isGameOver;
  }
  
  /**
   * Get the current score
   */
  public getScore(): number {
    return this.score;
  }
}
