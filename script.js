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
      carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
      });
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