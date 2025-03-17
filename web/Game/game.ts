import * as PIXI from 'pixi.js';
const { Application, Container, Graphics, Text, TextStyle } = PIXI;
import * as Matter from 'matter-js';

// Game states
enum GameState {
  START,
  PLAYING,
  GAME_OVER
}

// Shape types in order from smallest to largest
type ShapeType = 'circle' | 'square' | 'triangle' | 'trapezoid' | 'rhombus' | 'pentagon' | 'hexagon' | 'octagon';

// Shape hierarchy for merging
const SHAPE_HIERARCHY: ShapeType[] = [
  'circle',
  'square',
  'triangle',
  'trapezoid',
  'rhombus',
  'pentagon', 
  'hexagon',
  'octagon'
];

// Colors for each shape
const SHAPE_COLORS = {
  'circle': 0x4CAF50,     // Green
  'square': 0x2196F3,     // Blue
  'triangle': 0xFFEB3B,   // Yellow
  'trapezoid': 0xFF5722,  // Orange
  'rhombus': 0xFF9800,    // Amber
  'pentagon': 0xF44336,   // Red
  'hexagon': 0x9C27B0,    // Purple
  'octagon': 0x00BCD4     // Cyan
};

// Size for each shape
const SHAPE_SIZES = {
  'circle': 30,
  'square': 40,
  'triangle': 50,
  'trapezoid': 60,
  'rhombus': 70,
  'pentagon': 80,
  'hexagon': 90,
  'octagon': 100
};

// Game physics objects
interface GameShape {
  body: Matter.Body;
  graphics: Graphics;
  type: ShapeType;
  markedForDeletion: boolean;
  merging: boolean;
}

