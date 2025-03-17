import { api } from "../api";

/**
 * UI component management for the game
 * This module handles rendering and interaction with UI elements like buttons,
 * text displays, score counters, etc.
 */

/**
 * Represents a button in the game UI
 */
interface Button {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onClick: () => void;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
    borderColor?: string;
    hoverColor?: string;
  };
  hovered?: boolean;
}

/**
 * Represents text display in the game UI
 */
interface TextDisplay {
  x: number;
  y: number;
  text: string;
  style?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
  };
}

/**
 * Represents a score display in the game UI
 */
interface ScoreDisplay {
  x: number;
  y: number;
  score: number;
  prefix?: string;
  style?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    align?: CanvasTextAlign;
  };
}

/**
 * Creates a new button with default styling
 */
export function createButton(
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  onClick: () => void,
  style?: Button["style"]
): Button {
  return {
    x,
    y,
    width,
    height,
    text,
    onClick,
    style: {
      backgroundColor: style?.backgroundColor || "#4CAF50",
      textColor: style?.textColor || "#FFFFFF",
      fontSize: style?.fontSize || 16,
      borderRadius: style?.borderRadius || 5,
      borderColor: style?.borderColor || "#2E7D32",
      hoverColor: style?.hoverColor || "#3E8E41"
    },
    hovered: false
  };
}

/**
 * Renders a button on the canvas
 */
