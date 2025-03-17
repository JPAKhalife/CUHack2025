import { ShapeType, Shape, Point, Color } from './types';
import { createShape, drawShape } from './shapes';
import { CANVAS } from './constants';

// Extended shape types for start screen animations
enum ExtendedShapeType {
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  TRIANGLE = 'triangle',
  POLYGON = 'polygon',
  STAR = 'star',
  OCTAGON = 'octagon',
  HEXAGON = 'hexagon',
  TRAPEZOID = 'trapezoid',
  RHOMBUS = 'rhombus',
  PENTAGON = 'pentagon'
}

// Define shape types and their corresponding colors with more vibrant options
const SHAPE_COLORS: Record<string, Color> = {
  [ExtendedShapeType.CIRCLE]: { r: 255, g: 0, b: 0, a: 0.8 },
  [ExtendedShapeType.RECTANGLE]: { r: 0, g: 255, b: 0, a: 0.8 },
  [ExtendedShapeType.TRIANGLE]: { r: 0, g: 0, b: 255, a: 0.8 },
  [ExtendedShapeType.POLYGON]: { r: 255, g: 255, b: 0, a: 0.8 },
  [ExtendedShapeType.STAR]: { r: 255, g: 165, b: 0, a: 0.8 },
  [ExtendedShapeType.OCTAGON]: { r: 128, g: 0, b: 128, a: 0.8 },
  [ExtendedShapeType.HEXAGON]: { r: 0, g: 255, b: 255, a: 0.8 },
  [ExtendedShapeType.TRAPEZOID]: { r: 255, g: 20, b: 147, a: 0.8 },
  [ExtendedShapeType.RHOMBUS]: { r: 50, g: 205, b: 50, a: 0.8 },
  [ExtendedShapeType.PENTAGON]: { r: 138, g: 43, b: 226, a: 0.8 }
};

// Interface for animated falling shape
interface AnimatedShape {
  type: string;
  position: Point;
  size: number;
  color: Color;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  pulseRate?: number;
  pulseAmount?: number;
}

