/**
 * ROUTER.JS - ĐIỀU HƯỚNG SPA BẰNG HASH ROUTING
 */
import { store } from './store.js';

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    async handleRoute() {
        const user = store.getState().user || JSON.parse(localStorage.getItem('site_poc_user'));
        if (!store.getState().user && user) store.setState({ user });

        let hash = window.location.hash.split('?')[0];
        if (!hash) hash = user ? '#dashboard' : '#login';

        let route = this.routes.find(r => r.path === hash);
        if (!route) route = this.routes.find(r => r.path === '#dashboard');

        // Auth Guard
        if (route.protected && !user) {
            window.location.hash = '#login';
            return;
        }

        // Render view with Layout if protected
        if (route.protected) {
            const { Navbar } = await import('./components/Navbar.js');
            const { Sidebar } = await import('./components/Sidebar.js');

            this.appElement.innerHTML = `
                <div class="layout-container">
                    ${await Navbar.render()}
                    ${Sidebar.render(hash.slice(1))}
                    <main class="main-content" id="main-content">
                        ${await route.view.render()}
                    </main>
                </div>
            `;
            
            if (Sidebar.afterRender) await Sidebar.afterRender();
        } else {
            this.appElement.innerHTML = await route.view.render();
        }
        
        if (route.view.afterRender) {
            await route.view.afterRender();
        }
    }
}
