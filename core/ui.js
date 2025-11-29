// Core UI utilities for StarterCode (skeleton loader, simple cache, connection helpers)
// This file contains framework-level UI helpers that should be available to all pages.
window.CoreUI = (function () {
  // --- Skeleton Loader ---
  const Skeleton = {
    text(lines = 1) {
      let html = "";
      for (let i = 0; i < lines; i++) {
        html += `<div class="skeleton skeleton-text" style="width: ${
          80 + Math.random() * 20
        }%;"></div>`;
      }
      return html;
    },
    avatar() {
      return `<div class="skeleton skeleton-avatar"></div>`;
    },
    grid(count = 3, columns = 3) {
      let html = `<div class="grid grid-cols-1 md:grid-cols-${columns} gap-6">`;
      for (let i = 0; i < count; i++) {
        html += `<div class="bg-white p-6 rounded-lg">${this.avatar()}<div class="mt-4">${this.text(
          2
        )}</div></div>`;
      }
      html += `</div>`;
      return html;
    },
  };

  // --- Simple Cache Manager ---
  const Cache = {
    set(key, value, ttlMinutes = 30) {
      try {
        const item = { value, expires: Date.now() + ttlMinutes * 60 * 1000 };
        localStorage.setItem(`sc_cache_${key}`, JSON.stringify(item));
      } catch (e) {
        // ignore if storage not available
      }
    },
    get(key) {
      try {
        const raw = localStorage.getItem(`sc_cache_${key}`);
        if (!raw) return null;
        const item = JSON.parse(raw);
        if (item && item.expires > Date.now()) return item.value;
        localStorage.removeItem(`sc_cache_${key}`);
      } catch (e) {}
      return null;
    },
    clear() {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith("sc_cache_")) localStorage.removeItem(k);
        });
      } catch (e) {}
    },
  };

  // --- Connection helpers ---
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const isSlow = !!(
    connection &&
    (connection.effectiveType === "3g" ||
      (connection.downlink && connection.downlink < 0.8))
  );

  // --- Render override helper ---
  function installRenderOverride(Framework) {
    if (!Framework || !Framework.render || Framework.__sc_render_installed)
      return;
    Framework.__sc_render_installed = true;
    const original = Framework.render.bind(Framework);

    Framework.render = async function (componentPath, targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        // show a small skeleton immediately
        try {
          target.innerHTML = Skeleton.grid(2, 2);
        } catch (e) {}
      }
      // Wait for original render to complete
      const result = await original(componentPath, targetId);

      // Give Alpine.js time to initialize new components
      if (window.Alpine) {
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 100);
          });
        });
      }

      // Re-initialize scroll observer for newly added [data-animate] elements
      if (
        window.ScrollObserver &&
        typeof window.ScrollObserver.reinit === "function"
      ) {
        window.ScrollObserver.reinit();
      }

      return result;
    };
  }

  // Auto-install when Framework is present now or appears later.
  // Sometimes `Framework` is loaded after `core/ui.js` (deferred script order).
  // We attempt a one-time install now, and if not present, poll briefly and stop.
  if (window.Framework) {
    installRenderOverride(window.Framework);
  } else {
    let _sc_check_count = 0;
    const _sc_check_max = 20; // ~5s at 250ms interval
    const _sc_interval = setInterval(() => {
      _sc_check_count++;
      if (window.Framework) {
        try {
          installRenderOverride(window.Framework);
        } catch (e) {}
        clearInterval(_sc_interval);
      } else if (_sc_check_count >= _sc_check_max) {
        clearInterval(_sc_interval);
      }
    }, 250);
  }

  // Expose API
  // morph helper: reconcile new HTML into target element using best available method
  function morph(target, html) {
    if (!target) return Promise.resolve();

    // Parse new HTML and extract scripts so we can execute them after DOM update
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    const scripts = Array.from(tpl.content.querySelectorAll("script"));
    scripts.forEach((s) => s.parentNode && s.parentNode.removeChild(s));

    // Perform morphological update using best available tool
    try {
      if (window.Alpine && typeof Alpine.morph === "function") {
        // Alpine's morph plugin expects HTML string or element
        Alpine.morph(target, tpl.innerHTML);
      } else if (window.morphdom && typeof window.morphdom === "function") {
        // morphdom library available globally
        window.morphdom(target, tpl.innerHTML);
      } else {
        // Fallback: replace entire innerHTML (least optimal)
        target.innerHTML = tpl.innerHTML;
      }
    } catch (e) {
      // On any error, fallback to direct replace
      target.innerHTML = tpl.innerHTML;
    }

    // Execute scripts extracted from the new HTML (preserve attributes)
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML || ""));
      document.head.appendChild(newScript);
      // remove immediately to keep DOM clean; script already executed
      document.head.removeChild(newScript);
    });

    return Promise.resolve();
  }

  return {
    Skeleton,
    Cache,
    isSlow,
    morph,
  };
})();

// Make helpers globally available for legacy code
window.Skeleton = window.CoreUI.Skeleton;
window.CacheManager = window.CoreUI.Cache;
