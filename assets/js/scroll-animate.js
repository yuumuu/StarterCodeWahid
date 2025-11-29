// Lightweight scroll animation helper using IntersectionObserver
// Usage: add `data-animate="fade-up"` (or other variants) to elements.
// Optional: `data-once="false"` to allow repeated animations when element re-enters viewport.

(function () {
  const defaultOptions = { threshold: 0.12 };
  let observer = null;

  function onIntersect(entries, obs) {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add("in-view");
        if (el.dataset.once !== "false") obs.unobserve(el);
      }
    });
  }

  function initObserver() {
    if (!("IntersectionObserver" in window)) return; // old browsers fallback: no animations

    // Disconnect old observer if it exists
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(onIntersect, defaultOptions);

    document.querySelectorAll("[data-animate]").forEach((el) => {
      const name = el.dataset.animate || "fade-up";
      // Only add classes if not already present (avoid re-adding on morph)
      if (!el.classList.contains("animate-init")) {
        el.classList.add("animate-init", `animate-${name}`);
      }
      observer.observe(el);
    });
  }

  // Expose reinit function for use after routing/morph
  window.ScrollObserver = {
    reinit: initObserver,
  };

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", initObserver);
})();
