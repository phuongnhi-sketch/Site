import { store } from '../store.js';
import { NotificationService } from '../../services/notificationService.js';

export const Navbar = {
    render: async () => {
        const { user } = store.getState();
        const unreadCount = await NotificationService.getUnreadCount(user?.id);
        
        return `
            <nav class="navbar glass animate-fade-in">
                <div style="font-family:var(--font-heading); font-size:1.4rem; font-weight:700; color:var(--accent-blue)">
                    🏢 Site Management Master POC
                </div>
                <div class="navbar-actions" style="display:flex; align-items:center; gap:1.5rem">
                    <div style="position:relative; cursor:pointer" onclick="location.hash='#notifs'">
                        <span style="font-size:1.5rem">🔔</span>
                        ${unreadCount > 0 ? `<span style="position:absolute; top:-5px; right:-5px; background:red; color:white; font-size:0.6rem; padding:2px 5px; border-radius:50%; font-weight:800">${unreadCount}</span>` : ''}
                    </div>
                    <div style="font-weight:700">
                        ${user?.name || 'User'} (${user?.role === 'BOD_L1' ? 'BOD' : (user?.role === 'BOD_L2' ? user.brand : user?.role || 'Guest')})
                    </div>
                </div>
            </nav>
        `;
    }
};