interface FallingShape {
  graphics: Graphics;
  speed: number;
  rotationSpeed: number;
  type: ShapeType;
}

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#333333', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Game state
    let currentState = GameState.START;
    let score = 0;
    
    // Matter.js setup
    const { Engine, Render, World, Bodies, Body, Events, Composite, Common } = Matter;
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    });
    
    // Container for all game elements
    const gameContainer = new Container();
    app.stage.addChild(gameContainer);
    
    // Container for the actual game area
    const playArea = new Container();
    
    // Container for UI elements (score, buttons, etc.)
    const uiContainer = new Container();
    app.stage.addChild(uiContainer);

    // Create title
    const titleStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 60,
        fontWeight: 'bold',
        fill: '#ffffff',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowDistance: 3
    });
    const title = new Text('ShapeSplosion', titleStyle);
    title.anchor.set(0.5);
    title.x = app.screen.width / 2;
    title.y = app.screen.height / 6;
    gameContainer.addChild(title);

    // Create play button with shadow effect
    const playButtonShadow = new Graphics();
    playButtonShadow.beginFill(0x000000, 0.3);
    playButtonShadow.drawRoundedRect(5, 5, 250, 80, 20);
    playButtonShadow.endFill();
    playButtonShadow.x = app.screen.width / 2 - 125;
    playButtonShadow.y = app.screen.height / 2;
    gameContainer.addChild(playButtonShadow);

    const playButton = new Graphics();
    playButton.beginFill(0x4CAF50);
    playButton.drawRoundedRect(0, 0, 250, 80, 20);
    playButton.endFill();
    playButton.x = app.screen.width / 2 - 125;
    playButton.y = app.screen.height / 2;
    playButton.eventMode = 'static';
    playButton.cursor = 'pointer';
    
    const buttonTextStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontWeight: 'bold',
        fill: '#ffffff',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowDistance: 2,
        dropShadowBlur: 2
    });
    const buttonText = new Text('PLAY', buttonTextStyle);
    buttonText.anchor.set(0.5);
    buttonText.x = 125;
    buttonText.y = 40;
    playButton.addChild(buttonText);
    
    gameContainer.addChild(playButton);
    
    // Create game instructions
    const instructionStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 1,
        letterSpacing: 1,
        lineHeight: 30
    });
    const instructions = new Text(
        'Controls:\n' +
        '- Move: Left/Right Arrow Keys or Mouse\n' +
        '- Drop: Spacebar or Click\n' +
        '- Restart (when game over): R key',
        instructionStyle
    );
    instructions.anchor.set(0.5, 0);
    instructions.x = app.screen.width / 2;
    instructions.y = app.screen.height / 2 + 100;
    gameContainer.addChild(instructions);
    
    // Add hover effects
    playButton.on('pointerover', () => {
        playButton.scale.set(1.1);
        buttonText.style.fill = '#FFFF00';
    });
    
    playButton.on('pointerout', () => {
        playButton.scale.set(1);
        buttonText.style.fill = '#FFFFFF';
    });
    
    // Add pulse animation to play button
    let pulseDirection = 1;
    let pulseAmount = 0;
    app.ticker.add((time) => {
        if (currentState === GameState.START) {
            // Gentle pulse animation
            pulseAmount += 0.01 * pulseDirection * time.deltaTime;
            if (pulseAmount > 0.1) {
                pulseDirection = -1;
            } else if (pulseAmount < 0) {
                pulseDirection = 1;
            }
            playButton.scale.set(1 + pulseAmount);
        }
    });
    
    // Game Variables
    const GAME_WIDTH = 400;
    const GAME_HEIGHT = 600;
    const WALL_THICKNESS = 20;
    
    // Physics bodies
    let walls: Matter.Body[] = [];
    const gameShapes: GameShape[] = [];
    let nextShape: ShapeType = 'circle';
    let nextShapeGraphics: Graphics;
    let canDropShape = true;
    
    // Score display
    const scoreStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 40,
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowDistance: 2
    });
    const scoreText = new Text('Score: 0', scoreStyle);
    scoreText.anchor.set(0, 0);
    scoreText.x = 20;
    scoreText.y = 20;
    uiContainer.addChild(scoreText);
    scoreText.visible = false;
    
    // Game over text
    const gameOverStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#ff0000',
    });
    const gameOverText = new Text('GAME OVER', gameOverStyle);
    gameOverText.anchor.set(0.5);
    gameOverText.x = app.screen.width / 2;
    gameOverText.y = app.screen.height / 3;
    uiContainer.addChild(gameOverText);
    gameOverText.visible = false;
    
    // Create restart button with shadow effect
    const restartButtonShadow = new Graphics();
    restartButtonShadow.beginFill(0x000000, 0.3);
    restartButtonShadow.drawRoundedRect(5, 5, 250, 80, 20);
    restartButtonShadow.endFill();
    restartButtonShadow.x = app.screen.width / 2 - 125;
    restartButtonShadow.y = app.screen.height / 2;
    restartButtonShadow.visible = false;
    uiContainer.addChild(restartButtonShadow);

    const restartButton = new Graphics();
    restartButton.beginFill(0x4CAF50);
    restartButton.drawRoundedRect(0, 0, 250, 80, 20);
    restartButton.endFill();
    restartButton.x = app.screen.width / 2 - 125;
    restartButton.y = app.screen.height / 2;
    restartButton.eventMode = 'static';
    restartButton.cursor = 'pointer';
    restartButton.visible = false;
    
    const restartText = new Text('RESTART', buttonTextStyle);
    restartText.anchor.set(0.5);
    restartText.x = 125;
    restartText.y = 40;
    restartButton.addChild(restartText);
    
    uiContainer.addChild(restartButton);
    
    restartButton.on('pointerover', () => {
        restartButton.scale.set(1.1);
        restartText.style.fill = '#FFFF00';
    });
    
    restartButton.on('pointerout', () => {
        restartButton.scale.set(1);
        restartText.style.fill = '#FFFFFF';
    });
    
    restartButton.on('pointerdown', () => {
        restartGame();
    });
    
    // Make shadow visibility match button visibility
    restartButton.on('visibilitychange', () => {
        restartButtonShadow.visible = restartButton.visible;
    });
    
    // Initialize physics world and game area
    function initGameWorld() {
        // Create game area
        playArea.removeChildren();
        gameContainer.addChild(playArea);
        
        // Create boundaries
        createBoundaries();
        
        // Create next shape preview
        setupNextShape();
        
        // Reset score
        score = 0;
        updateScore();
        
        // Setup drop zone and events
        setupDropZone();
    }
    
    // Create walls and floor
    function createBoundaries() {
        // Clear existing physics bodies
        Composite.clear(engine.world);
        walls = [];
        
        // Game area container
        const gameAreaGraphics = new Graphics();
        gameAreaGraphics.beginFill(0x222222);
        gameAreaGraphics.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        gameAreaGraphics.endFill();
        gameAreaGraphics.x = (app.screen.width - GAME_WIDTH) / 2;
        gameAreaGraphics.y = 100;
        playArea.addChild(gameAreaGraphics);
        
        // Create walls (left, right, bottom)
        const leftWall = Bodies.rectangle(
            gameAreaGraphics.x - WALL_THICKNESS/2, 
            gameAreaGraphics.y + GAME_HEIGHT/2, 
            WALL_THICKNESS, 
            GAME_HEIGHT, 
            { isStatic: true }
        );
        
        const rightWall = Bodies.rectangle(
            gameAreaGraphics.x + GAME_WIDTH + WALL_THICKNESS/2, 
            gameAreaGraphics.y + GAME_HEIGHT/2, 
            WALL_THICKNESS, 
            GAME_HEIGHT, 
            { isStatic: true }
        );
        
        const floor = Bodies.rectangle(
            gameAreaGraphics.x + GAME_WIDTH/2, 
            gameAreaGraphics.y + GAME_HEIGHT + WALL_THICKNESS/2, 
            GAME_WIDTH + WALL_THICKNESS*2, 
            WALL_THICKNESS, 
            { isStatic: true }
        );
        
        walls = [leftWall, rightWall, floor];
        Composite.add(engine.world, walls);
        
        // Draw walls for visual reference
        const wallsGraphics = new Graphics();
        wallsGraphics.beginFill(0x555555);
        
        // Left wall
        wallsGraphics.drawRect(
            -WALL_THICKNESS, 
            0, 
            WALL_THICKNESS, 
            GAME_HEIGHT
        );
        
        // Right wall
        wallsGraphics.drawRect(
            GAME_WIDTH, 
            0, 
            WALL_THICKNESS, 
            GAME_HEIGHT
        );
        
        // Floor
        wallsGraphics.drawRect(
            -WALL_THICKNESS, 
            GAME_HEIGHT, 
            GAME_WIDTH + WALL_THICKNESS*2, 
            WALL_THICKNESS
        );
        
        wallsGraphics.endFill();
        gameAreaGraphics.addChild(wallsGraphics);
    }
    
    // Setup drop zone for player interaction
    function setupDropZone() {
        // Create drop zone graphics
        const dropZoneGraphics = new Graphics();
        dropZoneGraphics.beginFill(0x333333, 0.3);
        dropZoneGraphics.drawRect(0, 0, GAME_WIDTH, 50);
        dropZoneGraphics.endFill();
        dropZoneGraphics.x = (app.screen.width - GAME_WIDTH) / 2;
        dropZoneGraphics.y = 100;
        playArea.addChild(dropZoneGraphics);
        
        // Make it interactive for mouse control
        dropZoneGraphics.eventMode = 'static';
        dropZoneGraphics.on('pointermove', (event) => {
            if (currentState === GameState.PLAYING && nextShapeGraphics) {
                const bounds = dropZoneGraphics.getBounds();
                nextShapeGraphics.x = Math.min(
                    Math.max(event.global.x, bounds.x + SHAPE_SIZES[nextShape]/2),
                    bounds.x + GAME_WIDTH - SHAPE_SIZES[nextShape]/2
                );
            }
        });
        
        dropZoneGraphics.on('pointerdown', () => {
            if (currentState === GameState.PLAYING && canDropShape) {
                dropShape();
            }
        });
        
        // Add keyboard controls
        setupKeyboardControls(dropZoneGraphics);
    }
    
    // Setup keyboard controls
    function setupKeyboardControls(dropZoneGraphics: Graphics) {
        // Movement speed for keyboard controls
        const KEYBOARD_MOVE_SPEED = 10;
        
        // Add keyboard event listeners
        window.addEventListener('keydown', (event) => {
            if (currentState === GameState.PLAYING && nextShapeGraphics) {
                const bounds = dropZoneGraphics.getBounds();
                
                switch (event.key) {
                    case 'ArrowLeft':
                        // Move shape left
                        nextShapeGraphics.x = Math.max(
                            nextShapeGraphics.x - KEYBOARD_MOVE_SPEED,
                            bounds.x + SHAPE_SIZES[nextShape]/2
                        );
                        break;
                    case 'ArrowRight':
                        // Move shape right
                        nextShapeGraphics.x = Math.min(
                            nextShapeGraphics.x + KEYBOARD_MOVE_SPEED,
                            bounds.x + GAME_WIDTH - SHAPE_SIZES[nextShape]/2
                        );
                        break;
                    case ' ': // Spacebar
                        // Drop shape
                        if (canDropShape) {
                            dropShape();
                        }
                        break;
                }
            } else if (currentState === GameState.GAME_OVER) {
                // Restart game with R key when in game over state
                if (event.key.toLowerCase() === 'r') {
                    restartGame();
                }
            }
        });
    }
    
    // Start the game
    playButton.on('pointerdown', () => {
        startGame();
    });

    // Function to start the game
    function startGame() {
        currentState = GameState.PLAYING;
        
        // Hide start screen elements
        gameContainer.children.forEach(child => {
            child.visible = false;
        });
        playButtonShadow.visible = false;
        
        // Show score
        scoreText.visible = true;
        
        // Initialize game
        initGameWorld();
        
        // Start the physics engine
        Engine.run(engine);
    }
    
    // Function to restart the game
    function restartGame() {
        // Reset game state
        gameShapes.length = 0;
        score = 0;
        updateScore();
        
        // Hide game over elements
        gameOverText.visible = false;
        restartButton.visible = false;
        restartButtonShadow.visible = false;
        
        // Reset game
        initGameWorld();
        
        // Update state
        currentState = GameState.PLAYING;
        
        // Re-enable shape dropping
        canDropShape = true;
    }
    
    // Create a shape with physics
    function createPhysicsShape(type: ShapeType, x: number, y: number): GameShape {
        const size = SHAPE_SIZES[type];
        let body: Matter.Body;
        
        // Create the physical body based on shape
        switch (type) {
            case 'circle':
                body = Bodies.circle(x, y, size/2, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            case 'square':
                body = Bodies.rectangle(x, y, size, size, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            case 'triangle':
                body = Bodies.polygon(x, y, 3, size/2, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            case 'trapezoid': {
                const trapezoidPath = [
                    { x: -size/2, y: size/2 },
                    { x: size/2, y: size/2 },
                    { x: size/3, y: -size/2 },
                    { x: -size/3, y: -size/2 }
                ];
                body = Bodies.fromVertices(x, y, [trapezoidPath], {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            }
            case 'rhombus': {
                const rhombusPath = [
                    { x: 0, y: -size/2 },
                    { x: size/3, y: 0 },
                    { x: 0, y: size/2 },
                    { x: -size/3, y: 0 }
                ];
                body = Bodies.fromVertices(x, y, [rhombusPath], {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            }
            case 'pentagon':
                body = Bodies.polygon(x, y, 5, size/2, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            case 'hexagon':
                body = Bodies.polygon(x, y, 6, size/2, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            case 'octagon':
                body = Bodies.polygon(x, y, 8, size/2, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
                break;
            default:
                body = Bodies.circle(x, y, size/2, {
                    restitution: 0.3,
                    friction: 0.1,
                    density: 0.001,
                    label: type
                });
        }
        
        // Create the graphics for this shape
        const graphics = drawShape(type, size);
        playArea.addChild(graphics);
        
        // Add the body to the world
        Composite.add(engine.world, body);
        
        return {
            body,
            graphics,
            type,
            markedForDeletion: false,
            merging: false
        };
    }
    
    // Draw the shape graphics
    function drawShape(type: ShapeType, size: number): Graphics {
        const shape = new Graphics();
        
        // Draw different shapes with different colors
        switch (type) {
            case 'circle':
                shape.beginFill(SHAPE_COLORS.circle);
                shape.drawCircle(0, 0, size / 2);
                shape.endFill();
                break;
            case 'square':
                shape.beginFill(SHAPE_COLORS.square);
                shape.drawRect(-size / 2, -size / 2, size, size);
                shape.endFill();
                break;
            case 'triangle':
                shape.beginFill(SHAPE_COLORS.triangle);
                shape.moveTo(0, -size / 2);
                shape.lineTo(size / 2, size / 2);
                shape.lineTo(-size / 2, size / 2);
                shape.closePath();
                shape.endFill();
                break;
            case 'trapezoid':
                shape.beginFill(SHAPE_COLORS.trapezoid);
                shape.moveTo(-size / 2, size / 2); // Bottom left
                shape.lineTo(size / 2, size / 2);  // Bottom right
                shape.lineTo(size / 3, -size / 2); // Top right
                shape.lineTo(-size / 3, -size / 2); // Top left
                shape.closePath();
                shape.endFill();
                break;
            case 'hexagon':
                shape.beginFill(SHAPE_COLORS.hexagon);
                const hexRadius = size / 2;
                for (let i = 0; i < 6; i++) {
                    const angle = Math.PI / 3 * i - Math.PI / 6;
                    const x = hexRadius * Math.cos(angle);
                    const y = hexRadius * Math.sin(angle);
                    if (i === 0) {
                        shape.moveTo(x, y);
                    } else {
                        shape.lineTo(x, y);
                    }
                }
                shape.closePath();
                shape.endFill();
                break;
            case 'pentagon':
                shape.beginFill(SHAPE_COLORS.pentagon);
                const pentRadius = size / 2;
                for (let i = 0; i < 5; i++) {
                    const angle = 2 * Math.PI / 5 * i - Math.PI / 2;
                    const x = pentRadius * Math.cos(angle);
                    const y = pentRadius * Math.sin(angle);
                    if (i === 0) {
                        shape.moveTo(x, y);
                    } else {
                        shape.lineTo(x, y);
                    }
                }
                shape.closePath();
                shape.endFill();
                break;
            case 'octagon':
                shape.beginFill(SHAPE_COLORS.octagon);
                const octRadius = size / 2;
                for (let i = 0; i < 8; i++) {
                    const angle = Math.PI / 4 * i - Math.PI / 8;
                    const x = octRadius * Math.cos(angle);
                    const y = octRadius * Math.sin(angle);
                    if (i === 0) {
                        shape.moveTo(x, y);
                    } else {
                        shape.lineTo(x, y);
                    }
                }
                shape.closePath();
                shape.endFill();
                break;
            case 'rhombus':
                shape.beginFill(SHAPE_COLORS.rhombus);
                shape.moveTo(0, -size / 2); // Top
                shape.lineTo(size / 3, 0);  // Right
                shape.lineTo(0, size / 2);  // Bottom
                shape.lineTo(-size / 3, 0); // Left
                shape.closePath();
                shape.endFill();
                break;
        }
        
        return shape;
    }
    
    // Setup the next shape to drop
    function setupNextShape() {
        // Generate a random shape (for now, just use circles, squares, and triangles)
        const randomIndex = Math.floor(Math.random() * 3); // Only use the 3 smallest shapes
        nextShape = SHAPE_HIERARCHY[randomIndex];
        
        // If there's already a next shape graphic, remove it
        if (nextShapeGraphics) {
            playArea.removeChild(nextShapeGraphics);
        }
        
        // Create a container for the shape and its highlight
        const shapeContainer = new Container();
        
        // Create highlight effect with a slightly larger shape
        const highlight = drawShape(nextShape, SHAPE_SIZES[nextShape] * 1.2);
        highlight.alpha = 0.3;
        shapeContainer.addChild(highlight);
        
        // Create the graphics for the next shape
        const shapeGraphics = drawShape(nextShape, SHAPE_SIZES[nextShape]);
        shapeContainer.addChild(shapeGraphics);
        
        shapeContainer.x = (app.screen.width) / 2;
        shapeContainer.y = 125; // Just above the drop zone
        playArea.addChild(shapeContainer);
        
        // Store the reference to the container
        nextShapeGraphics = shapeContainer;
    }
    
    // Drop the current shape
    function dropShape() {
        if (!canDropShape) return;
        
        // Create the physics shape at the same position as the preview
        const gameAreaX = (app.screen.width - GAME_WIDTH) / 2;
        const physicsX = nextShapeGraphics.x - gameAreaX;
        const shape = createPhysicsShape(nextShape, physicsX, 150);
        gameShapes.push(shape);
        
        // Remove the preview shape
        playArea.removeChild(nextShapeGraphics);
        
        // Set up the next shape
        setupNextShape();
        
        // Temporary cooldown to prevent rapid dropping
        canDropShape = false;
        setTimeout(() => {
            canDropShape = true;
        }, 500);
        
        // Check for game over condition - if shape is created too high
        checkGameOverCondition();
        
        // Check for potential merges
        checkForMerges();
    }
    
    // Check if game should end
    function checkGameOverCondition() {
        for (const shape of gameShapes) {
            // If a shape goes too high, game over
            if (shape.body.position.y < 150) {
                endGame();
                break;
            }
        }
    }
    
    // End the game
    function endGame() {
        currentState = GameState.GAME_OVER;
        canDropShape = false;
        
        // Show game over text and restart button
        gameOverText.visible = true;
        restartButton.visible = true;
        restartButtonShadow.visible = true;
    }
    
    // Check for shapes that can merge
    function checkForMerges() {
        // Loop through all shapes
        for (let i = 0; i < gameShapes.length; i++) {
            if (gameShapes[i].markedForDeletion || gameShapes[i].merging) continue;
            
            for (let j = i + 1; j < gameShapes.length; j++) {
                // Skip shapes already marked for deletion or merging
                if (gameShapes[j].markedForDeletion || gameShapes[j].merging) continue;
                
                // Only merge same shapes
                if (gameShapes[i].type === gameShapes[j].type) {
                    // Check if bodies are colliding/overlapping
                    const collision = Matter.Collision.collides(gameShapes[i].body, gameShapes[j].body);
                    
                    if (collision && collision.collided) {
                        // Start merging process
                        mergeShapes(i, j);
                        break; // Only merge one pair at a time
                    }
                }
            }
        }
    }
    
    // Merge two shapes into a bigger one
    function mergeShapes(index1: number, index2: number) {
        const shape1 = gameShapes[index1];
        const shape2 = gameShapes[index2];
        
        // Mark shapes for deletion
        shape1.markedForDeletion = true;
        shape2.markedForDeletion = true;
        shape1.merging = true;
        shape2.merging = true;
        
        // Find the midpoint between the shapes
        const midX = (shape1.body.position.x + shape2.body.position.x) / 2;
        const midY = (shape1.body.position.y + shape2.body.position.y) / 2;
        
        // Get next shape in hierarchy
        const currentIndex = SHAPE_HIERARCHY.indexOf(shape1.type);
        const nextIndex = currentIndex + 1;
        
        // If we've reached the largest shape, just add score and remove
        if (nextIndex >= SHAPE_HIERARCHY.length) {
            // Maximum level reached - big score bonus!
            score += 1000;
            updateScore();
            
            // Remove immediately
            removeShapesMarkedForDeletion();
            return;
        }
        
        // Create a new shape of the next type
        const newShapeType = SHAPE_HIERARCHY[nextIndex];
        const newShape = createPhysicsShape(newShapeType, midX, midY);
        gameShapes.push(newShape);
        
        // Add score
        score += (nextIndex + 1) * 10;
        updateScore();
        
        // Remove merged shapes
        removeShapesMarkedForDeletion();
    }
    
    // Remove shapes marked for deletion
    function removeShapesMarkedForDeletion() {
        for (let i = gameShapes.length - 1; i >= 0; i--) {
            if (gameShapes[i].markedForDeletion) {
                // Remove from physics world
                Composite.remove(engine.world, gameShapes[i].body);
                
                // Remove graphics
                playArea.removeChild(gameShapes[i].graphics);
                
                // Remove from array
                gameShapes.splice(i, 1);
            }
        }
    }
    
    // Update the score display
    function updateScore() {
        scoreText.text = `Score: ${score}`;
    }
    
    // Array of falling shapes in the background (decorative)
    const fallingShapes: FallingShape[] = [];
    
    // Create a new falling shape (decorative)
    function createShape(): FallingShape {
        // Random shape type
        const shapeIndex = Math.floor(Math.random() * SHAPE_HIERARCHY.length);
        const type = SHAPE_HIERARCHY[shapeIndex];
        
        // Random position
        const x = Math.random() * app.screen.width;
        const y = -50; // Start above the screen
        
        // Create graphics
        const graphics = drawShape(type, SHAPE_SIZES[type] * 0.7); // Slightly smaller
        graphics.x = x;
        graphics.y = y;
        graphics.alpha = 0.3; // Partially transparent
        gameContainer.addChild(graphics);
        
        // Random speed and rotation
        const speed = 0.5 + Math.random() * 1.5;
        const rotationSpeed = (Math.random() - 0.5) * 0.05;
        
        return {
            graphics,
            speed,
            rotationSpeed,
            type
        };
    }
    
    // Timer for spawning new shapes
    let spawnTimer = 0;
    
    // Listen for animate update
    app.ticker.add((time) => {
        // Only spawn decorative shapes in START or PLAYING states
        if (currentState !== GameState.GAME_OVER) {
            // Spawn new shapes
            spawnTimer += time.deltaTime;
            if (spawnTimer > 10) { // Every ~10 frames
                fallingShapes.push(createShape());
                spawnTimer = 0;
            }
            
            // Update falling shapes
            for (let i = fallingShapes.length - 1; i >= 0; i--) {
                const shape = fallingShapes[i];
                
                // Move down
                shape.graphics.y += shape.speed * time.deltaTime;
                
                // Rotate
                shape.graphics.rotation += shape.rotationSpeed * time.deltaTime;
                
                // Remove if out of screen
                if (shape.graphics.y > app.screen.height + 50) {
                    gameContainer.removeChild(shape.graphics);
                    fallingShapes.splice(i, 1);
                }
            }
        }
        
        // Update physics bodies positions for game shapes
        if (currentState === GameState.PLAYING) {
            // Update graphics positions based on physics
            for (const shape of gameShapes) {
                if (!shape.markedForDeletion) {
                    shape.graphics.position.x = shape.body.position.x;
                    shape.graphics.position.y = shape.body.position.y;
                    shape.graphics.rotation = shape.body.angle;
                }
            }
            
            // Check for merges every frame
            checkForMerges();
        }
    });
    
    // Handle window resizing
    window.addEventListener('resize', () => {
        // Update title position
        title.x = app.screen.width / 2;
        title.y = app.screen.height / 6;
        
        // Update play button position
        playButton.x = app.screen.width / 2 - 125;
        playButton.y = app.screen.height / 2;
        playButtonShadow.x = app.screen.width / 2 - 125;
        playButtonShadow.y = app.screen.height / 2;
        
        // Update restart button position if visible
        restartButton.x = app.screen.width / 2 - 125;
        restartButton.y = app.screen.height / 2;
        restartButtonShadow.x = app.screen.width / 2 - 125;
        restartButtonShadow.y = app.screen.height / 2;
    });
})();