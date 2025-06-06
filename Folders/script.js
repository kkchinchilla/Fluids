document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('.folder');
    const contentContainer = document.getElementById('content');
    const body = document.body;
    const logo = document.querySelector('.logo');

    // Get the initial positions of the folders for animation
    const initialPositions = Array.from(folders).map(folder => {
        return { left: folder.offsetLeft, width: folder.offsetWidth };
    });

    folders.forEach((folder, index) => {
        folder.addEventListener('click', (e) => {
            e.preventDefault();

            // Prevent re-running the animation if a folder is already active
            if (body.classList.contains('open') && folder.classList.contains('active')) {
                return;
            }

            // If already open, clear existing content immediately upon new click
            if (body.classList.contains('open')) {
                contentContainer.innerHTML = '';
            }

            // Set fixed positions before adding the 'open' class to prevent jumping
            if (!body.classList.contains('open')) {
                folders.forEach((f, i) => {
                    f.style.left = `${initialPositions[i].left}px`;
                    f.style.width = `${initialPositions[i].width}px`;
                });
            }

            // Add 'open' class to trigger CSS transitions
            body.classList.add('open');
            
            // Handle which folders move up and which move down
            folders.forEach((f, i) => {
                f.classList.remove('active', 'move-up', 'move-down');
                if (i <= index) {
                    f.classList.add('move-up');
                } else {
                    f.classList.add('move-down');
                }
            });
            
            folder.classList.add('active');

            const url = folder.getAttribute('href');
            
            // Delay fetching content to match the 0.5s animation
            setTimeout(() => {
                fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error('Content not found.');
                        return response.text();
                    })
                    .then(html => {
                        contentContainer.innerHTML = html;
                    })
                    .catch(error => {
                        contentContainer.innerHTML = `<p style="text-align:center;">${error.message}</p>`;
                        console.error('Error fetching content:', error);
                    });
            }, 300); // 500ms = 0.5s delay
        });
    });

    // Add a way to return to the main page by clicking the logo
    logo.addEventListener('click', (e) => {
        if(body.classList.contains('open')) {
             e.preventDefault();
             body.classList.remove('open');
             contentContainer.innerHTML = '';
             folders.forEach(f => {
                f.classList.remove('active', 'move-up', 'move-down');
                // Reset inline styles used for positioning
                f.style.left = '';
                f.style.width = '';
             });
        }
    });
});