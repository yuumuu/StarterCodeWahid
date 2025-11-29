// Application Configuration
// This file contains global configuration for the StarterCode framework

const AppConfig = {
  // Application mode: 'development' or 'production'
  // In development mode:
  // - Detailed error messages with stack traces
  // - Dev toolbar visible
  // - Debug logging enabled
  // - No caching for easier development
  //
  // In production mode:
  // - User-friendly error messages
  // - No dev toolbar
  // - Minimal logging
  // - Optimized caching
  mode: 'development',

  // Debug mode - enables verbose logging
  debug: true,

  // Error reporting - log errors to console
  errorReporting: true,

  // Show dev toolbar (only in development mode)
  showDevToolbar: true,

  // Cache settings
  cache: {
    enabled: false, // Disable cache in dev for easier development
    ttl: 30, // Cache TTL in minutes (for production)
  },

  // Error page paths
  errorPages: {
    404: 'app/pages/errors/404.html',
    500: 'app/pages/errors/500.html',
    devError: 'app/pages/errors/dev-error.html',
    offline: 'app/pages/errors/offline.html',
  },

  // Get current mode (with localStorage override)
  getMode() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'development' || urlMode === 'production') {
      this.setMode(urlMode);
      return urlMode;
    }

    // Check localStorage
    const savedMode = localStorage.getItem('app_mode');
    if (savedMode === 'development' || savedMode === 'production') {
      return savedMode;
    }

    // Return default mode
    return this.mode;
  },

  // Set mode and persist to localStorage
  setMode(mode) {
    if (mode !== 'development' && mode !== 'production') {
      console.warn(`Invalid mode: ${mode}. Using default.`);
      return;
    }

    this.mode = mode;
    localStorage.setItem('app_mode', mode);

    // Update related settings
    this.debug = mode === 'development';
    this.cache.enabled = mode === 'production';

    console.log(`[AppConfig] Mode set to: ${mode}`);
  },

  // Toggle between development and production
  toggleMode() {
    const newMode = this.mode === 'development' ? 'production' : 'development';
    this.setMode(newMode);
    return newMode;
  },

  // Check if in development mode
  isDevelopment() {
    return this.getMode() === 'development';
  },

  // Check if in production mode
  isProduction() {
    return this.getMode() === 'production';
  },

  // Initialize config
  init() {
    this.mode = this.getMode();
    this.debug = this.isDevelopment();
    this.cache.enabled = this.isProduction();

    if (this.debug) {
      console.log('[AppConfig] Initialized', {
        mode: this.mode,
        debug: this.debug,
        cache: this.cache.enabled,
      });
    }
  },
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  AppConfig.init();
}

// Make available globally
window.AppConfig = AppConfig;
