/**
 * ROUTER.JS - ĐIỀU HƯỚNG SPA BẰNG HASH ROUTING
 * Auth check qua Supabase Auth session (không phải localStorage)
 */
import { store } from './store.js';
import { supabase } from '../services/supabaseClient.js';

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    async handleRoute() {
        // 1. Kiểm tra Supabase Auth session
        const { data: { session } } = await supabase.auth.getSession();
        let user = store.getState().user;

        if (session && session.user) {
            // Có session Supabase → dùng metadata + localStorage cache
            if (!user) {
                // Thử đọc từ localStorage cache trước (đã được save khi login)
                const cached = localStorage.getItem('site_poc_user');
                if (cached) {
                    user = JSON.parse(cached);
                } else {
                    // Fallback: dùng user_metadata từ Supabase Auth
                    const meta = session.user.user_metadata || {};
                    user = {
                        id: meta.username || session.user.id,
                        name: meta.name || session.user.email,
                        role: meta.role || 'MB',
                        region: meta.region || 'ALL',
                        brand: meta.brand || 'ALL',
                        email: session.user.email,
                    };
                    localStorage.setItem('site_poc_user', JSON.stringify(user));
                }
                store.setState({ user });
            }
        } else {
            // Không có Supabase session → xóa user khỏi store
            user = null;
            store.setState({ user: null });
            localStorage.removeItem('site_poc_user');
        }

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

