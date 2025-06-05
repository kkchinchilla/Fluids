document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing script...");

    const canvas = document.getElementById('watercolorCanvas');
    const backgroundContainer = document.querySelector('.background-container');

    if (!canvas) {
        console.error("CRITICAL: Canvas element with ID 'watercolorCanvas' not found!");
        return;
    }
    if (!backgroundContainer) {
        console.error("CRITICAL: Element with class 'background-container' not found!");
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("CRITICAL: Failed to get 2D rendering context from canvas!");
        return;
    }
    console.log("Canvas and context obtained.");

    let canvasWidth = backgroundContainer.offsetWidth;
    let canvasHeight = backgroundContainer.offsetHeight;

    if (canvasWidth === 0 || canvasHeight === 0) {
        console.warn("Warning: Background container has zero width or height. Canvas might not be visible or sized correctly.", "Container Width:", canvasWidth, "Container Height:", canvasHeight);
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    console.log(`Canvas dimensions set to: ${canvasWidth}x${canvasHeight}`);

    const brushImage = new Image();
    let brushLoaded = false;
    let animationLoopStarted = false;

    // --- Constants for the effect ---
    const FADE_SPEED = 0.01;          // How quickly the trail fades (lower is slower)
    const BRUSH_BASE_SIZE = 300;      // << INCREASED: Base size of the brush image - makes effect area larger
    const STROKE_INTERVAL = 1;       // ms between drawing strokes for performance/density
    const MOUSE_STOP_DELAY = 1;     // << NEW: ms to wait before considering the mouse "stopped"

    let mouse = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        isMoving: false,
        stoppedTimeout: null // To detect when the mouse truly stops
    };
    let lastStrokeTime = 0;

    function initializeCanvas() {
        console.log("Initializing canvas background...");
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        console.log("Canvas background initialized.");
    }

    function drawBrushStroke(x, y) {
        if (!brushLoaded) return;

        // Random variations for organic feel - these happen per stroke
        const brushSize = BRUSH_BASE_SIZE * (0.7 + Math.random() * 0.6); // Vary size slightly
        const angle = Math.random() * Math.PI * 2; // Random rotation

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.globalCompositeOperation = 'destination-out';

        // Adjust globalAlpha for the "erasure" strength. Lower values = softer/more gradient impact.
        // Previous: 0.6 + Math.random() * 0.3 (range 0.6 - 0.9)
        // New for softer effect:
        ctx.globalAlpha = 0.35 + Math.random() * 0.25; // << ADJUSTED: Range 0.35 - 0.6 (softer erasure)

        try {
            ctx.drawImage(brushImage, -brushSize / 2, -brushSize / 2, brushSize, brushSize);
        } catch (e) {
            console.error("Error drawing brush image:", e);
            brushLoaded = false;
        }
        ctx.restore();
    }

    function animate() {
        // 1. Slowly fade the entire canvas back towards the white overlay color
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(255, 255, 255, ${FADE_SPEED})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();

        // 2. If mouse is considered moving, draw new brush strokes
        const now = Date.now();
        if (mouse.isMoving && (now - lastStrokeTime > STROKE_INTERVAL)) {
            if (brushLoaded) {
                drawBrushStroke(mouse.x, mouse.y);
            }
            lastStrokeTime = now;
        }
        requestAnimationFrame(animate);
    }

    function startEffect() {
        if (animationLoopStarted) return;
        animationLoopStarted = true;
        console.log("Starting animation loop...");
        requestAnimationFrame(animate);
    }

    console.log("Attempting to load brush.png...");
    brushImage.onload = () => {
        brushLoaded = true;
        console.log("SUCCESS: Brush image ('brush.png') loaded.");
        initializeCanvas();
        startEffect();
    };
    brushImage.onerror = () => {
        brushLoaded = false;
        console.error("ERROR: Failed to load brush image ('brush.png').");
        alert("WARNING: Brush image ('brush.png') could not be loaded. Watercolor strokes will not appear.");
        initializeCanvas();
        startEffect();
    };
    brushImage.src = 'brush.png';

    // --- Event Listeners ---
    backgroundContainer.addEventListener('mousemove', (e) => {
        const rect = backgroundContainer.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        
        mouse.isMoving = true; // Set mouse as moving

        // Clear the previous timeout (if any) that was set to mark mouse as stopped
        if (mouse.stoppedTimeout) {
            clearTimeout(mouse.stoppedTimeout);
        }

        // Set a new timeout. If this timeout completes, it means mouse has stopped.
        mouse.stoppedTimeout = setTimeout(() => {
            // console.log("Mouse stopped."); // For debugging
            mouse.isMoving = false;
        }, MOUSE_STOP_DELAY);
    });

    backgroundContainer.addEventListener('mouseleave', () => {
        mouse.isMoving = false;
        if (mouse.stoppedTimeout) {
            clearTimeout(mouse.stoppedTimeout); // Clear timeout when mouse leaves
        }
    });

    window.addEventListener('resize', () => {
        console.log("Window resize detected.");
        canvasWidth = backgroundContainer.offsetWidth;
        canvasHeight = backgroundContainer.offsetHeight;
        if (canvasWidth === 0 || canvasHeight === 0) {
            console.warn("Resized: Background container has zero width or height.");
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        console.log(`Canvas dimensions updated to: ${canvasWidth}x${canvasHeight}`);
        initializeCanvas();
    });
});