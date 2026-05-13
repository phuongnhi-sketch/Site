/**
 * SIDEBAR.JS - THANH ĐIỀU HƯỚNG BÊN TRÁI
 */

import { store } from '../store.js';

export const Sidebar = {
    render: (active) => {
        const { user } = store.getState();
        const menuItems = [
            { id: 'dashboard', icon: '📊', label: 'Tổng quan', roles: ['MB', 'BOD_L1', 'BOD_L2', 'PROJECT', 'ADMIN'] },
            { id: 'sites', icon: '📄', label: 'Hồ sơ MB', roles: ['MB', 'BOD_L1', 'BOD_L2', 'PROJECT', 'ADMIN'] },
            { id: 'map', icon: '🗺️', label: 'Bản đồ', roles: ['MB', 'BOD_L1', 'BOD_L2', 'PROJECT', 'ADMIN'] },
            { id: 'create', icon: '📝', label: 'Soạn hồ sơ', roles: ['MB', 'ADMIN'] },
            { id: 'settings', icon: '⚙️', label: 'Quản lý Biểu mẫu', roles: ['ADMIN'] },
            { id: 'users', icon: '👤', label: 'Quản lý User', roles: ['ADMIN'] }
        ];

        const menuHtml = menuItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => `
                <a href="#${item.id}" class="menu-item ${active === item.id ? 'active' : ''}">
                    <span class="icon">${item.icon}</span>
                    <span class="label">${item.label}</span>
                </a>
            `).join('');

        return `
            <aside class="sidebar glass animate-fade-in">
                <div class="sidebar-menu">
                    ${menuHtml}
                </div>
                <div style="padding: 20px; border-top: 1px solid var(--border-glass); margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
                    <a href="#change-password" style="color:var(--text-muted); text-decoration:none; font-size:0.9rem; font-weight:600; display:flex; align-items:center; gap:8px;">
                        <span>🛡️</span> Đổi mật khẩu
                    </a>
                    <button id="logout-sidebar-btn" style="color:#EF4444; border:none; background:none; cursor:pointer; font-weight:700; text-align:left; padding:0; display:flex; align-items:center; gap:8px;">
                        <span>🚪</span> Đăng xuất
                    </button>
                </div>
            </aside>
        `;
    },
    afterRender: async () => {
        document.getElementById('logout-sidebar-btn')?.addEventListener('click', async () => {
            try {
                const { supabase } = await import('../../services/supabaseClient.js');
                await supabase.auth.signOut();
            } catch (e) { console.warn('SignOut error:', e); }
            localStorage.removeItem('site_poc_user');
            store.setState({ user: null });
            window.location.hash = '#login';
            window.location.reload();
        });
    }
};
