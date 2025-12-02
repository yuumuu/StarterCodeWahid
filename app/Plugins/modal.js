// Modal Plugin - Show modal dialogs
// Usage: App.usePlugin('modal', { title, content, onConfirm, onCancel })

(function() {
  'use strict';

  App.plugin('modal', (options = {}) => {
    const {
      title = 'Modal',
      content = '',
      confirmText = 'OK',
      cancelText = 'Cancel',
      showCancel = true,
      onConfirm = () => {},
      onCancel = () => {}
    } = options;

    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-0';
    backdrop.id = 'modal-backdrop';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0';
    
    modal.innerHTML = `
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">${title}</h3>
        <div class="text-gray-600 mb-6">${content}</div>
        <div class="flex gap-3 justify-end">
          ${showCancel ? `<button id="modal-cancel" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">${cancelText}</button>` : ''}
          <button id="modal-confirm" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">${confirmText}</button>
        </div>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      modal.classList.remove('scale-95', 'opacity-0');
    });

    // Close modal function
    const closeModal = () => {
      backdrop.classList.add('opacity-0');
      modal.classList.add('scale-95', 'opacity-0');
      setTimeout(() => backdrop.remove(), 300);
    };

    // Event listeners
    const confirmBtn = modal.querySelector('#modal-confirm');
    const cancelBtn = modal.querySelector('#modal-cancel');

    confirmBtn.addEventListener('click', () => {
      onConfirm();
      closeModal();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        onCancel();
        closeModal();
      });
    }

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        onCancel();
        closeModal();
      }
    });

    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        onCancel();
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  });

  console.log('✅ Modal plugin loaded');
})();
