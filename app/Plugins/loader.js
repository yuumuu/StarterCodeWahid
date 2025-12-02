// Loader Plugin - Show/hide loading indicator
// Usage: App.usePlugin('loader', true|false)

(function() {
  'use strict';

  App.plugin('loader', (show) => {
    let loader = document.getElementById('global-loader');
    
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'global-loader';
      loader.className = 'fixed inset-0 bg-white/80 flex items-center justify-center z-50 transition-opacity duration-300';
      loader.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>';
      document.body.appendChild(loader);
    }
    
    if (show) {
      loader.classList.remove('pointer-events-none', 'opacity-0');
    } else {
      loader.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  console.log('✅ Loader plugin loaded');
})();
