import { Application, Color, FillGradient, Text, TextStyle } from 'pixi.js';

// Create a PixiJS application.
(async () => {
    // Create a PixiJS application.
    const app = new Application();
    
    // Initialize the application.
    await app.init({ width: 640, height: 480, background: '#1099bb' });

    // Add the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());

    colors.forEach((number, index) =>
    {
        const ratio = index / colors.length;

        fill.addColorStop(ratio, number);
    });

    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: { fill },
        stroke: { color: '#4a1850', width: 5, join: 'round' },
        dropShadow: {
            color: '#000000',
            blur: 4,
            angle: Math.PI / 6,
            distance: 6,
        },
        wordWrap: false,
    });

    const richText = new Text({
        text: 'Rich text with a lot of options and across multiple lines',
        style,
    });

  
})();