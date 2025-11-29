// Error Handler for StarterCode Framework
// Handles errors differently based on development/production mode

window.ErrorHandler = (function () {
  // Error history for debugging
  const errorHistory = [];
  const maxHistorySize = 50;

  // Log error to console with formatting
  function logError(error, context = {}) {
    if (!AppConfig.errorReporting) return;

    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      message: error.message || String(error),
      type: error.name || 'Error',
      stack: error.stack,
      context,
    };

    // Add to history
    errorHistory.push(errorInfo);
    if (errorHistory.length > maxHistorySize) {
      errorHistory.shift();
    }

    // Console logging with styling
    if (AppConfig.debug) {
      console.group(
        `%c🔴 Error: ${errorInfo.type}`,
        'color: #ef4444; font-weight: bold; font-size: 14px;'
      );
      console.log('%cMessage:', 'font-weight: bold;', errorInfo.message);
      if (context.component) {
        console.log('%cComponent:', 'font-weight: bold;', context.component);
      }
      if (context.url) {
        console.log('%cURL:', 'font-weight: bold;', context.url);
      }
      if (errorInfo.stack) {
        console.log('%cStack Trace:', 'font-weight: bold;');
        console.log(errorInfo.stack);
      }
      if (Object.keys(context).length > 0) {
        console.log('%cContext:', 'font-weight: bold;', context);
      }
      console.groupEnd();
    }

    return errorInfo;
  }

  // Show development error page with details
  function showDevError(error, context = {}) {
    const errorInfo = logError(error, context);

    // Store error details globally for dev-error page
    window.lastError = {
      message: errorInfo.message,
      name: errorInfo.type,
      stack: errorInfo.stack,
      component: context.component || context.url || '',
      context: context,
      timestamp: errorInfo.timestamp,
    };

    // Navigate to dev error page
    const targetElement = document.getElementById('router-view');
    if (targetElement && window.Framework) {
      Framework.render(AppConfig.errorPages.devError, 'router-view').catch(
        (err) => {
          console.error('Failed to render dev error page:', err);
          showFallbackError(error, context);
        }
      );
    } else {
      showFallbackError(error, context);
    }
  }

  // Show production error page (user-friendly)
  function showProdError(error, context = {}) {
    // Log error but don't expose details
    logError(error, { ...context, production: true });

    // Navigate to production error page
    const targetElement = document.getElementById('router-view');
    if (targetElement && window.Framework) {
      Framework.render(AppConfig.errorPages['500'], 'router-view').catch(
        (err) => {
          console.error('Failed to render error page:', err);
          showFallbackError(error, context);
        }
      );
    } else {
      showFallbackError(error, context);
    }
  }

  // Fallback error display (inline)
  function showFallbackError(error, context = {}) {
    const targetElement = document.getElementById('router-view');
    if (!targetElement) return;

    const isDev = AppConfig.isDevelopment();
    const errorMessage = error.message || String(error);

    if (isDev) {
      targetElement.innerHTML = `
        <div class="min-h-screen bg-red-50 p-6">
          <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center mb-6">
              <svg class="w-12 h-12 text-red-600 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Development Error</h1>
                <p class="text-gray-600">An error occurred while rendering the error page</p>
              </div>
            </div>
            <div class="bg-gray-100 p-4 rounded mb-4">
              <h2 class="font-semibold text-gray-700 mb-2">Error Message:</h2>
              <pre class="text-sm text-red-600 whitespace-pre-wrap">${errorMessage}</pre>
            </div>
            ${
              context.component
                ? `
              <div class="bg-gray-100 p-4 rounded mb-4">
                <h2 class="font-semibold text-gray-700 mb-2">Component:</h2>
                <pre class="text-sm text-gray-800">${context.component}</pre>
              </div>
            `
                : ''
            }
            ${
              error.stack
                ? `
              <div class="bg-gray-100 p-4 rounded">
                <h2 class="font-semibold text-gray-700 mb-2">Stack Trace:</h2>
                <pre class="text-xs text-gray-600 overflow-x-auto">${error.stack}</pre>
              </div>
            `
                : ''
            }
            <div class="mt-6 flex gap-4">
              <button onclick="location.reload()" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Reload Page
              </button>
              <a href="#/" class="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Go Home
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      targetElement.innerHTML = `
        <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div class="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
            <div class="text-6xl mb-4">😵</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Oops! Something Went Wrong</h1>
            <p class="text-gray-600 mb-6">We're sorry, but something unexpected happened.</p>
            <div class="flex gap-4 justify-center">
              <button onclick="location.reload()" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Reload Page
              </button>
              <a href="#/" class="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Go Home
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Main error handler - routes to dev or prod display
  function handle(error, context = {}) {
    if (!error) return;

    // Determine if this is a 404 error
    if (context.type === '404' || error.message?.includes('404')) {
      show404();
      return;
    }

    // Show appropriate error page based on mode
    if (AppConfig.isDevelopment()) {
      showDevError(error, context);
    } else {
      showProdError(error, context);
    }
  }

  // Show 404 page
  function show404() {
    const targetElement = document.getElementById('router-view');
    if (targetElement && window.Framework) {
      Framework.render(AppConfig.errorPages['404'], 'router-view').catch(
        (err) => {
          console.error('Failed to render 404 page:', err);
          targetElement.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-100">
              <div class="text-center">
                <h1 class="text-9xl font-bold text-gray-300">404</h1>
                <p class="text-2xl text-gray-600 mt-4">Page Not Found</p>
                <a href="#/" class="mt-8 inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Go Home
                </a>
              </div>
            </div>
          `;
        }
      );
    }
  }

  // Get error history
  function getHistory() {
    return [...errorHistory];
  }

  // Clear error history
  function clearHistory() {
    errorHistory.length = 0;
  }

  // Get common error suggestions
  function getSuggestions(error) {
    const message = error.message || String(error);
    const suggestions = [];

    if (message.includes('Failed to load') || message.includes('fetch')) {
      suggestions.push('Check if the file path is correct');
      suggestions.push('Verify that the file exists');
      suggestions.push('Check your network connection');
    }

    if (message.includes('undefined') || message.includes('null')) {
      suggestions.push('Check if all required variables are defined');
      suggestions.push('Verify data is loaded before accessing it');
    }

    if (message.includes('syntax')) {
      suggestions.push('Check for syntax errors in your code');
      suggestions.push('Verify all brackets and quotes are properly closed');
    }

    if (suggestions.length === 0) {
      suggestions.push('Check the console for more details');
      suggestions.push('Try refreshing the page');
      suggestions.push('Clear your browser cache');
    }

    return suggestions;
  }

  // Public API
  return {
    handle,
    showDevError,
    showProdError,
    show404,
    logError,
    getHistory,
    clearHistory,
    getSuggestions,
  };
})();

// Install global error handlers
window.addEventListener('error', (event) => {
  ErrorHandler.handle(event.error || new Error(event.message), {
    type: 'global',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorHandler.handle(event.reason || new Error('Unhandled Promise Rejection'), {
    type: 'promise',
    promise: event.promise,
  });
});

if (AppConfig.debug) {
  console.log(
    '%c[ErrorHandler] Initialized',
    'color: #10b981; font-weight: bold;'
  );
}
