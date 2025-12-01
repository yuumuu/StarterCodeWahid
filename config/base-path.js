// Base Path Configuration for GitHub Pages
// This file handles the base path for deployments in subdirectories

const BasePath = {
  // Detect if running on GitHub Pages
  isGitHubPages() {
    return window.location.hostname.includes('github.io');
  },

  // Get the base path
  get() {
    // For GitHub Pages: /Staco/
    // For local dev: /
    if (this.isGitHubPages() && window.location.pathname.startsWith('/Staco')) {
      return '/Staco/';
    }
    return '/';
  },

  // Resolve a relative path with base path
  resolve(path) {
    const base = this.get();
    // Remove leading slash from path if exists
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Combine base and path, ensuring no double slashes
    return base + cleanPath;
  },

  // Initialize - update Framework.fetchHTML to use base path
  init() {
    if (typeof window.Framework !== 'undefined') {
      const originalFetchHTML = window.Framework.fetchHTML;
      const basePath = this;

      window.Framework.fetchHTML = async function(url) {
        // Only add base path if it's a relative URL (doesn't start with http/https)
        if (!url.match(/^https?:\/\//)) {
          url = basePath.resolve(url);
        }
        return originalFetchHTML.call(this, url);
      };

      console.log('[BasePath] Initialized with base:', this.get());
    }
  }
};

// Make available globally
window.BasePath = BasePath;
