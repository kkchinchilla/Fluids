// If the main App object doesn't exist, create it.
var App = window.App || {};

// Create a namespace for this section's logic
App.section4 = {
    hasBeenInitialized: false,

    init: function() {
        if (this.hasBeenInitialized) {
            return;
        }
        this.hasBeenInitialized = true;

        console.log("Section 4 has been initialized.");
        // No custom JS needed for this section's animation
    }
};