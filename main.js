// Routes loaded from config/routes.js

// Create App alias for Framework
// Now you can use both:
//   App.fetchJSON('data.json')  ← shorter, cleaner
//   Framework.fetchJSON('data.json')  ← original
window.App = window.Framework;

// Initialize App - Use 'alpine:initialized' instead of 'alpine:init'
// This ensures Alpine is FULLY ready before we initialize the router
document.addEventListener('alpine:initialized', () => {
    console.log('Alpine fully initialized, starting Router...');
    
    // Initialize BasePath for GitHub Pages support
    if (window.BasePath) {
        BasePath.init();
    }
    
    // Initialize Router after Alpine is ready
    Router.init(routes);
    
    // Initialize scroll animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (window.AOS) {
            console.log('Initializing AOS from main.js');
            window.AOS.init();
        }
    }, 300);
});

// Register App component for Alpine
document.addEventListener('alpine:init', () => {
    Alpine.data('App', () => ({
        init() {
            console.log('App component initialized');
        }
    }));
});

// ========================================
// Plugins are now managed centrally in app/Plugins/
// They are auto-loaded via app/Plugins/index.js
// 
// Available plugins:
// - toast: App.usePlugin('toast', 'message', 'type')
// - loader: App.usePlugin('loader', true|false)
// - modal: App.usePlugin('modal', { title, content, onConfirm })
// - notification: App.usePlugin('notification', { message, type, duration })
//
// To add new plugins, create a .js file in app/Plugins/
// and add it to the plugins array in app/Plugins/index.js
// ========================================
