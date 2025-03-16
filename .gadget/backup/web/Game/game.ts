import { Application } from 'pixi.js';

// Create a PixiJS application.
(async () => {
    // Create a PixiJS application.
    const app = new Application();
    
    // Initialize the application.
    await app.init({ width: 640, height: 480, background: '#1099bb' });

    // Add the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
})();