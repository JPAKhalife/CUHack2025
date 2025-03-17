import Matter from 'matter-js';

/**
 * Physics engine module for handling Matter.js integration.
 * This module provides functions to create and manage physics bodies, handle collisions,
 * and update the physics simulation.
 */

// Re-export Matter.js modules we'll use throughout the game
export const {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Composite,
  Events,
  Vector
} = Matter;

/**
 * Represents a physics world configuration
 */
export interface PhysicsWorldConfig {
  width: number;
  height: number;
  gravity: { x: number; y: number };
  enableSleeping?: boolean;
  timing?: {
    timeScale: number;
  };
}

/**
 * Represents a collision callback function
 */
export type CollisionHandler = (
  bodyA: Matter.Body,
  bodyB: Matter.Body,
  collision: Matter.ICollision
) => void;

/**
 * Creates and initializes a physics engine with the given configuration
 * @param config Configuration for the physics world
 * @returns The created physics engine and world
 */
export function createPhysicsWorld(config: PhysicsWorldConfig): {
  engine: Matter.Engine;
  world: Matter.World;
} {
  // Create a physics engine
  const engine = Engine.create({
    enableSleeping: config.enableSleeping ?? true,
    timing: config.timing 
  });

  // Set gravity
  engine.gravity.x = config.gravity.x;
  engine.gravity.y = config.gravity.y;

  // Get the world from the engine
  const world = engine.world;

  return { engine, world };
}

/**
 * Creates a physics renderer for debugging and visualization
 * @param engine The physics engine to render
 * @param element The DOM element to render into
 * @param options Additional rendering options
 * @returns The created renderer
 */
export function createPhysicsRenderer(
  engine: Matter.Engine,
  element: HTMLElement,
  options: Matter.IRendererOptions = {}
): Matter.Render {
  const defaultOptions: Matter.IRendererOptions = {
    width: element.clientWidth,
    height: element.clientHeight,
    wireframes: false,
    background: 'transparent',
    showSleeping: false,
    showDebug: false,
    showBroadphase: false,
    showBounds: false,
    showVelocity: false,
    showCollisions: false,
    showSeparations: false,
    showAxes: false,
    showPositions: false,
    showAngleIndicator: false,
    showIds: false,
    showVertexNumbers: false
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const render = Render.create({
    element,
    engine: engine,
    options: mergedOptions
  });

  Render.run(render);
  return render;
}

/**
 * Creates a rectangular physics body
 * @param x X position
 * @param y Y position
 * @param width Width of the rectangle
 * @param height Height of the rectangle
 * @param options Additional body options
 * @returns The created rectangular body
 */
export function createRectBody(
  x: number,
  y: number,
  width: number,
  height: number,
  options: Matter.IBodyDefinition = {}
): Matter.Body {
  return Bodies.rectangle(x, y, width, height, options);
}

/**
 * Creates a circular physics body
 * @param x X position
 * @param y Y position
 * @param radius Radius of the circle
 * @param options Additional body options
 * @returns The created circular body
 */
export function createCircleBody(
  x: number,
  y: number,
  radius: number,
  options: Matter.IBodyDefinition = {}
): Matter.Body {
  return Bodies.circle(x, y, radius, options);
}

/**
 * Creates a polygon physics body
 * @param x X position
 * @param y Y position
 * @param sides Number of sides
 * @param radius Radius of the polygon
 * @param options Additional body options
 * @returns The created polygon body
 */
export function createPolygonBody(
  x: number,
  y: number,
  sides: number,
  radius: number,
  options: Matter.IBodyDefinition = {}
): Matter.Body {
  return Bodies.polygon(x, y, sides, radius, options);
}

/**
 * Creates static walls around the canvas to contain objects
 * @param width Width of the container
 * @param height Height of the container
 * @param thickness Thickness of the walls
 * @param options Additional body options
 * @returns Array of wall bodies
 */
export function createBoundaryWalls(
  width: number,
  height: number,
  thickness: number =.20,
  options: Matter.IBodyDefinition = {}
): Matter.Body[] {
  const defaultOptions: Matter.IBodyDefinition = {
    isStatic: true,
    restitution: 0.2,
    friction: 0.1,
    ...options
  };
  
  // Create walls at the edges of the canvas
  return [
    // Bottom wall
    Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, defaultOptions),
    // Top wall
    Bodies.rectangle(width / 2, -thickness / 2, width, thickness, defaultOptions),
    // Left wall
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height, defaultOptions),
    // Right wall
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, defaultOptions)
  ];
}

