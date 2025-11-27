const Router = {
    routes: [],
    
    init(routes) {
        this.routes = routes;
        window.addEventListener('hashchange', () => this.handleHashChange());
        window.addEventListener('load', () => this.handleHashChange());
    },

    async handleHashChange() {
        let hash = window.location.hash.slice(1) || '/';
        
        // Handle query params
        const [path, query] = hash.split('?');
        
        // Find route
        let route = this.routes.find(r => r.path === path);
        
        // 404 Fallback
        if (!route) {
            route = this.routes.find(r => r.path === '/404') || { component: 'app/pages/404.html' };
        }

        // Pre-route hook (optional)
        if (route.beforeEnter) {
            const shouldProceed = await route.beforeEnter();
            if (!shouldProceed) return;
        }

        // Load Page
        await Framework.render(route.component, 'router-view');
        
        // Update Active Links (simple helper)
        document.querySelectorAll('[href]').forEach(el => {
            if (el.getAttribute('href') === '#' + path) {
                el.classList.add('active-link');
            } else {
                el.classList.remove('active-link');
            }
        });
    },

    navigate(path) {
        window.location.hash = path;
    }
};