export class StartScreen {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private shapes: AnimatedShape[] = [];
  private shapeyImage: HTMLImageElement;
  private animationId: number | null = null;
  private buttonHovered: boolean = false;
  private buttonHoverProgress: number = 0; // For smooth hover transitions
  private borderPulse: number = 0; // For pulsing border effect
  private onStartGame: () => void = () => {};
  
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.shapeyImage = new Image();
    this.shapeyImage.src = '/ShapeyAngry.png';
  }

  /**
   * Initialize the start screen with animated shapes and event listeners
   * @param onStartGame Callback function to be called when the start button is clicked
   */
  public initialize(onStartGame: () => void): void {
    this.onStartGame = onStartGame;
    this.shapes = [];

    // Create a set of initial falling shapes - increased for more impressive effect
    for (let i = 0; i < 100; i++) {
      this.addRandomShape();
    }

    // Add event listeners for button interactions
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));

    // Start the animation loop
    this.animate();
  }

  /**
   * Clean up resources and stop animations
   */
  public cleanup(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.removeEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Create and add a random shape to the animation
   */
  private addRandomShape(): void {
    const shapeTypes = Object.values(ExtendedShapeType);
    const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const size = 20 + Math.random() * 60; // More varied sizes
    const position: Point = { 
      x: Math.random() * CANVAS.WIDTH, 
      y: -size - Math.random() * 500 
    };
    
    // Use fixed colors for each shape type
    const color: Color = {...SHAPE_COLORS[randomType]}; // Create a copy of the color
    
    const shape: AnimatedShape = {
      type: randomType,
      position,
      size,
      color,
      speed: 0.5 + Math.random() * 1.5, // Reduced falling speed for better visibility
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      pulseRate: 0.02 + Math.random() * 0.03,
      pulseAmount: 0.1 + Math.random() * 0.2
    };
    
    this.shapes.push(shape);
  }

  /**
   * Draw a shape based on its type
   * @param ctx Canvas context
   * @param shape Shape to be drawn
   */
  private drawSpecialShape(ctx: CanvasRenderingContext2D, shape: AnimatedShape): void {
    const { type, position, size, color } = shape;
    
    // Set fill style based on color
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    
    // Draw a different shape based on type
    switch (type) {
      case ExtendedShapeType.CIRCLE:
        // Draw circle
        ctx.beginPath();
        ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
        
      case ExtendedShapeType.RECTANGLE:
        // Draw rectangle
        ctx.beginPath();
        ctx.rect(position.x - size / 2, position.y - size / 2, size, size);
        ctx.fill();
        ctx.stroke();
        break;
        
      case ExtendedShapeType.TRIANGLE:
        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(position.x, position.y - size / 2);
        ctx.lineTo(position.x + size / 2, position.y + size / 2);
        ctx.lineTo(position.x - size / 2, position.y + size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ExtendedShapeType.STAR:
        // Draw star
        const outerRadius = size / 2;
        const innerRadius = size / 4;
        const spikes = 5;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = i * step - Math.PI / 2;
          const x = position.x + Math.cos(angle) * radius;
          const y = position.y + Math.sin(angle) * radius;
          
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
        
      case ExtendedShapeType.POLYGON:
        // Draw polygon (default arbitrary sided)
        const sides = 7; // Heptagon
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const x = position.x + Math.cos(angle) * (size / 2);
          const y = position.y + Math.sin(angle) * (size / 2);
          
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
        
      case ExtendedShapeType.OCTAGON:
        // Draw octagon
        const octSides = 8;
        ctx.beginPath();
        for (let i = 0; i < octSides; i++) {
          const angle = (i / octSides) * Math.PI * 2;
          const x = position.x + Math.cos(angle) * (size / 2);
          const y = position.y + Math.sin(angle) * (size / 2);
          
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
        
      case ExtendedShapeType.HEXAGON:
        // Draw hexagon
        const hexSides = 6;
        ctx.beginPath();
        for (let i = 0; i < hexSides; i++) {
          const angle = (i / hexSides) * Math.PI * 2;
          const x = position.x + Math.cos(angle) * (size / 2);
          const y = position.y + Math.sin(angle) * (size / 2);
          
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
        
      case ExtendedShapeType.TRAPEZOID:
        // Draw trapezoid
        const topWidth = size * 0.6;
        ctx.beginPath();
        ctx.moveTo(position.x - topWidth / 2, position.y - size / 2);
        ctx.lineTo(position.x + topWidth / 2, position.y - size / 2);
        ctx.lineTo(position.x + size / 2, position.y + size / 2);
        ctx.lineTo(position.x - size / 2, position.y + size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ExtendedShapeType.RHOMBUS:
        // Draw rhombus
        ctx.beginPath();
        ctx.moveTo(position.x, position.y - size / 2);
        ctx.lineTo(position.x + size / 3, position.y);
        ctx.lineTo(position.x, position.y + size / 2);
        ctx.lineTo(position.x - size / 3, position.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case ExtendedShapeType.PENTAGON:
        // Draw pentagon
        const pentSides = 5;
        ctx.beginPath();
        for (let i = 0; i < pentSides; i++) {
          const angle = (i / pentSides) * Math.PI * 2 - Math.PI / 2;
          const x = position.x + Math.cos(angle) * (size / 2);
          const y = position.y + Math.sin(angle) * (size / 2);
          
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
        
      default:
        // Fallback to circle
        ctx.beginPath();
        ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
  }

  /**
   * Animation loop for the start screen
   */
  private animate(): void {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Update the state of all animated elements
   */
  private update(): void {
    // Update falling shapes
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      
      // Move shape down
      shape.position.y += shape.speed;
      
      // Rotate shape
      shape.rotation += shape.rotationSpeed;
      
      // Apply pulsing effect to size but not color
      // We keep the original color constant
      
      // Remove shapes that have fallen off screen
      if (shape.position.y > CANVAS.HEIGHT + shape.size) {
        this.shapes.splice(i, 1);
        this.addRandomShape();
      }
    }
    
    // Ensure we always have enough shapes for impressive visual effect
    while (this.shapes.length < 100) {
      this.addRandomShape();
    }

    // Update button hover animation
    if (this.buttonHovered && this.buttonHoverProgress < 1) {
      this.buttonHoverProgress = Math.min(1, this.buttonHoverProgress + 0.1);
    } else if (!this.buttonHovered && this.buttonHoverProgress > 0) {
      this.buttonHoverProgress = Math.max(0, this.buttonHoverProgress - 0.1);
    }

    // Update border pulse effect
    this.borderPulse = (this.borderPulse + 0.05) % (Math.PI * 2);
  }

  /**
   * Render all elements to the canvas
   */
  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    
    // Draw background
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    
    // Draw falling shapes
    this.shapes.forEach(shape => {
      this.ctx.save();
      this.ctx.translate(shape.position.x, shape.position.y);
      this.ctx.rotate(shape.rotation);
      this.ctx.translate(-shape.position.x, -shape.position.y);
      this.drawSpecialShape(this.ctx, shape);
      this.ctx.restore();
    });
    
    // Draw title
    this.drawTitle();
    
    // Draw Shapey character
    if (this.shapeyImage.complete) {
      const imgWidth = 150;
      const imgHeight = 150;
      this.ctx.drawImage(
        this.shapeyImage, 
        CANVAS.WIDTH / 2 - imgWidth / 2,
        100, 
        imgWidth, 
        imgHeight
      );
    }
    
    // Draw start button
    this.drawStartButton();
    
    // Draw instructions
    this.drawInstructions();
  }

  /**
   * Draw the game title with vibrant styling
   */
  private drawTitle(): void {
    const titleText = "SHAPESPLOSION";
    this.ctx.font = "bold 72px Arial";
    
    // Draw shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillText(titleText, CANVAS.WIDTH / 2 - this.ctx.measureText(titleText).width / 2 + 4, 74);
    
    // Draw gradient text
    const gradient = this.ctx.createLinearGradient(0, 0, CANVAS.WIDTH, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.33, '#ffff00');
    gradient.addColorStop(0.66, '#00ff00');
    gradient.addColorStop(1, '#0000ff');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillText(titleText, CANVAS.WIDTH / 2 - this.ctx.measureText(titleText).width / 2, 70);
  }

  /**
   * Draw the start game button
   */
  private drawStartButton(): void {
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = CANVAS.WIDTH / 2 - buttonWidth / 2;
    const buttonY = CANVAS.HEIGHT / 2 + 80;
    const buttonText = "START GAME";
    
    // Interpolate button color for smooth transition
    const baseColor = [255, 153, 0]; // #ff9900
    const hoverColor = [255, 102, 0]; // #ff6600
    const r = Math.round(baseColor[0] + this.buttonHoverProgress * (hoverColor[0] - baseColor[0]));
    const g = Math.round(baseColor[1] + this.buttonHoverProgress * (hoverColor[1] - baseColor[1]));
    const b = Math.round(baseColor[2] + this.buttonHoverProgress * (hoverColor[2] - baseColor[2]));
    const buttonColor = `rgb(${r}, ${g}, ${b})`;
    
    // Apply shadow effect matching button color
    this.ctx.save();
    this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 5;
    
    // Draw button background
    this.ctx.fillStyle = buttonColor;
    this.ctx.beginPath();
    this.ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
    this.ctx.fill();
    this.ctx.restore(); // Reset shadow effects
    
    // Calculate pulsing border effect
    const pulseValue = (Math.sin(this.borderPulse) + 1) / 2; // Value between 0 and 1
    const borderWidth = 2 + pulseValue * 3;
    const borderOpacity = 0.7 + pulseValue * 0.3;
    
    // Draw button border with pulse effect
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${borderOpacity})`;
    this.ctx.lineWidth = borderWidth;
    this.ctx.beginPath();
    this.ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
    this.ctx.stroke();
    
    // Draw button text
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(buttonText, CANVAS.WIDTH / 2, buttonY + buttonHeight / 2);
    this.ctx.textAlign = 'start';
    this.ctx.textBaseline = 'alphabetic';
  }

  /**
   * Draw the game instructions
   */
  private drawInstructions(): void {
    const instructionsText = [
      "Combine similar shapes to create larger ones!",
      "Drop shapes strategically to make matches",
      "Merge your way to the largest shape possible",
      "Don't let your play area fill up completely!"
    ];
    
    this.ctx.font = "18px Arial";
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    
    instructionsText.forEach((text, index) => {
      this.ctx.fillText(
        text, 
        CANVAS.WIDTH / 2, 
        CANVAS.HEIGHT / 2 + 180 + (index * 30)
      );
    });
    
    this.ctx.textAlign = 'start';
  }

  /**
   * Handle mouse movement for button hover effects
   */
  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    
    // Calculate scaling factor between canvas display size and actual size
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    // Adjust mouse coordinates for any canvas scaling
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    
    // Check if mouse is hovering over start button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = CANVAS.WIDTH / 2 - buttonWidth / 2;
    const buttonY = CANVAS.HEIGHT / 2 + 80;
    
    const isHovering = (
      mouseX >= buttonX && 
      mouseX <= buttonX + buttonWidth && 
      mouseY >= buttonY && 
      mouseY <= buttonY + buttonHeight
    );
    
    // Update button hover state
    if (isHovering !== this.buttonHovered) {
      this.buttonHovered = isHovering;
      
      // Change cursor style based on hover state
      this.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }
  }

  /**
   * Handle click events for button interaction
   */
  private handleClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Check if start button was clicked
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = CANVAS.WIDTH / 2 - buttonWidth / 2;
    const buttonY = CANVAS.HEIGHT / 2 + 80;
    
    if (
      mouseX >= buttonX && 
      mouseX <= buttonX + buttonWidth && 
      mouseY >= buttonY && 
      mouseY <= buttonY + buttonHeight
    ) {
      // Button was clicked, start the game
      this.cleanup();
      this.onStartGame();
    }
  }
}

/**
 * Create and initialize a start screen for the game
 * @param canvas Canvas element to render on
 * @param ctx Canvas rendering context
 * @param onStartGame Callback function when game starts
 * @returns The start screen instance
 */
export function createStartScreen(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D, 
  onStartGame: () => void
): StartScreen {
  const startScreen = new StartScreen(canvas, ctx);
  startScreen.initialize(onStartGame);
  return startScreen;
}

/**
 * Utility function to quickly create and render a start screen
 * @param canvas Canvas element to render on
 * @param ctx Canvas rendering context
 * @param onStartGame Callback function when game starts
 */
export function initStartScreen(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  onStartGame: () => void
): void {
  createStartScreen(canvas, ctx, onStartGame);
}