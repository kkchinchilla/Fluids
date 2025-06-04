document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Card Wave Effect Setup ---
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            card.cardOrderIndex = index;
            card.currentTranslateY = 0;
        });
    }

    // --- Shared Mouse Position Tracking ---
    window.currentMouseX = window.innerWidth / 2;
    window.currentMouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (event) => {
        window.currentMouseX = event.clientX;
        window.currentMouseY = event.clientY;
    }, { passive: true });

    // --- Custom Ripple Cursor Logic ---
    const customCursorElement = document.createElement('div');
    customCursorElement.id = 'custom-cursor';
    document.body.appendChild(customCursorElement);

    function updateCustomCursorVisuals() {
        if (customCursorElement) {
            customCursorElement.style.left = `${window.currentMouseX}px`;
            customCursorElement.style.top = `${window.currentMouseY}px`;
        }
        requestAnimationFrame(updateCustomCursorVisuals);
    }
    if (document.getElementById('custom-cursor')) {
        updateCustomCursorVisuals();
    }

    // --- Card Wave Animation Logic ---
    const WAVE_AMPLITUDE = 15;
    const WAVE_SPATIAL_FREQUENCY = 0.6;
    const MOUSE_INFLUENCE_FREQUENCY = 0.01;
    const LERP_FACTOR = 0.1;

    function animateCardWave() {
        if (cards.length > 0) {
            cards.forEach(card => {
                // MODIFIED LINE: Changed '+' to '-' for window.currentMouseX
                const phase = (card.cardOrderIndex * WAVE_SPATIAL_FREQUENCY) - (window.currentMouseX * MOUSE_INFLUENCE_FREQUENCY);
                const targetTranslateY = WAVE_AMPLITUDE * Math.sin(phase);
                card.currentTranslateY += (targetTranslateY - card.currentTranslateY) * LERP_FACTOR;
                card.style.setProperty('--card-translate-y', `${card.currentTranslateY.toFixed(2)}px`);
            });
        }
        requestAnimationFrame(animateCardWave);
    }
    animateCardWave();

    // --- Typewriter Effect for <p> elements ---
    const paragraphsToType = document.querySelectorAll('p'); // MODIFIED: Target all <p> tags
    const typewriterSpeed = 10; // Milliseconds between each character (slightly faster for potentially more text)
    const initialDelayBeforeTyping = 100; // Milliseconds to wait before starting the first paragraph
    const staggerDelayBetweenParagraphs = 200; // Milliseconds delay between the start of each subsequent paragraph's typing

    if (paragraphsToType.length > 0) {
        // console.log(`${paragraphsToType.length} <p> element(s) found for typewriter effect.`);
        paragraphsToType.forEach((pElement, index) => {
            const originalText = pElement.textContent.trim();
            if (originalText.length === 0) return; // Skip empty paragraphs

            pElement.textContent = ''; // Clear the text content initially

            const startTypingDelay = initialDelayBeforeTyping + (index * staggerDelayBetweenParagraphs);

            setTimeout(() => {
                let charIndex = 0;
                const typingInterval = setInterval(() => {
                    if (charIndex < originalText.length) {
                        pElement.textContent += originalText.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typingInterval);
                    }
                }, typewriterSpeed);
            }, startTypingDelay);
        });
    } else {
        // console.warn("No <p> elements found for the typewriter effect.");
    }
    // --- End of Typewriter Effect ---
});