document.addEventListener('DOMContentLoaded', () => {
  // --- Hero Carousel Logic ---
  const carouselSlides = document.querySelectorAll('.carousel-container .carousel-slide');
  let currentSlide = 0;
  const intervalTime = 4000; // Time between slides in milliseconds (e.g., 5 seconds)
  let carouselInterval;

  function showSlide(index) {
    carouselSlides.forEach((slide) => {
      slide.classList.remove('active');
    });
    if (carouselSlides[index]) { // Check if the slide exists
        carouselSlides[index].classList.add('active');
    } else {
        // Fallback or error handling if index is out of bounds
        console.error("Carousel slide index out of bounds:", index);
        currentSlide = 0; // Reset to first slide
        if (carouselSlides[0]) carouselSlides[0].classList.add('active');
    }
  }

  function nextSlide() {
    if (carouselSlides.length === 0) return; // Do nothing if no slides
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    showSlide(currentSlide);
  }

  function startCarousel() {
    if (carouselSlides.length === 0) return;
    // Clear existing interval to prevent multiple timers if called again for any reason
    clearInterval(carouselInterval); 
    carouselInterval = setInterval(nextSlide, intervalTime);
  }

  // Initialize carousel
  if (carouselSlides.length > 0) {
    showSlide(currentSlide); // Show the first slide immediately
    startCarousel();

    // Optional: Pause on hover over the carousel container
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      
      carouselContainer.addEventListener('mouseleave', () => {
        startCarousel(); // Resume autoplay
      });
    }
  }
  // --- End Hero Carousel Logic ---


  // --- Dropdown Menu Logic (existing) ---
  const dropdownLiElements = document.querySelectorAll('.nav-links > li.dropdown');
  const navLinksContainer = document.querySelector('.nav-links'); 

  dropdownLiElements.forEach(dropdownLi => {
    const mainLink = dropdownLi.querySelector('a'); 
    const menu = dropdownLi.querySelector('.dropdown-menu');
    let hideTimeoutId = null; 

    if (menu) {
      // Desktop Hover Logic
      const showMenuDesktop = () => {
        if (hideTimeoutId) {
          clearTimeout(hideTimeoutId);
          hideTimeoutId = null;
        }
        if (window.innerWidth > 780) {
          menu.style.display = 'block';
        }
      };

      const startHideTimerDesktop = () => {
        if (hideTimeoutId) {
          clearTimeout(hideTimeoutId);
        }
        if (window.innerWidth > 780) {
          hideTimeoutId = setTimeout(() => {
            menu.style.display = 'none';
          }, 250); 
        }
      };

      dropdownLi.addEventListener('mouseenter', showMenuDesktop);
      dropdownLi.addEventListener('mouseleave', startHideTimerDesktop);
      menu.addEventListener('mouseenter', showMenuDesktop); 
      menu.addEventListener('mouseleave', startHideTimerDesktop);

      // Mobile Click Logic
      if (mainLink) {
        mainLink.addEventListener('click', function(event) {
          if (window.innerWidth <= 780 && navLinksContainer && navLinksContainer.classList.contains('active')) {
            event.preventDefault(); 

            const isMenuOpen = menu.style.display === 'block';
            
            dropdownLiElements.forEach(otherDropdownLi => {
              const otherMenu = otherDropdownLi.querySelector('.dropdown-menu');
              if (otherMenu && otherMenu !== menu) { 
                otherMenu.style.display = 'none';
              }
            });
            menu.style.display = isMenuOpen ? 'none' : 'block';
          }
        });
      }
    }
  });
  // --- End Dropdown Menu Logic ---

  // Scroll to next section from hero chevron
  const heroChevron = document.querySelector('.hero-chevron');
  if (heroChevron) {
    heroChevron.addEventListener('click', scrollToNextSection);
  }
  
  // Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (scrollTopBtn) { 
        scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
      }
    });
  }
});

// Function to scroll to the next section
function scrollToNextSection() {
  const heroSection = document.querySelector('.hero');
  let nextSectionElement = document.querySelector('.showroom-remodel'); 

  if (heroSection) {
      let sibling = heroSection.nextElementSibling;
      while(sibling) {
          if (sibling.tagName === 'SECTION') {
              nextSectionElement = sibling;
              break;
          }
          sibling = sibling.nextElementSibling;
      }
  }
  
  if (nextSectionElement) {
    nextSectionElement.scrollIntoView({ behavior: 'smooth' });
  }
}

