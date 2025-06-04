// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('nav-canvas');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    const vLine = document.getElementById('cursor-v-line');
    const hLine = document.getElementById('cursor-h-line');
    const customCursorImage = document.getElementById('custom-cursor-image'); // Get the cursor image element

    const numLinks = navLinks.length;
    // ... (rest of your variable declarations) ...
    let cursorYPercent = 0.5;
    let currentRAF = null;
    let hoveredLinkElement = null;
    let baseRadius = 150;


    navLinks.forEach((link, index) => {
        // ... (your existing code) ...
        const angleDeg = parseFloat(link.dataset.angle) || (-90 + (360 / numLinks) * index); //
        link.dataset.baseAngleRad = (angleDeg * (Math.PI / 180)).toFixed(4); //
    });

    function updateNavLinkStyles() {
        // ... (your existing updateNavLinkStyles function code) ...
        if (!canvas) return; //

        const rotationRangeRad = Math.PI; //
        const dynamicRotationOffsetRad = (cursorYPercent - 0.5) * rotationRangeRad; //

        navLinks.forEach(link => { //
            if (link.classList.contains('expanding-to-fullscreen')) { //
                return; //
            }

            const baseAngleRad = parseFloat(link.dataset.baseAngleRad); //
            const currentAngleRad = baseAngleRad + dynamicRotationOffsetRad; //

            const rotatedX = baseRadius * Math.cos(currentAngleRad); //
            const rotatedY = baseRadius * Math.sin(currentAngleRad); //

            let finalX = rotatedX; //
            let finalY = rotatedY; //
            let currentScale = 1.0; //
            let currentZIndex = 5; //

            if (hoveredLinkElement) { //
                if (link === hoveredLinkElement) { //
                    const moveFactorHovered = 0.25; //
                    finalX = rotatedX * (1 - moveFactorHovered); //
                    finalY = rotatedY * (1 - moveFactorHovered); //
                    currentScale = 1.2; //
                    currentZIndex = 20; //
                } else {
                    const moveAwayFactor = 0.15; //
                    finalX = rotatedX * (1 + moveAwayFactor); //
                    finalY = rotatedY * (1 + moveAwayFactor); //
                    currentScale = 0.85; //
                    currentZIndex = 5; //
                }
            }

            link.style.transform = `translate(calc(-50% + ${finalX.toFixed(2)}px), calc(-50% + ${finalY.toFixed(2)}px)) scale(${currentScale})`; //
            link.style.zIndex = currentZIndex; //
            link.style.opacity = '1'; //
        });
    }

    function scheduleUpdate() {
        // ... (your existing scheduleUpdate function code) ...
        if (!currentRAF) { //
            currentRAF = requestAnimationFrame(() => { //
                updateNavLinkStyles(); //
                currentRAF = null; //
            });
        }
    }

    document.addEventListener('mousemove', (event) => {
        cursorYPercent = event.clientY / window.innerHeight; //

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        if (vLine && hLine) {
            vLine.style.left = `${mouseX}px`;
            hLine.style.top = `${mouseY}px`;
            vLine.style.display = 'block';
            hLine.style.display = 'block';
        }

        // Update custom cursor image position
        if (customCursorImage) {
            customCursorImage.style.left = `${mouseX}px`;
            customCursorImage.style.top = `${mouseY}px`;
            customCursorImage.style.display = 'block'; // Make it visible
        }

        scheduleUpdate(); //
    }, { passive: true }); //

    document.addEventListener('mouseleave', () => {
        if (vLine && hLine) {
            vLine.style.display = 'none';
            hLine.style.display = 'none';
        }
        // Hide custom cursor image when mouse leaves the window
        if (customCursorImage) {
            customCursorImage.style.display = 'none';
        }
    });

    document.addEventListener('mouseenter', () => {
        // This event might be more reliable on 'document' or 'window'
        // depending on browser behavior with 'mouseleave' on 'document'.
        if (vLine && hLine) {
            vLine.style.display = 'block';
            hLine.style.display = 'block';
        }
        // Show custom cursor image when mouse enters the window
        if (customCursorImage) {
            customCursorImage.style.display = 'block';
        }
    });

    function positionNavLinksAndSetup() {
        // ... (your existing positionNavLinksAndSetup function code) ...
        let rawRadius = getComputedStyle(document.documentElement).getPropertyValue('--nav-link-radius').trim(); //
        let parsedRadius = parseFloat(rawRadius); //

        if (isNaN(parsedRadius) || parsedRadius <= 0) { //
            console.warn("Radius is invalid ('" + rawRadius + "' resulted in " + parsedRadius + "). Falling back to default radius: 150px"); //
            baseRadius = 150; //
        } else {
            baseRadius = parsedRadius; //
        }
        console.log("Using radius (px):", baseRadius); //
        updateNavLinkStyles(); //
    }

    positionNavLinksAndSetup(); //

    // ... (rest of your event listeners for navLinks, resize, etc.) ...
    let resizeTimeout; //
    window.addEventListener('resize', () => { //
        clearTimeout(resizeTimeout); //
        resizeTimeout = setTimeout(() => { //
            positionNavLinksAndSetup(); //
            scheduleUpdate(); //
        }, 100); //
    });

    navLinks.forEach(link => { //
        link.addEventListener('mouseenter', () => { //
            if (link.classList.contains('expanding-to-fullscreen')) return; //
            hoveredLinkElement = link; //
            scheduleUpdate(); //
        });

        link.addEventListener('mouseleave', () => { //
            if (link.classList.contains('expanding-to-fullscreen')) return; //
            hoveredLinkElement = null; //
            scheduleUpdate(); //
        });

        link.addEventListener('click', function(event) { //
            event.preventDefault(); //
            if (this.classList.contains('expanding-to-fullscreen')) return; //

            const url = this.dataset.href; //
            if (!url) return; //

            hoveredLinkElement = null; //
            body.classList.add('page-is-transitioning'); //

            const rect = this.getBoundingClientRect(); //
            let baseDiameter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-link-size').trim()); //
            if (isNaN(baseDiameter) || baseDiameter <= 0) { //
                baseDiameter = 150; //
            }

            const screenCenterX = window.innerWidth / 2; //
            const screenCenterY = window.innerHeight / 2; //
            const elementCurrentCenterX = rect.left + rect.width / 2; //
            const elementCurrentCenterY = rect.top + rect.height / 2; //

            const translateXToCenter = screenCenterX - elementCurrentCenterX; //
            const translateYToCenter = screenCenterY - elementCurrentCenterY; //

            const diagonal = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)); //
            const targetScale = diagonal / baseDiameter; //

            this.style.setProperty('--translate-to-center-x', `${translateXToCenter.toFixed(2)}px`); //
            this.style.setProperty('--translate-to-center-y', `${translateYToCenter.toFixed(2)}px`); //
            this.style.setProperty('--fullscreen-scale', targetScale.toFixed(3)); //
            
            this.classList.add('expanding-to-fullscreen'); //

            this.addEventListener('animationend', function() { //
                window.location.href = url; //
            }, { once: true }); //
        });
    });

    scheduleUpdate(); //
});