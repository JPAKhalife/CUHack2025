/**
 * LosingScreen class for the game
 * This is a self-contained screen that renders when the player loses
 * It shows a sad character, falling shapes, and a play again button
 */

// Local types for the losing screen
interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'square' | 'triangle';
}

interface Coordinates {
  x: number;
  y: number;
}

// Local constants
const SHAPE_COLORS = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
const GRAVITY = 0.2;
const MAX_SHAPES = 50;
const MIN_SIZE = 10;
const MAX_SIZE = 30;
const MIN_SPEED = 1;
const MAX_SPEED = 3;

export class LosingScreen {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shapes: Shape[] = [];
  private sadCharacterImg: HTMLImageElement;
  private isActive: boolean = false;
  private buttonCoords: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 };
  private onRestartCallback: () => void;

  /**
   * Creates a new instance of the losing screen
   * @param canvas The canvas element to render on
   * @param onRestart Callback function to call when the player clicks restart
   */
  constructor(canvas: HTMLCanvasElement, onRestart: () => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onRestartCallback = onRestart;

    // Load the sad character image
    this.sadCharacterImg = new Image();
    this.sadCharacterImg.src = '/ShapeyAngry.png';

    // Initialize click listener for the play again button
    this.canvas.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Starts the losing screen animation
   */
  public start(): void {
    this.isActive = true;
    this.shapes = [];
    this.generateShapes();
    this.animate();
  }

  /**
   * Stops the losing screen animation
   */
  public stop(): void {
    this.isActive = false;
  }

  /**
   * Creates a random shape
   * @returns A new random shape
   */
  private createRandomShape(): Shape {
    // Generate random properties for the shape
    const x = Math.random() * this.canvas.width;
    const y = -MAX_SIZE; // Start above the screen
    const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
    const colorIndex = Math.floor(Math.random() * SHAPE_COLORS.length);
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.1;

    // Choose a random shape type
    const shapeTypes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
    const typeIndex = Math.floor(Math.random() * shapeTypes.length);
    
    return {
      x,
      y,
      size,
      color: SHAPE_COLORS[colorIndex],
      speed,
      rotation,
      rotationSpeed,
      type: shapeTypes[typeIndex]
    };
  }

  /**
   * Generates the initial set of falling shapes
   */
  private generateShapes(): void {
    // Create a random number of shapes
    const numShapes = Math.floor(MAX_SHAPES / 2 + Math.random() * (MAX_SHAPES / 2));
    
    for (let i = 0; i < numShapes; i++) {
      // Distribute shapes across the canvas height
      const shape = this.createRandomShape();
      shape.y = Math.random() * this.canvas.height * 2 - this.canvas.height;
      this.shapes.push(shape);
    }
  }

  /**
   * Main animation loop
   */
  private animate(): void {
    if (!this.isActive) return;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw the background
    this.drawBackground();
    
    // Update and draw the shapes
    this.updateShapes();
    this.drawShapes();
    
    // Draw the game over message and character
    this.drawGameOver();
    
    // Draw the play again button
    this.drawPlayAgainButton();
    
    // Request the next frame
    requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Draws a gradient background
   */
  private drawBackground(): void {
    // Create a dark gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Updates the positions of all falling shapes
   */
  private updateShapes(): void {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      
      // Apply gravity
      shape.y += shape.speed;
      shape.rotation += shape.rotationSpeed;
      
      // If shape is below the canvas, reset it to the top
      if (shape.y > this.canvas.height + shape.size) {
        shape.y = -shape.size;
        shape.x = Math.random() * this.canvas.width;
      }
    }
    
    // Occasionally add a new shape
    if (Math.random() < 0.03 && this.shapes.length < MAX_SHAPES) {
      this.shapes.push(this.createRandomShape());
    }
  }

  /**
   * Draws all the shapes
   */
  private drawShapes(): void {
    for (const shape of this.shapes) {
      this.ctx.save();
      
      // Set up the shape's position and rotation
      this.ctx.translate(shape.x, shape.y);
      this.ctx.rotate(shape.rotation);
      this.ctx.fillStyle = shape.color;
      
      // Draw the shape based on its type
      switch (shape.type) {
        case 'circle':
          this.drawCircle(0, 0, shape.size);
          break;
        case 'square':
          this.drawSquare(0, 0, shape.size);
          break;
        case 'triangle':
          this.drawTriangle(0, 0, shape.size);
          break;
      }
      
      this.ctx.restore();
    }
  }

  /**
   * Draws a circle shape
   */
  private drawCircle(x: number, y: number, size: number): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draws a square shape
   */
  private drawSquare(x: number, y: number, size: number): void {
    this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }

  /**
   * Draws a triangle shape
   */
  private drawTriangle(x: number, y: number, size: number): void {
    const height = size * Math.sqrt(3) / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - height / 2);
    this.ctx.lineTo(x - size / 2, y + height / 2);
    this.ctx.lineTo(x + size / 2, y + height / 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Draws the game over message
   */
  private drawGameOver(): void {
    // Draw the sad character image
    if (this.sadCharacterImg.complete) {
      const imgSize = Math.min(this.canvas.width, this.canvas.height) * 0.3;
      const imgX = this.canvas.width / 2 - imgSize / 2;
      const imgY = this.canvas.height * 0.2;
      this.ctx.drawImage(this.sadCharacterImg, imgX, imgY, imgSize, imgSize);
    }
    
    // Draw the game over text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height * 0.5);
    
    // Draw a smaller subtitle
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Better luck next time!', this.canvas.width / 2, this.canvas.height * 0.58);
  }

  /**
   * Draws the play again button
   */
  private drawPlayAgainButton(): void {
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = (this.canvas.width - buttonWidth) / 2;
    const buttonY = this.canvas.height * 0.7;
    
    // Store button coordinates for click detection
    this.buttonCoords = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight
    };
    
    // Draw button background
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.beginPath();
    this.ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    this.ctx.fill();
    
    // Draw button text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PLAY AGAIN', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 8);
  }

  /**
   * Handles click events on the canvas
   * @param event The mouse event
   */
  private handleClick(event: MouseEvent): void {
    if (!this.isActive) return;
    
    // Get the mouse position relative to the canvas
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Check if the play again button was clicked
    if (
      clickX >= this.buttonCoords.x &&
      clickX <= this.buttonCoords.x + this.buttonCoords.width &&
      clickY >= this.buttonCoords.y &&
      clickY <= this.buttonCoords.y + this.buttonCoords.height
    ) {
      this.stop();
      this.onRestartCallback();
    }
  }

  /**
   * Checks if the losing screen is currently active
   * @returns True if the losing screen is active
   */
  public isActiveScreen(): boolean {
    return this.isActive;
  }

  /**
   * Resizes the losing screen to match the canvas size
   */
  public resize(): void {
    // No additional resize logic needed as we use canvas dimensions directly
  }
}

export default LosingScreen;