// Function to scroll to top (globally available for HTML onclick)
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to toggle mobile menu (globally available for HTML onclick)
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
    
    if (!navLinks.classList.contains('active')) {
        const allDropdownMenus = document.querySelectorAll('.nav-links .dropdown-menu');
        allDropdownMenus.forEach(menu => {
            menu.style.display = 'none';
        });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ... (your existing script.js code like hero carousel, dropdowns, etc.)

  // --- News Carousel Logic ---
  const newsCarousel = document.querySelector('.news-carousel-section');
  if (newsCarousel) {
    const track = newsCarousel.querySelector('.news-carousel-track');
    const slides = Array.from(track.children);
    const nextButton = newsCarousel.querySelector('.news-carousel-nav.next');
    const prevButton = newsCarousel.querySelector('.news-carousel-nav.prev');
    const container = newsCarousel.querySelector('.news-carousel-container');
    const indicatorsContainer = newsCarousel.querySelector('.news-carousel-indicators');

    let cardWidth = 0;
    let cardsInView = 0;
    let currentIndex = 0;
    let gap = 0;
    let totalSlides = slides.length;

    // Variables for touch dragging
    let isDragging = false;
    let startX;
    let initialTrackTranslateX; // To store the track's translateX at the start of a drag

    function calculateDimensions() {
      if (slides.length === 0) return;
      
      const trackStyle = getComputedStyle(track);
      gap = parseFloat(trackStyle.gap) || 30; 

      cardWidth = slides[0].offsetWidth; // Includes padding & border, not margin
      
      if (window.innerWidth < 700) {
          cardsInView = 1;
      } else if (window.innerWidth < 860) {
          cardsInView = 2;
      } else {
          cardsInView = 3;
      }
      cardsInView = Math.max(1, Math.min(cardsInView, totalSlides));
    }

    // Helper function to get the current numerical translateX value
    function getCurrentTranslateX() {
        const style = window.getComputedStyle(track);
        const matrix = new DOMMatrixReadOnly(style.transform); // Use DOMMatrixReadOnly
        return matrix.m41; // This is the translateX value
    }

    function updateCarouselPosition() {
      const amountToTranslate = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${amountToTranslate}px)`;
    }

    function updateNavButtons() {
      if (!prevButton || !nextButton) return;
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = totalSlides === 0 || currentIndex >= totalSlides - cardsInView;
    }

    function setupIndicators() {
      if (!indicatorsContainer) return;
      indicatorsContainer.innerHTML = ''; 
      const numIndicators = totalSlides > 0 ? Math.max(1, totalSlides - cardsInView + 1) : 0;

      if (numIndicators <= 1 && totalSlides > 0) {
          indicatorsContainer.style.display = 'none';
          return;
      }
      indicatorsContainer.style.display = 'flex';

      for (let i = 0; i < numIndicators; i++) {
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        dot.setAttribute('aria-label', `Go to news group ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarouselPosition();
          updateNavButtons();
          updateActiveIndicator();
        });
        indicatorsContainer.appendChild(dot);
      }
    }

    function updateActiveIndicator() {
      if (!indicatorsContainer) return;
      const dots = indicatorsContainer.querySelectorAll('.indicator-dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function handleResize() {
      const oldCardsInView = cardsInView;
      calculateDimensions();
      
      if (currentIndex > totalSlides - cardsInView) {
          currentIndex = Math.max(0, totalSlides - cardsInView);
      }

      if (oldCardsInView !== cardsInView || indicatorsContainer.children.length === 0 || 
          indicatorsContainer.children.length !== (totalSlides > 0 ? Math.max(1, totalSlides - cardsInView + 1) : 0) ) {
          setupIndicators();
      }
      
      updateCarouselPosition();
      updateNavButtons();
      updateActiveIndicator();
    }

    if (slides.length > 0) {
      // Click listeners for chevrons
      nextButton.addEventListener('click', () => {
        if (currentIndex < totalSlides - cardsInView) {
          currentIndex++;
          updateCarouselPosition();
          updateNavButtons();
          updateActiveIndicator();
        }
      });

      prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarouselPosition();
          updateNavButtons();
          updateActiveIndicator();
        }
      });
      
      // --- NEW: Touch Event Listeners for Dragging ---
      track.addEventListener('touchstart', (e) => {
        // Enable dragging only on smaller screens (where chevrons are hidden)
        // and if there are actually more slides than can be viewed at once.
        if (window.innerWidth >= 780 || totalSlides <= cardsInView) {
          isDragging = false; // Ensure isDragging is false if conditions not met
          return;
        }
        isDragging = true;
        startX = e.touches[0].pageX;
        initialTrackTranslateX = getCurrentTranslateX(); // Get current numerical translateX
        track.style.transition = 'none'; // Disable CSS transition during drag for direct feedback
      }, { passive: true }); // passive: true for better scroll performance if not calling preventDefault

      track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // If you want to prevent vertical page scroll while dragging horizontally:
        // You might need more complex logic to detect swipe angle first and set passive: false.
        // For this version, we'll keep it simple.
        const currentX = e.touches[0].pageX;
        const deltaX = currentX - startX;
        track.style.transform = `translateX(${initialTrackTranslateX + deltaX}px)`;
      });

      track.addEventListener('touchend', () => {
        if (!isDragging) return; // Only proceed if a drag was initiated under valid conditions
        isDragging = false;
        track.style.transition = 'transform 0.5s ease-in-out'; // Re-enable CSS transition for snapping

        const finalTranslateX = getCurrentTranslateX();
        const draggedDistance = finalTranslateX - initialTrackTranslateX;
        const cardWidthWithGap = cardWidth + gap;
        const dragThreshold = 20; // Minimum drag in pixels to be considered more than a tap/tiny move

        if (Math.abs(draggedDistance) < dragThreshold) {
            // If drag was very small, snap back to the current index's position
            updateCarouselPosition(); // Uses the unchanged currentIndex
            return;
        }

        // Calculate the ideal target index based on the final dragged position
        // Target index is how many full cardWidthsWithGap the track has moved from its 0 position
        let targetIndex = Math.round(Math.abs(finalTranslateX) / cardWidthWithGap);
        
        // Clamp the targetIndex to be within valid bounds
        currentIndex = Math.max(0, Math.min(targetIndex, totalSlides - cardsInView));
        
        updateCarouselPosition(); // Snap to the new currentIndex
        updateNavButtons();
        updateActiveIndicator();
      });
      // --- End Touch Event Listeners ---

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial setup
    } else {
        if(nextButton) nextButton.style.display = 'none';
        if(prevButton) prevButton.style.display = 'none';
        if(indicatorsContainer) indicatorsContainer.style.display = 'none';
    }
  }
  // --- End News Carousel Logic ---
});

