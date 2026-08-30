/**
 * ==========================================================================
 * 3D INTERACTIVE PROJECT PERSPECTIVE & TILT ENGINE
 * Hardware-accelerated perspective tilt with dynamic specular reflections
 * ==========================================================================
 */

class Project3DEngine {
  constructor() {
    this.viewports = document.querySelectorAll('.project-viewport-wrapper');
    this.init();
  }

  init() {
    if (!this.viewports || this.viewports.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.viewports.forEach(card => {
      this.attachTilt(card);
    });
  }

  attachTilt(card) {
    let bounds;

    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      document.addEventListener('mousemove', onMouseMove);
    };

    const onMouseMove = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      
      const percentX = (mouseX - centerX) / centerX;
      const percentY = (mouseY - centerY) / centerY;
      
      // Controlled max rotation for sophisticated feel
      const maxRotateX = 8;
      const maxRotateY = 10;
      
      const rotateX = -percentY * maxRotateX;
      const rotateY = percentX * maxRotateY;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const onMouseLeave = () => {
      document.removeEventListener('mousemove', onMouseMove);
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
  }
}

window.Project3DEngine = Project3DEngine;
