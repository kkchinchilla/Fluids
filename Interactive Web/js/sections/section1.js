// If the main App object doesn't exist, create it.
var App = window.App || {};

// Create a namespace for this section's logic
App.section1 = {
    hasBeenInitialized: false,

    // This is the main init function that gets called
    init: function() {
        if (this.hasBeenInitialized) {
            return;
        }
        this.hasBeenInitialized = true;

        console.log("Section 1 is active. Initializing all effects...");

        // Initialize both effects
        this.initMouseMoveEffect();
        this.initScrollDrawAnimation();
    },

    // A dedicated function for the mousemove effect
    initMouseMoveEffect: function() {
        const section1 = document.getElementById('section1');
        if (!section1) return;

        section1.addEventListener('mousemove', (e) => {
            // You can add any cursor or mouse-tracking effects here.
            // This console.log confirms it's working.
            // console.log('Mouse position in Section 1:', e.clientX, e.clientY);
        });

        console.log('✓ Mousemove effect initialized for Section 1.');
    },

    // A dedicated function for the SVG animation
    initScrollDrawAnimation: function() {
    const svgContainer = document.querySelector('.scroll-draw-container');
    const paths = document.querySelectorAll('#scroll-arrow-svg path');
    const section1 = document.getElementById('section1');

    if (!paths.length || !section1) {
        return; 
    }

    const pathData = [];
    paths.forEach(path => {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        pathData.push({ element: path, length: pathLength });
    });
    
    function onScroll() {
        if (window.scrollY > 50) {
            svgContainer.classList.add('is-visible');
        } else {
            svgContainer.classList.remove('is-visible');
        }
        
        const { top } = section1.getBoundingClientRect();
        const scrollableHeightOfSection = section1.offsetHeight;

        // UPDATED: The animation progress calculation is now multiplied by a speed factor.
        // A factor of 1.7 means the animation will finish when you've scrolled ~59%
        // of the way through the section (1 / 1.7 ≈ 0.59), leaving plenty of time to see it.
        let progress = (-top / scrollableHeightOfSection) * 0.8;
        
        progress = Math.max(0, Math.min(1, progress));

        pathData.forEach(data => {
            const { element, length } = data;
            const drawLength = length * progress;
            element.style.strokeDashoffset = length - drawLength;
        });
    }

        window.addEventListener('scroll', onScroll, { passive: true });
        console.log('✓ Scroll-draw SVG animation initialized for Section 1.');
    }
};