// Number counting animation for Stats Section
document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-section');

  if (statsSection) {
    let animationHasRun = false; // Flag to ensure animation runs only once

    const animateValue = (element, start, end, duration) => {
      let startTime = null;
      const suffixText = element.dataset.suffix || ""; // Get the suffix text (e.g., "+")

      // Clear any existing suffix span and set initial text content for the number
      const existingSuffix = element.querySelector('.stat-suffix');
      if (existingSuffix) {
        existingSuffix.remove();
      }
      element.textContent = start; // Initialize with the start number

      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // Update only the number part. We'll ensure element.textContent holds the number.
        // If a suffix was there from a previous run (though unlikely with current logic),
        // setting textContent directly here will clear it before appending a new one.
        element.textContent = currentValue; 

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          element.textContent = end; // Set final number
          if (suffixText) {
            const suffixSpan = document.createElement('span');
            suffixSpan.className = 'stat-suffix';
            suffixSpan.textContent = suffixText;
            element.appendChild(suffixSpan); // Append the styled suffix span
          }
        }
      };
      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Check if the element is intersecting and if the animation hasn't run yet
        if (entry.isIntersecting && !animationHasRun) {
          const statNumbers = statsSection.querySelectorAll('.stat-number');
          statNumbers.forEach(numberElement => {
            const target = parseInt(numberElement.dataset.target, 10);
            animateValue(numberElement, 0, target, 700); // 3000ms = 3 seconds
          });
          animationHasRun = true; // Set flag to true after animation starts
          observer.unobserve(statsSection); // Optional: stop observing after animation
        }
      });
    }, {
      threshold: 0.3 // Trigger when 30% of the element is visible
    });

    observer.observe(statsSection);
  }
});





