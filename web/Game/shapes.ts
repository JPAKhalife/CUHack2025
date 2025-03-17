import Matter from 'matter-js';
import { IShape, ShapeType, IPosition, IVector, ShapeColor } from './types';
import { 
  SHAPE_SIZES,
  SHAPE_COLORS,
  PHYSICS
} from './constants';

/**
 * Creates a new shape with the specified properties
 * @param type The type of shape to create
 * @param position The initial position of the shape
 * @param size The size of the shape
 * @param color The color of the shape
 * @param rotation Initial rotation in radians
 * @returns A new shape object
 */
export const createShape = (
  type: ShapeType,
  position: IPosition,
  size: number = SHAPE_SIZES.MEDIUM,
  color: ShapeColor = getRandomShapeColor(),
  rotation: number = 0
): IShape => {
  // Create a unique ID for the shape
  const id = `shape-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create the physical body based on the shape type
  let body;
  
  switch (type) {
    case ShapeType.CIRCLE:
      body = Matter.Bodies.circle(position.x, position.y, size / 2, {
        density: PHYSICS.DENSITY,
        friction: PHYSICS.FRICTION,
        restitution: PHYSICS.RESTITUTION,
        angle: rotation
      });
      break;
      
    case ShapeType.SQUARE:
      body = Matter.Bodies.rectangle(position.x, position.y, size, size, {
        density: PHYSICS.DENSITY,
        friction: PHYSICS.FRICTION,
        restitution: PHYSICS.RESTITUTION,
        angle: rotation
      });
      break;
      
    case ShapeType.TRIANGLE:
      // Create triangular vertices
      const height = (Math.sqrt(3) / 2) * size;
      const vertices = [
        { x: position.x, y: position.y - (height / 2) }, // top
        { x: position.x - (size / 2), y: position.y + (height / 2) }, // bottom left
        { x: position.x + (size / 2), y: position.y + (height / 2) }  // bottom right
      ];
      
      body = Matter.Bodies.fromVertices(position.x, position.y, [vertices], {
        density: PHYSICS.DENSITY,
        friction: PHYSICS.FRICTION,
        restitution: PHYSICS.RESTITUTION,
        angle: rotation
      });
      break;
      
    case ShapeType.PENTAGON:
      // Create pentagon vertices (regular pentagon)
      const pentagonVertices = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2; // Start at top
        pentagonVertices.push({
          x: position.x + size / 2 * Math.cos(angle),
          y: position.y + size / 2 * Math.sin(angle)
        });
      }
      
      body = Matter.Bodies.fromVertices(position.x, position.y, [pentagonVertices], {
        density: PHYSICS.DENSITY,
        friction: PHYSICS.FRICTION,
        restitution: PHYSICS.RESTITUTION,
        angle: rotation
      });
      break;
      
    case ShapeType.HEXAGON:
      // Create hexagon vertices (regular hexagon)
      const hexagonVertices = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2; // Start at top
        hexagonVertices.push({
          x: position.x + size / 2 * Math.cos(angle),
          y: position.y + size / 2 * Math.sin(angle)
        });
      }
      
      body = Matter.Bodies.fromVertices(position.x, position.y, [hexagonVertices], {
        density: PHYSICS.DENSITY,
        friction: PHYSICS.FRICTION,
        restitution: PHYSICS.RESTITUTION,
        angle: rotation
      });
      break;
      
    default:
      throw new Error(`Unknown shape type: ${type}`);
  }
  
  // Create and return the shape object
  return {
    id,
    type,
    body,
    position,
    size,
    color,
    rotation,
    velocity: { x: 0, y: 0 },
    angularVelocity: 0,
    active: true,
    score: calculateShapeScore(type, size)
  };
};

/**
 * Get a random shape type
 * @returns A random shape type
 */
export const getRandomShapeType = (): ShapeType => {
  const types = Object.values(ShapeType);
  return types[Math.floor(Math.random() * types.length)];
};

/**
 * Get a random shape color
 * @returns A random shape color
 */
export const getRandomShapeColor = (): ShapeColor => {
  return SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)];
};

/**
 * Get a random shape size
 * @returns A random shape size (small, medium, or large)
 */
export const getRandomShapeSize = (): number => {
  const sizes = [SHAPE_SIZES.SMALL, SHAPE_SIZES.MEDIUM, SHAPE_SIZES.LARGE];
  const weights = [0.5, 0.3, 0.2]; // 50% small, 30% medium, 20% large
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < sizes.length; i++) {
    sum += weights[i];
    if (random < sum) return sizes[i];
  }
  
  return SHAPE_SIZES.MEDIUM; // default fallback
};

/**
 * Creates a random shape at the given position
 * @param position The position to create the shape at
 * @returns A new randomly generated shape
 */
export const createRandomShape = (position: IPosition): IShape => {
  return createShape(
    getRandomShapeType(),
    position,
    getRandomShapeSize(),
    getRandomShapeColor(),
    Math.random() * Math.PI * 2
  );
};

/**
 * Apply a force or impulse to a shape
 * @param shape The shape to apply force to
 * @param force The force vector to apply
 */
export const applyForceToShape = (shape: IShape, force: IVector): void => {
  Matter.Body.applyForce(shape.body, shape.body.position, force);
};

/**
 * Apply an explosion force to multiple shapes from a point
 * @param shapes Array of shapes to affect
 * @param position Center of the explosion
 * @param force Force magnitude
 * @param radius Explosion radius
 */
export const applyExplosionForce = (
  shapes: IShape[],
  position: IPosition,
  force: number,
  radius: number
): void => {
  shapes.forEach(shape => {
    const distance = Math.sqrt(
      Math.pow(shape.body.position.x - position.x, 2) +
      Math.pow(shape.body.position.y - position.y, 2)
    );
    
    if (distance < radius) {
      const forceMagnitude = force * (1 - distance / radius);
      const angle = Math.atan2(
        shape.body.position.y - position.y,
        shape.body.position.x - position.x
      );
      
      const forceVector = {
        x: Math.cos(angle) * forceMagnitude,
        y: Math.sin(angle) * forceMagnitude
      };
      
      applyForceToShape(shape, forceVector);
    }
  });
};

/**
 * Draw a shape on a canvas context
 * @param ctx Canvas rendering context
 * @param shape The shape to draw
 */
export const drawShape = (ctx: CanvasRenderingContext2D, shape: IShape): void => {
  // Don't draw inactive shapes
  if (!shape.active) return;
  
  // Get the current position from the physics body
  const position = shape.body.position;
  const angle = shape.body.angle;
  
  // Save the current context state
  ctx.save();
  
  // Move to the shape's position and rotate
  ctx.translate(position.x, position.y);
  ctx.rotate(angle);
  
  // Set fill color and line style
  ctx.fillStyle = shape.color;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  
  // Draw the shape based on type
  switch (shape.type) {
    case ShapeType.CIRCLE:
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
      
    case ShapeType.SQUARE:
      const halfSize = shape.size / 2;
      ctx.beginPath();
      ctx.rect(-halfSize, -halfSize, shape.size, shape.size);
      ctx.fill();
      ctx.stroke();
      break;
      
    case ShapeType.TRIANGLE:
      const height = (Math.sqrt(3) / 2) * shape.size;
      ctx.beginPath();
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(-shape.size / 2, height / 2);
      ctx.lineTo(shape.size / 2, height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
      
    case ShapeType.PENTAGON:
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2; // Start at top
        const x = shape.size / 2 * Math.cos(angle);
        const y = shape.size / 2 * Math.sin(angle);
        
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
      
    case ShapeType.HEXAGON:
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI / 6) - Math.PI / 2; // Start at top
        const x = shape.size / 2 * Math.cos(angle);
        const y = shape.size / 2 * Math.sin(angle);
        
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
  
  // Restore the context to its original state
  ctx.restore();
};

/**
 * Update the shape's properties from its physics body
 * @param shape The shape to update
 */
export const updateShapeFromBody = (shape: IShape): void => {
  // Update position from the physics body
  shape.position = {
    x: shape.body.position.x,
    y: shape.body.position.y
  };
  
  // Update rotation from the physics body
  shape.rotation = shape.body.angle;
  
  // Update velocity from the physics body
  shape.velocity = {
    x: shape.body.velocity.x,
    y: shape.body.velocity.y
  };
  
  // Update angular velocity from the physics body
  shape.angularVelocity = shape.body.angularVelocity;
};

/**
 * Calculate a score for a shape based on its type and size
 * @param type The shape type
 * @param size The shape size
 * @returns A score value
 */
export const calculateShapeScore = (type: ShapeType, size: number): number => {
  // Base score by shape type (more complex shapes are worth more)
  let typeScore = 0;
  switch (type) {
    case ShapeType.CIRCLE:
      typeScore = 10;
      break;
    case ShapeType.SQUARE:
      typeScore = 20;
      break;
    case ShapeType.TRIANGLE:
      typeScore = 30;
      break;
    case ShapeType.PENTAGON:
      typeScore = 40;
      break;
    case ShapeType.HEXAGON:
      typeScore = 50;
      break;
  }
  
  // Size multiplier (smaller shapes are worth more)
  let sizeMultiplier = 1;
  if (size === SHAPE_SIZES.SMALL) {
    sizeMultiplier = 3;  // Small shapes are worth 3x
  } else if (size === SHAPE_SIZES.MEDIUM) {
    sizeMultiplier = 2;  // Medium shapes are worth 2x
  } else if (size === SHAPE_SIZES.LARGE) {
    sizeMultiplier = 1;  // Large shapes are worth 1x
  }
  
  return typeScore * sizeMultiplier;
};

/**
 * Check if a point is inside a shape
 * @param shape The shape to check
 * @param point The point coordinates
 * @returns True if the point is inside the shape
 */
export const isPointInShape = (shape: IShape, point: IPosition): boolean => {
  return Matter.Query.point([shape.body], point).length > 0;
};

/**
 * Split a shape into multiple smaller shapes
 * @param shape The shape to split
 * @param count Number of smaller shapes to create
 * @returns Array of new smaller shapes
 */
export const splitShape = (shape: IShape, count: number = 2): IShape[] => {
  const newShapes: IShape[] = [];
  
  // Only split if the shape is large enough
  if (shape.size <= SHAPE_SIZES.SMALL) {
    return newShapes;
  }
  
  // Calculate new size (decrease by 50%)
  const newSize = shape.size * 0.5;
  
  for (let i = 0; i < count; i++) {
    // Create a new position with slight offset from original
    const offset = 20; // pixels
    const offsetX = (Math.random() - 0.5) * offset;
    const offsetY = (Math.random() - 0.5) * offset;
    
    const newPosition = {
      x: shape.position.x + offsetX,
      y: shape.position.y + offsetY
    };
    
    // Create a new shape with the same type but smaller size
    const newShape = createShape(
      shape.type,
      newPosition,
      newSize,
      shape.color,
      Math.random() * Math.PI * 2
    );
    
    // Add some velocity to make it explode outward
    const explosionForce = {
      x: offsetX * 0.05,
      y: offsetY * 0.05
    };
    
    applyForceToShape(newShape, explosionForce);
    
    // Add to the array
    newShapes.push(newShape);
  }
  
  return newShapes;
};