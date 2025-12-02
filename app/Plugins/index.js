// Plugin Auto-Discovery System
// Automatically loads all plugins in this directory

(function() {
  'use strict';

  console.log('🔌 Loading Staco Plugins...');

  // List of plugins to load
  const plugins = [
    'toast.js',
    'loader.js',
    'modal.js',
    'notification.js'
  ];

  // Load each plugin
  plugins.forEach(pluginFile => {
    const script = document.createElement('script');
    script.src = `app/Plugins/${pluginFile}`;
    script.onerror = () => console.warn(`⚠️ Failed to load plugin: ${pluginFile}`);
    document.head.appendChild(script);
  });

  console.log(`✅ ${plugins.length} plugins registered`);
})();
