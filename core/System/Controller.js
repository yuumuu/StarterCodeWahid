// Controller System for StarterCode Framework
// Provides base controller with auto-discovery, lazy loading, and security

(function () {
  'use strict';

  // Base Controller Class
  class BaseController {
    /**
     * Extend base controller to create new controller
     * @param {string} name - Controller name (e.g., 'DivisionController')
     * @param {object} methods - Controller methods and configuration
     * @returns {function} Controller factory function
     */
    static extend(name, methods) {
      // Initialize global Controllers registry
      window.Controllers = window.Controllers || {};

      // Create controller factory
      const controllerFactory = (config = {}) => {
        // Determine which method to use (list, detail, etc.)
        const methodName = config.method || 'default';
        const methodConfig = methods[methodName] || methods;

        return {
          // Default state
          items: [],
          item: null,
          loading: true,
          error: null,
          params: {},

          // Auto-init lifecycle
          async init() {
            this.params = this.getRouteParams();
            await this.loadData();
          },

          // Get route params from Router or Store
          getRouteParams() {
            return (
              window.Router?.params ||
              window.Store?.get('params') ||
              {}
            );
          },

          // Auto-load data
          async loadData() {
            // Get dataSource from method config
            const dataSource = methodConfig.dataSource;

            if (!dataSource) {
              this.loading = false;
              return;
            }

            this.loading = true;
            this.error = null;

            try {
              // Resolve dataSource (can be string or function)
              const source =
                typeof dataSource === 'function'
                  ? dataSource.call(this, this.params)
                  : dataSource;

              // Fetch data
              const data = await Framework.fetchJSON(source);

              // Sanitize data for security
              const sanitized = this.sanitizeData(data);

              // Transform if needed
              const transformed = methodConfig.transform
                ? methodConfig.transform.call(this, sanitized)
                : sanitized;

              // Set to items (list) or item (detail)
              if (Array.isArray(transformed)) {
                this.items = transformed;
              } else {
                this.item = transformed;
              }

              // Call afterLoad hook
              if (methodConfig.afterLoad) {
                await methodConfig.afterLoad.call(this, transformed);
              }
            } catch (err) {
              this.error = err.message || 'Failed to load data';
              console.error(`[${name}] Error:`, err);

              if (methodConfig.onError) {
                methodConfig.onError.call(this, err);
              }
            } finally {
              this.loading = false;
            }
          },

          // Sanitize data to prevent XSS
          sanitizeData(data) {
            if (typeof data === 'string') {
              // Use DOMPurify if available
              return window.DOMPurify
                ? DOMPurify.sanitize(data)
                : this.escapeHtml(data);
            }

            if (Array.isArray(data)) {
              return data.map((item) => this.sanitizeData(item));
            }

            if (typeof data === 'object' && data !== null) {
              const sanitized = {};
              for (let key in data) {
                sanitized[key] = this.sanitizeData(data[key]);
              }
              return sanitized;
            }

            return data;
          },

          // Fallback HTML escape
          escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          },

          // Reload data
          async reload() {
            await this.loadData();
          },

          // Merge all methods from controller definition
          ...methods,

          // Merge method-specific config
          ...(typeof methodConfig === 'object' ? methodConfig : {}),
        };
      };

      // Register controller
      window.Controllers[name] = controllerFactory;

      if (AppConfig.debug) {
        console.log(
          `%c[Controller] Registered: ${name}`,
          'color: #10b981; font-weight: bold;'
        );
      }

      return controllerFactory;
    }
  }

  // Controller Loader - Auto-load controllers on demand
  class ControllerLoader {
    static loadedControllers = new Set();

    /**
     * Load controller dynamically
     * @param {string} controllerName - Name of controller to load
     * @returns {Promise} Resolves when controller is loaded
     */
    static async load(controllerName) {
      // Check if already loaded
      if (window.Controllers?.[controllerName]) {
        return window.Controllers[controllerName];
      }

      // Check if currently loading
      if (this.loadedControllers.has(controllerName)) {
        // Wait for it to load
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.Controllers?.[controllerName]) {
              clearInterval(checkInterval);
              resolve(window.Controllers[controllerName]);
            }
          }, 50);
        });
      }

      // Mark as loading
      this.loadedControllers.add(controllerName);

      // Load controller file dynamically
      const script = document.createElement('script');
      script.src = `app/Controllers/${controllerName}.js`;

      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (AppConfig.debug) {
            console.log(
              `%c[ControllerLoader] Loaded: ${controllerName}`,
              'color: #3b82f6; font-style: italic;'
            );
          }
          resolve(window.Controllers[controllerName]);
        };

        script.onerror = () => {
          this.loadedControllers.delete(controllerName);
          const error = new Error(`Failed to load ${controllerName}`);
          console.error(`[ControllerLoader] Error:`, error);
          reject(error);
        };

        document.head.appendChild(script);
      });
    }
  }

  // Alpine.js integration
  document.addEventListener('alpine:init', () => {
    // Magic helper: $controller('DivisionController')
    Alpine.magic('controller', () => {
      return (name, config = {}) => {
        // Auto-load controller if not loaded
        if (!window.Controllers?.[name]) {
          // Load asynchronously
          ControllerLoader.load(name).catch((err) => {
            console.error(`Failed to load controller ${name}:`, err);
          });

          // Return loading state while controller loads
          return {
            loading: true,
            error: null,
            items: [],
            item: null,
            init() {
              // Wait for controller to load
              const checkInterval = setInterval(() => {
                if (window.Controllers?.[name]) {
                  clearInterval(checkInterval);
                  // Re-initialize with actual controller
                  Object.assign(this, window.Controllers[name](config));
                  this.init();
                }
              }, 50);
            },
          };
        }

        // Return controller instance
        return window.Controllers[name](config);
      };
    });

    if (AppConfig.debug) {
      console.log(
        '%c[Controller] Alpine magic $controller registered',
        'color: #10b981; font-weight: bold;'
      );
    }
  });

  // Expose to window
  window.BaseController = BaseController;
  window.ControllerLoader = ControllerLoader;

  if (AppConfig.debug) {
    console.log(
      '%c[Controller] System initialized',
      'color: #10b981; font-weight: bold;'
    );
  }
})();
