document.addEventListener('DOMContentLoaded', () => {
    const customCursor = document.querySelector('.custom-cursor');
    const blueTextElement = document.querySelector('.text-blue');
    const iconRevealElements = document.querySelectorAll('.icon-reveal'); // Get all icon reveal layers

    if (!customCursor || !blueTextElement) {
        console.error('Required elements (custom-cursor or text-blue) not found. Check class names.');
        // Note: Not returning here, as iconRevealElements might still be useful if text is missing
    }
    if (iconRevealElements.length === 0) {
        console.warn('No .icon-reveal elements found. Background icon hover effect will not apply.');
    }

    let cursorRadius = 90; // Default if CSS not loaded
    if (customCursor) {
        const customCursorStyle = getComputedStyle(customCursor);
        if (customCursorStyle && customCursorStyle.width) {
            cursorRadius = parseFloat(customCursorStyle.width) / 2;
        }
    }
    
    if (isNaN(cursorRadius) || cursorRadius === 0) {
        console.warn("Cursor radius could not be determined or is 0, defaulting to 90. Ensure .custom-cursor has width set in CSS.");
        cursorRadius = 90;
    }

    let mouseTargetX = window.innerWidth / 2;
    let mouseTargetY = window.innerHeight / 2;
    let currentCursorCenterX = window.innerWidth / 2;
    let currentCursorCenterY = window.innerHeight / 2;

    if (customCursor) {
        customCursor.style.left = currentCursorCenterX + 'px';
        customCursor.style.top = currentCursorCenterY + 'px';
    }

    document.addEventListener('mousemove', (e) => {
        mouseTargetX = e.clientX;
        mouseTargetY = e.clientY;
    });

    function animateCursorAndMask() {
        const smoothing = 0.17;
        currentCursorCenterX += (mouseTargetX - currentCursorCenterX) * smoothing;
        currentCursorCenterY += (mouseTargetY - currentCursorCenterY) * smoothing;

        if (customCursor) {
            customCursor.style.left = currentCursorCenterX + 'px';
            customCursor.style.top = currentCursorCenterY + 'px';
        }

        // Apply clip-path to the blue text layer
        if (blueTextElement) {
            const textBoundingBox = blueTextElement.getBoundingClientRect();
            const textClipPathCenterX = currentCursorCenterX - textBoundingBox.left;
            const textClipPathCenterY = currentCursorCenterY - textBoundingBox.top;
            blueTextElement.style.clipPath = `circle(${cursorRadius}px at ${textClipPathCenterX}px ${textClipPathCenterY}px)`;
        }

        // Apply clip-path to each icon reveal layer
        iconRevealElements.forEach(iconReveal => {
            const iconBoundingBox = iconReveal.getBoundingClientRect();
            const iconClipPathCenterX = currentCursorCenterX - iconBoundingBox.left;
            const iconClipPathCenterY = currentCursorCenterY - iconBoundingBox.top;
            iconReveal.style.clipPath = `circle(${cursorRadius}px at ${iconClipPathCenterX}px ${iconClipPathCenterY}px)`;
        });

        requestAnimationFrame(animateCursorAndMask);
    }

    animateCursorAndMask();
});