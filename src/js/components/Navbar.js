/**
 * NAVBAR.JS - THANH ĐIỀU HƯỚNG PHÍA TRÊN
 */

import { store } from '../store.js';

export const Navbar = {
    render: () => {
        const { user } = store.getState();
        return `
            <nav class="navbar glass animate-fade-in">
                <div class="navbar-brand">
                    🏢 Site Management Web
                </div>
                <div class="navbar-actions">
                    <div class="user-info">
                        <span class="user-name">${user?.name || 'User'}</span>
                        <span class="badge">${user?.role || 'Guest'}</span>
                    </div>
                    <div class="notifications-btn glass-glow" style="padding: 0.6rem; border-radius: 12px; cursor: pointer; background: #F1F5F9;">
                        <span class="icon">🔔</span>
                        <span class="notif-dot"></span>
                    </div>
                </div>
            </nav>
        `;
    }
};
