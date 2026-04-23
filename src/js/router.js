/**
 * ROUTER.JS - ĐIỀU HƯỚNG SPA
 */

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
        
        // Listen for back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Intercept link clicks
        document.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        let route = this.routes.find(r => r.path === path);

        if (!route) {
            route = this.routes[0]; // Mặc định
        }

        // Auth Guard
        const user = localStorage.getItem('site_poc_user');
        if (route.protected && !user) {
            this.navigateTo('/login');
            return;
        }

        // Render view with Layout if protected
        if (route.protected) {
            // Import layout components dynamically to avoid circular dependencies if any
            const { Navbar } = await import('./components/Navbar.js');
            const { Sidebar } = await import('./components/Sidebar.js');

            this.appElement.innerHTML = `
                <div class="layout-container">
                    ${Navbar.render()}
                    ${Sidebar.render()}
                    <main class="main-content">
                        ${await route.view.render()}
                    </main>
                </div>
            `;
            
            if (Sidebar.afterRender) await Sidebar.afterRender();
        } else {
            // Login / Public pages
            this.appElement.innerHTML = await route.view.render();
        }
        
        // Execute view's afterRender
        if (route.view.afterRender) {
            await route.view.afterRender();
        }
    }
}