export function renderButton(ctx: CanvasRenderingContext2D, button: Button): void {
  const { x, y, width, height, text, style, hovered } = button;
  
  // Draw button background
  ctx.fillStyle = hovered ? (style?.hoverColor || "#3E8E41") : (style?.backgroundColor || "#4CAF50");
  
  // Create rounded rectangle for button
  ctx.beginPath();
  const radius = style?.borderRadius || 5;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  
  // Draw button border
  ctx.strokeStyle = style?.borderColor || "#2E7D32";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw button text
  ctx.fillStyle = style?.textColor || "#FFFFFF";
  ctx.font = `${style?.fontSize || 16}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + height / 2);
}

/**
 * Checks if a point (mouse position) is inside a button
 */
export function isPointInButton(x: number, y: number, button: Button): boolean {
  return (
    x >= button.x &&
    x <= button.x + button.width &&
    y >= button.y &&
    y <= button.y + button.height
  );
}

/**
 * Updates button hover state based on mouse position
 */
export function updateButtonHover(mouseX: number, mouseY: number, button: Button): Button {
  const isHovered = isPointInButton(mouseX, mouseY, button);
  return {
    ...button,
    hovered: isHovered
  };
}

/**
 * Creates a text display element
 */
export function createTextDisplay(
  x: number,
  y: number,
  text: string,
  style?: TextDisplay["style"]
): TextDisplay {
  return {
    x,
    y,
    text,
    style: {
      color: style?.color || "black",
      fontSize: style?.fontSize || 16,
      fontFamily: style?.fontFamily || "Arial",
      align: style?.align || "left",
      baseline: style?.baseline || "top"
    }
  };
}

/**
 * Renders text display on the canvas
 */
export function renderTextDisplay(ctx: CanvasRenderingContext2D, textDisplay: TextDisplay): void {
  const { x, y, text, style } = textDisplay;
  
  ctx.fillStyle = style?.color || "black";
  ctx.font = `${style?.fontSize || 16}px ${style?.fontFamily || "Arial"}`;
  ctx.textAlign = style?.align || "left";
  ctx.textBaseline = style?.baseline || "top";
  ctx.fillText(text, x, y);
}

/**
 * Creates a score display element
 */
export function createScoreDisplay(
  x: number,
  y: number,
  score: number,
  prefix: string = "Score: ",
  style?: ScoreDisplay["style"]
): ScoreDisplay {
  return {
    x,
    y,
    score,
    prefix,
    style: {
      color: style?.color || "black",
      fontSize: style?.fontSize || 20,
      fontFamily: style?.fontFamily || "Arial",
      align: style?.align || "left"
    }
  };
}

/**
 * Renders the score display on the canvas
 */
export function renderScoreDisplay(ctx: CanvasRenderingContext2D, scoreDisplay: ScoreDisplay): void {
  const { x, y, score, prefix, style } = scoreDisplay;
  
  ctx.fillStyle = style?.color || "black";
  ctx.font = `${style?.fontSize || 20}px ${style?.fontFamily || "Arial"}`;
  ctx.textAlign = style?.align || "left";
  ctx.textBaseline = "top";
  ctx.fillText(`${prefix || "Score: "}${score}`, x, y);
}

/**
 * Updates a score display with a new score value
 */
export function updateScoreDisplay(scoreDisplay: ScoreDisplay, newScore: number): ScoreDisplay {
  return {
    ...scoreDisplay,
    score: newScore
  };
}

/**
 * Displays a temporary message on the screen
 */
export function displayTemporaryMessage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  message: string,
  duration: number = 2000,
  style: TextDisplay["style"] = {}
): Promise<void> {
  const textDisplay = createTextDisplay(x, y, message, style);
  renderTextDisplay(ctx, textDisplay);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // This will be handled by clearing/redrawing the canvas in the main game loop
      resolve();
    }, duration);
  });
}

/**
 * Creates and renders a game over overlay
 */
export function displayGameOver(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  finalScore: number,
  onRestart: () => void
): void {
  // Semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Game Over text
  const gameOverText = createTextDisplay(
    canvasWidth / 2,
    canvasHeight / 3,
    "GAME OVER",
    {
      color: "white",
      fontSize: 48,
      fontFamily: "Arial",
      align: "center",
      baseline: "middle"
    }
  );
  renderTextDisplay(ctx, gameOverText);
  
  // Final score text
  const scoreText = createTextDisplay(
    canvasWidth / 2,
    canvasHeight / 2,
    `Final Score: ${finalScore}`,
    {
      color: "white",
      fontSize: 32,
      fontFamily: "Arial",
      align: "center",
      baseline: "middle"
    }
  );
  renderTextDisplay(ctx, scoreText);
  
  // Restart button
  const restartButton = createButton(
    canvasWidth / 2 - 100,
    canvasHeight * 2 / 3,
    200,
    50,
    "Play Again",
    onRestart,
    {
      backgroundColor: "#FF5722",
      hoverColor: "#E64A19",
      fontSize: 24
    }
  );
  renderButton(ctx, restartButton);
  
  // Return the button so it can be checked for clicks
  return restartButton;
}

/**
 * Creates a countdown display before game starts
 */
export function startCountdown(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  onComplete: () => void
): void {
  let count = 3;
  
  const displayCount = () => {
    // Clear the center area of the canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(canvasWidth / 2 - 50, canvasHeight / 2 - 50, 100, 100);
    
    const countText = createTextDisplay(
      canvasWidth / 2,
      canvasHeight / 2,
      count.toString(),
      {
        color: "white",
        fontSize: 64,
        fontFamily: "Arial",
        align: "center",
        baseline: "middle"
      }
    );
    renderTextDisplay(ctx, countText);
    
    count--;
    
    if (count >= 0) {
      setTimeout(displayCount, 1000);
    } else {
      // Display "GO!" message
      ctx.fillRect(canvasWidth / 2 - 100, canvasHeight / 2 - 50, 200, 100);
      const goText = createTextDisplay(
        canvasWidth / 2,
        canvasHeight / 2,
        "GO!",
        {
          color: "#4CAF50",
          fontSize: 64,
          fontFamily: "Arial",
          align: "center",
          baseline: "middle"
        }
      );
      renderTextDisplay(ctx, goText);
      
      // Start the game after a short delay
      setTimeout(onComplete, 1000);
    }
  };
  
  displayCount();
}

/**
 * Creates and renders a level completion UI
 */
export function displayLevelComplete(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  level: number,
  score: number,
  onNextLevel: () => void
): void {
  // Semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Level complete text
  const levelCompleteText = createTextDisplay(
    canvasWidth / 2,
    canvasHeight / 3,
    `LEVEL ${level} COMPLETE!`,
    {
      color: "white",
      fontSize: 40,
      fontFamily: "Arial",
      align: "center",
      baseline: "middle"
    }
  );
  renderTextDisplay(ctx, levelCompleteText);
  
  // Score text
  const scoreText = createTextDisplay(
    canvasWidth / 2,
    canvasHeight / 2,
    `Score: ${score}`,
    {
      color: "white",
      fontSize: 32,
      fontFamily: "Arial",
      align: "center",
      baseline: "middle"
    }
  );
  renderTextDisplay(ctx, scoreText);
  
  // Next level button
  const nextLevelButton = createButton(
    canvasWidth / 2 - 100,
    canvasHeight * 2 / 3,
    200,
    50,
    "Next Level",
    onNextLevel,
    {
      backgroundColor: "#2196F3",
      hoverColor: "#1976D2",
      fontSize: 24
    }
  );
  renderButton(ctx, nextLevelButton);
  
  // Return the button so it can be checked for clicks
  return nextLevelButton;
}