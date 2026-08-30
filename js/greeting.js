/**
 * ==========================================================================
 * GREETING & PRELOADER CONTROLLER (Dennis Snellenberg Reference)
 * Unexpected, typographic, animated, memorable & elegant opening sequence
 * ==========================================================================
 */

class GreetingSequenceController {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.greetingContainer = document.querySelector('.greeting-wrapper');
    this.progressBar = document.querySelector('.preloader-progress-bar');
    
    this.greetings = [
      { text: "Hello", icon: "✦" },
      { text: "Hey", icon: "✨" },
      { text: "Hii", icon: "🌸" },
      { text: "Namaste", icon: "🙏" },
      { text: "oh, you're here.", icon: "🐱" }
    ];

    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (!this.preloader || !this.greetingContainer) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.completeImmediately();
      return;
    }

    this.showNextGreeting();
  }

  showNextGreeting() {
    if (this.currentIndex >= this.greetings.length) {
      this.finishSequence();
      return;
    }

    const currentItem = this.greetings[this.currentIndex];
    const progress = Math.min(100, Math.round(((this.currentIndex + 1) / this.greetings.length) * 100));
    
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }

    // Create greeting element
    const greetingEl = document.createElement('h1');
    greetingEl.className = 'greeting-text';
    greetingEl.innerHTML = `${currentItem.text} <span class="greeting-sparkle">${currentItem.icon}</span>`;
    
    this.greetingContainer.innerHTML = '';
    this.greetingContainer.appendChild(greetingEl);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      greetingEl.classList.add('active');
    });

    // Determine display duration: last one lingers slightly longer
    const duration = this.currentIndex === this.greetings.length - 1 ? 950 : 550;

    setTimeout(() => {
      greetingEl.classList.remove('active');
      greetingEl.classList.add('exit');
      
      this.currentIndex++;
      setTimeout(() => {
        this.showNextGreeting();
      }, 150);
    }, duration);
  }

  finishSequence() {
    if (!this.preloader) return;

    // Smooth curtain lift
    this.preloader.classList.add('loaded');
    document.body.classList.add('app-loaded');

    // Trigger hero entrance cascade
    const heroElements = document.querySelectorAll('.hero-section [data-reveal]');
    heroElements.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, 150 * (idx + 1));
    });
  }

  completeImmediately() {
    if (this.preloader) {
      this.preloader.classList.add('loaded');
      this.preloader.style.display = 'none';
    }
    document.body.classList.add('app-loaded');
  }
}

window.GreetingSequenceController = GreetingSequenceController;
