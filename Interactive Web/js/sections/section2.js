// If the main App object doesn't exist, create it.
var App = window.App || {};

// Create a namespace for this section's logic
App.section2 = {
    hasBeenInitialized: false,

    init: function() {
        if (this.hasBeenInitialized) {
            return;
        }
        this.hasBeenInitialized = true;

        console.log("Section 2 has been initialized.");
        
        // Run the marquee animation when Section 2 is active
        this.initMarquee();
    },

    // Marquee function moved from section3.js
    initMarquee: function() {
    const row1 = document.getElementById('marquee-row-1');
    const row2 = document.getElementById('marquee-row-2');
    if (!row1 || !row2) return;

    // The logic now uses 1/3 of the width because we have 3 sets of images
    const wrapWidth1 = row1.scrollWidth / 3;
    const wrapWidth2 = row2.scrollWidth / 3;

    let lastScrollY = window.scrollY;
    let xPos1 = -wrapWidth1;
    let xPos2 = 0;
    
    // UPDATED: Increased speedFactor for a faster animation
    const speedFactor = 0.5;

    function animateMarquee() {
        let deltaY = window.scrollY - lastScrollY;
        
        if (Math.abs(deltaY) > 100) {
            deltaY = 0;
        }
        
        lastScrollY = window.scrollY;

        xPos1 += deltaY * speedFactor;
        xPos2 -= deltaY * speedFactor;

        // Wraparound logic for bi-directional scroll
        if (xPos1 > 0) { xPos1 -= wrapWidth1; }
        if (xPos1 < -wrapWidth1 * 2) { xPos1 += wrapWidth1; }
        
        if (xPos2 < -wrapWidth2) { xPos2 += wrapWidth2; }
        if (xPos2 > 0) { xPos2 -= wrapWidth2; }

        row1.style.transform = `translateX(${xPos1}px)`;
        row2.style.transform = `translateX(${xPos2}px)`;

        requestAnimationFrame(animateMarquee);
    }

    requestAnimationFrame(animateMarquee);
}
};