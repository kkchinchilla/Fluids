document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth <= 780;

    // --- Button Click Animation ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // --- Desktop-only Animations ---
    if (!isMobile) {
        const navItems = document.querySelectorAll('.nav-node');

        // The animation is now handled by CSS.
        // All JavaScript needs to do is set the staggered delay.
        navItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.4}s`;
        });
    }
});
