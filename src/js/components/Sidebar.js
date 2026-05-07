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
                <div style="margin-top:auto; padding:20px; font-size:0.7rem; color:#999; text-align:center">Version 3.0.9</div>
                <button id="logout-sidebar-btn" style="color:red; border:none; background:none; cursor:pointer; padding:20px; font-weight:700">Đăng xuất</button>
            </aside>
        `;
    },
    afterRender: async () => {
        document.getElementById('logout-sidebar-btn')?.addEventListener('click', () => {
            localStorage.removeItem('site_poc_user');
            store.setState({ user: null });
            window.location.hash = '#login';
            window.location.reload();
        });
    }
};
