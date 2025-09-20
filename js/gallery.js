// --- Gallery Management ---
export class Gallery {
  constructor(galleryEl, prevBtn, nextBtn, dotsEl) {
    this.gallery = galleryEl;
    this.gprev = prevBtn;
    this.gnext = nextBtn;
    this.gdots = dotsEl;
    this.slides = [];
    this.slideIndex = 0;
    this.startX = 0;
    this.endX = 0;
    this.isAnimating = false;
    this.animationTimeout = null;
    this.imageLoadPromises = [];
    this.preloadedImages = new Set();

    // Event listeners
    this.gprev.addEventListener('click', () => !this.isAnimating && this.prevSlide());
    this.gnext.addEventListener('click', () => !this.isAnimating && this.nextSlide());
    
    // Touch swipe with improved handling
    this.gallery.addEventListener('touchstart', e => {
      if (this.isAnimating) return;
      this.startX = e.changedTouches[0].clientX;
      this.startTime = Date.now(); // Track start time for velocity calculation
    });
    
    this.gallery.addEventListener('touchmove', e => {
      if (this.isAnimating) return;
      const currentX = e.changedTouches[0].clientX;
      const dx = currentX - this.startX;
      const slides = this.gallery.querySelectorAll('.slide');
      const currentSlide = slides[this.slideIndex];
      const nextSlide = slides[(this.slideIndex + 1) % slides.length];
      const prevSlide = slides[(this.slideIndex - 1 + slides.length) % slides.length];
      
      // Reset all non-involved slides
      slides.forEach((slide) => {
        if (slide !== currentSlide && slide !== nextSlide && slide !== prevSlide) {
          slide.style.transform = '';
        }
      });
      
      // Calculate swipe percentage
      const swipePercent = (dx / this.gallery.offsetWidth) * 100;
      
      if (dx > 0) { // Swiping right
        prevSlide.style.transform = `translateX(${swipePercent - 100}%)`;
        currentSlide.style.transform = `translateX(${swipePercent}%)`;
        nextSlide.style.transform = `translateX(100%)`;
      } else { // Swiping left
        nextSlide.style.transform = `translateX(${swipePercent + 100}%)`;
        currentSlide.style.transform = `translateX(${swipePercent}%)`;
        prevSlide.style.transform = `translateX(-100%)`;
      }
    });
    
    this.gallery.addEventListener('touchend', e => {
      if (this.isAnimating) return;
      this.endX = e.changedTouches[0].clientX;
      const dx = this.endX - this.startX;
      
      // Calculate swipe velocity
      const duration = Date.now() - this.startTime;
      const velocity = Math.abs(dx) / duration;
      
      if (Math.abs(dx) > 100) {
        dx < 0 ? this.nextSlide() : this.prevSlide();
      } else {
        // Reset positions if swipe wasn't far enough
        const slides = this.gallery.querySelectorAll('.slide');
        slides.forEach(slide => {
          slide.style.transform = '';
          slide.style.transition = 'transform 0.3s ease';
          setTimeout(() => slide.style.transition = '', 300);
        });
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (!this.isAnimating && e.key === 'ArrowLeft') this.prevSlide();
      if (!this.isAnimating && e.key === 'ArrowRight') this.nextSlide();
    });
  }

  preloadImages(currentIndex) {
    // Preload current, next and previous images
    const indicesToPreload = [
      currentIndex,
      (currentIndex + 1) % this.slides.length,
      (currentIndex - 1 + this.slides.length) % this.slides.length
    ];

    indicesToPreload.forEach(index => {
      const slide = this.slides[index];
      if (slide && slide.img && !this.preloadedImages.has(slide.img)) {
        const img = new Image();
        img.src = slide.img;
        this.preloadedImages.add(slide.img);
      }
    });
  }

  buildSlides(arr) {
    console.log('Building slides with:', arr);
    // Clear existing state  
    this.slides = arr;
    this.gallery.querySelectorAll('.slide').forEach(n => n.remove());
    this.gdots.innerHTML = '';
    this.preloadedImages.clear();
    this.isAnimating = false;
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    this.slides.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'slide';
      
      if (s.img) {
        // Create img container for centering
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        
        // Create loading indicator
        const loader = document.createElement('div');
        loader.className = 'loader';
        imgContainer.appendChild(loader);
        
        // Create image element
        const img = document.createElement('img');
        img.src = s.img;
        img.alt = s.caption || '';
        img.style.display = 'none'; // Hide until loaded
        
        // Handle successful load
        img.onload = () => {
          loader.remove();
          img.style.display = ''; // Show image
        };
        
        // Handle load error
        img.onerror = () => {
          loader.remove();
          el.style.background = this.gradientBG(s.h || (i * 60) % 360);
        };
        
        imgContainer.appendChild(img);
        el.appendChild(imgContainer);
      } else {
        el.style.background = this.gradientBG(s.h || (i * 60) % 360);
      }

      if (s.caption) {
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = s.caption;
        el.appendChild(caption);
      }

      if (i === 0) el.classList.add('active');
      this.gallery.appendChild(el);

      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => !this.isAnimating && this.showSlide(i));
      this.gdots.appendChild(dot);
    });
    
    this.updateDots();
    this.updateNavigation();
  }

  showSlide(i) {
    // Clear any existing animation timeout
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    if (!this.slides || this.slides.length === 0 || this.isAnimating) return;
    
    const newIndex = ((i % this.slides.length) + this.slides.length) % this.slides.length;
    if (newIndex === this.slideIndex) return;

    // Preload next and previous images
    this.preloadImages(newIndex);

    this.isAnimating = true;
    const slides = this.gallery.querySelectorAll('.slide');
    const currentSlide = slides[this.slideIndex];
    const nextSlide = slides[newIndex];
    
    if (!currentSlide || !nextSlide) {
      this.isAnimating = false;
      return;
    }

    // Reset all slides and prepare for animation
    slides.forEach(slide => {
      slide.style.transition = '';
      slide.classList.remove('active');
      slide.style.visibility = 'hidden';
      slide.style.transform = '';
    });

    // Prepare current and next slides
    currentSlide.style.visibility = 'visible';
    nextSlide.style.visibility = 'visible';
    
    // Calculate direction for animation
    const totalSlides = this.slides.length;
    const clockwiseDistance = (newIndex - this.slideIndex + totalSlides) % totalSlides;
    const counterclockwiseDistance = (this.slideIndex - newIndex + totalSlides) % totalSlides;
    const direction = clockwiseDistance <= counterclockwiseDistance ? 1 : -1;
    
    // Set initial positions without transitions
    currentSlide.style.transition = 'none';
    nextSlide.style.transition = 'none';
    
    currentSlide.classList.add('active');
    currentSlide.style.transform = 'translateX(0)';
    currentSlide.style.opacity = '1';
    
    if (direction > 0) {
      // Moving right: next slide comes from right
      nextSlide.style.transform = 'translateX(100%)';
    } else {
      // Moving left: next slide comes from left
      nextSlide.style.transform = 'translateX(-100%)';
    }
    nextSlide.style.opacity = '0';
    
    // Force browser reflow
    currentSlide.offsetHeight;
    nextSlide.offsetHeight;
    
    // Start animation
    requestAnimationFrame(() => {
      const duration = '0.6s';
      const easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
      
      // Enable transitions
      currentSlide.style.transition = `transform ${duration} ${easing}, opacity ${duration} ${easing}`;
      nextSlide.style.transition = `transform ${duration} ${easing}, opacity ${duration} ${easing}`;
      
      // Trigger animations
      if (direction > 0) {
        // Moving right: current slide moves left
        currentSlide.style.transform = 'translateX(-100%)';
      } else {
        // Moving left: current slide moves right
        currentSlide.style.transform = 'translateX(100%)';
      }
      currentSlide.style.opacity = '0';
      
      nextSlide.style.transform = 'translateX(0)';
      nextSlide.style.opacity = '1';
      nextSlide.classList.add('active');
      
      // Clean up after animation
      this.animationTimeout = setTimeout(() => {
        try {
          // Reset transitions
          slides.forEach(slide => {
            slide.style.transition = '';
            if (slide !== nextSlide) {
              slide.style.transform = '';
              slide.style.opacity = '0';
              slide.style.visibility = 'hidden';
            }
          });
          
          // Update state
          this.slideIndex = newIndex;
          this.updateDots();
          this.updateNavigation();
        } finally {
          this.isAnimating = false;
          this.animationTimeout = null;
        }
      }, 600); // Match transition duration
    });
  }

  nextSlide() {
    const nextIndex = (this.slideIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.slideIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  updateDots() {
    const dots = this.gdots.querySelectorAll('button');
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === this.slideIndex);
      d.setAttribute('aria-current', idx === this.slideIndex ? 'true' : 'false');
    });
  }

  updateNavigation() {
    // Update navigation button states
    this.gprev.disabled = this.slides.length <= 1;
    this.gnext.disabled = this.slides.length <= 1;
    
    // Update ARIA labels
    this.gprev.setAttribute('aria-label', `Previous slide (${this.slideIndex + 1} of ${this.slides.length})`);
    this.gnext.setAttribute('aria-label', `Next slide (${this.slideIndex + 2} of ${this.slides.length})`);
  }

  gradientBG(h) {
    return `radial-gradient(80% 70% at 65% 20%, 
              hsla(${h},85%,65%,.35), 
              transparent 50%
            ),
            linear-gradient(135deg, 
              hsla(${h},80%,60%,.35), 
              hsla(${(h+60)%360},80%,60%,.2)
            ),
            radial-gradient(50% 50% at 30% 80%, 
              hsla(${(h+30)%360},75%,65%,.25), 
              transparent 50%
            )`;
  }
}