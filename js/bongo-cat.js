/**
 * ==========================================================================
 * BONGO CAT INTERACTIVE REACTION SYSTEM
 * Highly polished vector SVG animated companion with emotive state machine
 * ==========================================================================
 */

class BongoCatController {
  constructor() {
    this.container = document.querySelector('.bongo-cat-container');
    this.stage = document.querySelector('.bongo-cat-stage');
    this.speechBubble = document.querySelector('.bongo-speech-bubble');
    this.svg = document.querySelector('.bongo-cat-svg');
    this.leftPaw = document.querySelector('.paw-left');
    this.rightPaw = document.querySelector('.paw-right');
    this.leftPupil = document.querySelector('.pupil-left');
    this.rightPupil = document.querySelector('.pupil-right');
    this.mouth = document.querySelector('.cat-mouth');
    
    this.currentState = 'calm';
    this.speechTimeout = null;
    this.isMuted = true; // audio starts muted for pleasant UX
    this.audioCtx = null;
    
    this.quotes = {
      calm: ["( •̀ ω •́ ) Ready to code", "Aalia's portfolio ✨", "Scroll down to explore!"],
      curious: ["Ooh, what's over there?", "Inspecting the code...", "( ﾟдﾟ) Interesting!"],
      excited: ["LET'S GO! 🚀", "Frontend magic happening!", "Bongo drum beats intensifies!"],
      surprised: ["Whoa! You clicked that! ✦", "(⊙_⊙) Impressive!", "Hello there!"],
      applause: ["(≧▽≦) Awesome work!", "10/10 Engineering!", "Clap clap clap!"],
      confused: ["(・_・?) Searching for bugs...", "404: No bugs found!"],
      deadpan: ["( -_・) Solid CS fundamentals only.", "Clean architecture."],
      laughing: ["( > ‿ < ) Hehehe!"]
    };

    this.init();
  }

  init() {
    if (!this.stage) return;

    // Mouse movement eye-tracking
    window.addEventListener('mousemove', (e) => this.trackEyes(e), { passive: true });

    // Interactive clicking on mascot
    this.stage.addEventListener('click', () => {
      this.playSynthTap();
      this.cyclePlayfulReaction();
    });

    // Hook to interactive buttons across the site
    this.attachButtonTriggers();

    // Initial greeting bubble
    setTimeout(() => {
      this.say("Hi! I'm Aalia's Bongo companion 🐱", 3500);
    }, 2800);
  }

  trackEyes(e) {
    if (!this.leftPupil || !this.rightPupil || this.currentState === 'surprised' || this.currentState === 'laughing') return;
    
    const rect = this.stage.getBoundingClientRect();
    const catCenterX = rect.left + rect.width / 2;
    const catCenterY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - catCenterX) / window.innerWidth;
    const deltaY = (e.clientY - catCenterY) / window.innerHeight;
    
    const maxOffset = 3.5;
    const moveX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 12));
    const moveY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * 12));
    
    this.leftPupil.setAttribute('transform', `translate(${moveX}, ${moveY})`);
    this.rightPupil.setAttribute('transform', `translate(${moveX}, ${moveY})`);
  }

  setState(state, customMessage = null, duration = 3000) {
    if (this.currentState === state && !customMessage) return;
    this.currentState = state;

    if (this.stage) {
      this.stage.className = `bongo-cat-stage cat-${state}`;
    }

    // Adjust mouth & facial expressions
    if (this.mouth) {
      if (state === 'surprised') {
        this.mouth.setAttribute('d', 'M 45 48 A 4 4 0 1 0 55 48 A 4 4 0 1 0 45 48');
      } else if (state === 'excited' || state === 'applause' || state === 'laughing') {
        this.mouth.setAttribute('d', 'M 42 45 Q 50 54 58 45');
      } else if (state === 'deadpan') {
        this.mouth.setAttribute('d', 'M 44 48 L 56 48');
      } else {
        this.mouth.setAttribute('d', 'M 43 45 Q 50 51 57 45');
      }
    }

    // Display speech bubble message
    const message = customMessage || this.getRandomQuote(state);
    if (message) {
      this.say(message, duration);
    }

    // Return to calm state automatically if not persistent
    if (state !== 'calm') {
      clearTimeout(this.resetStateTimeout);
      this.resetStateTimeout = setTimeout(() => {
        this.setState('calm');
      }, duration);
    }
  }

  getRandomQuote(state) {
    const list = this.quotes[state];
    if (!list || list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  say(text, duration = 3000) {
    if (!this.speechBubble) return;
    
    this.speechBubble.textContent = text;
    this.speechBubble.classList.add('visible');
    
    clearTimeout(this.speechTimeout);
    this.speechTimeout = setTimeout(() => {
      this.speechBubble.classList.remove('visible');
    }, duration);
  }

  cyclePlayfulReaction() {
    const states = ['excited', 'surprised', 'applause', 'laughing', 'curious'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    this.setState(randomState, null, 2500);
  }

  attachButtonTriggers() {
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .skill-pill, .contact-card, .project-viewport-wrapper');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.setState('excited', "Ooh! Check this out! 🐾", 1800);
      });
      
      el.addEventListener('click', () => {
        this.setState('applause', "Nice click! (≧▽s≦)", 2000);
      });
    });
  }

  playSynthTap() {
    if (this.isMuted) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420 + Math.random() * 80, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (err) {
      // AudioContext unavailable or restricted
    }
  }

  toggleSound(enabled) {
    this.isMuted = !enabled;
    if (!this.isMuted) {
      this.playSynthTap();
      this.say("Sound Effects Activated! 🎵", 2000);
    } else {
      this.say("Sound Muted 🤫", 2000);
    }
  }
}

window.BongoCatController = BongoCatController;
