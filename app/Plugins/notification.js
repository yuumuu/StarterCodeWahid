// Notification Plugin - Show persistent notifications
// Usage: App.usePlugin('notification', { message, type, duration })

(function() {
  'use strict';

  // Create notification container if it doesn't exist
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(container);
    }
    return container;
  }

  App.plugin('notification', (options = {}) => {
    const {
      message = '',
      type = 'info',
      duration = 5000,
      dismissible = true
    } = options;

    // Color and icon mapping
    const styles = {
      info: { bg: 'bg-blue-500', icon: 'ℹ️' },
      success: { bg: 'bg-green-500', icon: '✅' },
      error: { bg: 'bg-red-500', icon: '❌' },
      warning: { bg: 'bg-yellow-500', icon: '⚠️' }
    };

    const style = styles[type] || styles.info;
    const cont = getContainer();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `${style.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md transform transition-all duration-300 translate-x-full opacity-0`;
    
    notification.innerHTML = `
      <span class="text-xl">${style.icon}</span>
      <span class="flex-1">${message}</span>
      ${dismissible ? '<button class="text-white/80 hover:text-white text-xl leading-none">&times;</button>' : ''}
    `;

    cont.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.remove('translate-x-full', 'opacity-0');
    });

    // Close function
    const closeNotification = () => {
      notification.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        notification.remove();
        // Remove container if empty
        if (cont.children.length === 0) {
          cont.remove();
          container = null;
        }
      }, 300);
    };

    // Dismiss button
    if (dismissible) {
      const dismissBtn = notification.querySelector('button');
      dismissBtn.addEventListener('click', closeNotification);
    }

    // Auto dismiss
    if (duration > 0) {
      setTimeout(closeNotification, duration);
    }

    return {
      close: closeNotification
    };
  });

  console.log('✅ Notification plugin loaded');
})();
