/**
 * ==========================================================================
 * MAIN ORCHESTRATION SCRIPT — AALIA NOMANI PORTFOLIO
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Greeting Preloader
  const greetingSeq = new window.GreetingSequenceController();

  // 2. Initialize Bongo Cat Companion
  window.bongoCat = new window.BongoCatController();

  // 3. Initialize 3D Project Tilt Engine
  const project3D = new window.Project3DEngine();

  // 4. Initialize Ending Scene Controller
  const endingScene = new window.EndingSceneController();

  // 5. Initialize Navigation Scrollspy
  initScrollspy();

  // 6. Initialize Theme Accent Switcher
  initThemeSwitcher();

  // 7. Initialize Audio Sound FX Toggle
  initSoundToggle();
});

/* --------------------------------------------------------------------------
   SCROLLSPY ACTIVE NAVIGATION
   -------------------------------------------------------------------------- */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   THEME ACCENT SWITCHER
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (!themeBtn) return;

  const themes = ['default', 'lilac', 'peach'];
  let currentThemeIndex = 0;

  themeBtn.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const selectedTheme = themes[currentThemeIndex];

    if (selectedTheme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', selectedTheme);
    }

    if (window.bongoCat) {
      window.bongoCat.setState('curious', `Theme: ${selectedTheme.toUpperCase()} 🎨`, 2000);
    }
  });
}

/* --------------------------------------------------------------------------
   SOUND TOGGLE
   -------------------------------------------------------------------------- */
function initSoundToggle() {
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (!soundBtn) return;

  let isAudioActive = false;

  soundBtn.addEventListener('click', () => {
    isAudioActive = !isAudioActive;
    soundBtn.innerHTML = isAudioActive ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-label', isAudioActive ? 'Mute sound' : 'Enable sound');

    if (window.bongoCat) {
      window.bongoCat.toggleSound(isAudioActive);
    }
  });
}