/**
 * Adds collision event handling to the engine
 * @param engine The physics engine
 * @param handler Callback function for collision events
 * @returns A cleanup function to remove the event listener
 */
export function addCollisionHandler(
  engine: Matter.Engine,
  handler: CollisionHandler
): () => void {
  const collisionEvent = (event: Matter.IEventCollision<Matter.Engine>) => {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      handler(pair.bodyA, pair.bodyB, pair.collision);
    }
  };

  // Add event listener for collisions
  Events.on(engine, 'collisionStart', collisionEvent);
  
  // Return cleanup function
  return () => {
    Events.off(engine, 'collisionStart', collisionEvent);
  };
}

/**
 * Applies a force to a body
 * @param body The body to apply force to
 * @param force The force vector {x, y}
 */
export function applyForce(
  body: Matter.Body,
  force: Matter.Vector
): void {
  Body.applyForce(body, body.position, force);
}

/**
 * Sets the velocity of a body
 * @param body The body to set velocity for
 * @param velocity The velocity vector {x, y}
 */
export function setVelocity(
  body: Matter.Body,
  velocity: Matter.Vector
): void {
  Body.setVelocity(body, velocity);
}

/**
 * Updates the physics simulation
 * @param engine The physics engine to update
 * @param deltaTime Optional time step value in milliseconds
 */
export function updatePhysics(
  engine: Matter.Engine,
  deltaTime?: number
): void {
  try {
    // If we don't have a deltaTime, use a fixed time step of 1000/60 ms (60 FPS)
    const delta = deltaTime !== undefined ? deltaTime : 1000/60;
    
    // Create a timestamp for the engine if needed
    if (!engine.timing) {
      engine.timing = {
        timeScale: 1,
        timestamp: 0,
        lastDelta: delta,
        lastElapsed: 0
      };
    }
    
    // Update engine's timestamp
    if (engine.timing.timestamp === 0) {
      engine.timing.timestamp = Date.now();
    } else {
      engine.timing.timestamp += delta;
    }
    
    // Update the engine with the delta value directly
    // This avoids Matter.js's internal timestamp handling
    Engine.update(engine, delta, 1.0);
  } catch (error) {
    console.error('Error updating physics engine:', error);
  }
}

/**
 * Adds a body or composite to the world
 * @param world The physics world
 * @param body The body or composite to add
 */
export function addToWorld(
  world: Matter.World,
  body: Matter.Body | Matter.Composite
): void {
  Composite.add(world, body);
}

/**
 * Removes a body or composite from the world
 * @param world The physics world
 * @param body The body or composite to remove
 */
export function removeFromWorld(
  world: Matter.World,
  body: Matter.Body | Matter.Composite
): void {
  Composite.remove(world, body);
}

/**
 * Clears all bodies from the world
 * @param world The physics world to clear
 */
export function clearWorld(world: Matter.World): void {
  Composite.clear(world);
}

/**
 * Sets body properties that can be changed after creation
 * @param body The body to modify
 * @param properties The properties to set
 */
export function setBodyProperties(
  body: Matter.Body,
  properties: Partial<Matter.IBodyDefinition>
): void {
  Body.set(body, properties);
}

/**
 * Scales a body by the given scale factor
 * @param body The body to scale
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 */
export function scaleBody(
  body: Matter.Body,
  scaleX: number,
  scaleY: number = scaleX
): void {
  Body.scale(body, scaleX, scaleY);
}

/**
 * Rotates a body to the specified angle
 * @param body The body to rotate
 * @param angle The angle in radians
 */
export function rotateBody(
  body: Matter.Body,
  angle: number
): void {
  Body.rotate(body, angle);
}

/**
 * Sets the position of a body
 * @param body The body to position
 * @param position The new position {x, y}
 */
export function setPosition(
  body: Matter.Body,
  position: Matter.Vector
): void {
  Body.setPosition(body, position);
}

/**
 * Checks if two bodies are colliding
 * @param bodyA First body
 * @param bodyB Second body
 * @returns True if the bodies are colliding
 */
export function bodiesAreColliding(
  bodyA: Matter.Body,
  bodyB: Matter.Body
): boolean {
  return Matter.Collision.collides(bodyA, bodyB) !== null;
}