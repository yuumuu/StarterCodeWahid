// Lightweight Scroll Animation Trigger
// Uses IntersectionObserver to add 'aos-animate' class when elements enter viewport
// Works with CSS transitions for smooth animations

(function () {
  'use strict';

  // Configuration
  const config = {
    threshold: 0.15,        // Trigger when 15% of element is visible
    rootMargin: '0px 0px -10% 0px'  // Trigger slightly before element fully enters
  };

  let observer = null;
  const DEBUG = false; // Set to true for debugging

  // Callback when element enters/exits viewport
  function onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animate class when element enters viewport
        entry.target.classList.add('aos-animate');
        if (DEBUG) console.log('AOS: Animating element', entry.target);
      } else {
        // Remove animate class when element leaves viewport (for repeat animation)
        // Only keep animation if data-aos-once="true"
        const once = entry.target.dataset.aosOnce;
        if (once !== 'true') {
          entry.target.classList.remove('aos-animate');
          if (DEBUG) console.log('AOS: Removing animation from element', entry.target);
        }
      }
    });
  }

  // Initialize observer
  function init() {
    if (DEBUG) console.log('AOS: Initializing...');
    
    // Check browser support
    if (!('IntersectionObserver' in window)) {
      console.warn('AOS: IntersectionObserver not supported, showing all elements');
      // Fallback: show all elements immediately
      document.querySelectorAll('[class*="aos-"]').forEach(el => {
        el.classList.add('aos-animate');
      });
      return;
    }

    // Disconnect existing observer
    if (observer) {
      observer.disconnect();
    }

    // Create new observer
    observer = new IntersectionObserver(onIntersect, config);

    // Observe all elements with aos- classes
    const elements = document.querySelectorAll('[class*="aos-"]');
    if (DEBUG) console.log('AOS: Found', elements.length, 'elements to animate');
    
    elements.forEach(el => {
      observer.observe(el);
      if (DEBUG) console.log('AOS: Observing', el);
    });
  }

  // Expose API
  window.AOS = {
    init: init,
    refresh: init  // Alias for compatibility
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init after page transitions (for SPA)
  window.addEventListener('popstate', () => {
    if (DEBUG) console.log('AOS: Popstate detected, re-initializing...');
    setTimeout(init, 100);
  });

  // Listen for custom route change event (if framework emits it)
  window.addEventListener('route-changed', () => {
    if (DEBUG) console.log('AOS: Route changed, re-initializing...');
    setTimeout(init, 100);
  });

  // Also try to hook into App (Framework alias) if available
  if (typeof window.App !== 'undefined') {
    const originalRender = window.App.render;
    if (originalRender) {
      window.App.render = function(...args) {
        const result = originalRender.apply(this, args);
        setTimeout(() => {
          if (DEBUG) console.log('AOS: App render detected, re-initializing...');
          init();
        }, 150);
        return result;
      };
    }
  }

  if (DEBUG) console.log('AOS: Script loaded');

})();
