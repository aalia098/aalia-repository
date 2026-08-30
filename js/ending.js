/**
 * ==========================================================================
 * JOSH COMEAU-INSPIRED ENDING & CELEBRATION ENGINE
 * Playful scroll reveal, pop-up mascot moment, and 1-click clipboard actions
 * ==========================================================================
 */

class EndingSceneController {
  constructor() {
    this.steps = document.querySelectorAll('.ending-step');
    this.popCard = document.querySelector('.pop-character-card');
    this.copyButtons = document.querySelectorAll('.copy-action-btn');
    this.toast = document.querySelector('.copy-toast');
    this.hasTriggeredConfetti = false;

    this.init();
  }

  init() {
    this.initScrollObserver();
    this.initCopyActions();
  }

  initScrollObserver() {
    const endingSection = document.getElementById('contact');
    if (!endingSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.revealNarrativeSteps();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(endingSection);
  }

  revealNarrativeSteps() {
    this.steps.forEach((step, idx) => {
      setTimeout(() => {
        step.classList.add('revealed');
      }, idx * 450);
    });

    // Reveal pop-up character card after narrative steps
    setTimeout(() => {
      if (this.popCard) {
        this.popCard.classList.add('pop-active');
        if (!this.hasTriggeredConfetti) {
          this.triggerConfetti();
          this.hasTriggeredConfetti = true;
        }
      }
    }, this.steps.length * 450 + 200);
  }

  initCopyActions() {
    this.copyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy-value');
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showToast(`Copied to clipboard: ${textToCopy} ✦`);
          if (window.bongoCat) {
            window.bongoCat.setState('applause', "Copied! Let's connect! ✨", 3000);
          }
        }).catch(() => {
          this.showToast(`Link: ${textToCopy}`);
        });
      });
    });
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.add('show');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2800);
  }

  triggerConfetti() {
    // Elegant canvas particle celebration
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#d46b84', '#9b72aa', '#db765c', '#f4a6b8', '#c48eb8', '#f5c6aa', '#ffffff'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.75,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1) * 16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    };

    render();
  }
}

window.EndingSceneController = EndingSceneController;
