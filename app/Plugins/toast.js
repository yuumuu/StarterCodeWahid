// Toast Plugin - Show notification messages
// Usage: App.usePlugin('toast', 'Message here', 'info|success|error|warning')

(function() {
  'use strict';

  App.plugin('toast', (message, type = 'info') => {
    const toast = document.createElement('div');
    
    // Color mapping
    const colors = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500'
    };
    
    const bgColor = colors[type] || colors.info;
    
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg text-white transform transition-all duration-300 translate-y-10 opacity-0 ${bgColor} z-50`;
    toast.innerText = message;
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove after 3s
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  });

  console.log('✅ Toast plugin loaded');
})();
