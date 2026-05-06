import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const NotificationView = {
    render: async () => {
        const u = store.getState().user;
        const allNotifs = await NotificationService.get();
        const ns = allNotifs.filter(n => n.uId === u.id || n.uId === u.role + '-all' || n.uId === 'admin-all');
        // Actually, NotificationService.get(userId) might already filter it, but we filter just in case.
        
        // Define global handlers if they don't exist
        window.markAllRead = async () => {
            await NotificationService.markAllRead(u.id);
            window.location.reload();
        };

        window.deleteNotifs = () => {
            // In demo.html it removed localStorage item. With Supabase, we might not have a delete all API, so just mark read.
            // For now, keep visual consistency with demo.html
            alert('Tính năng xóa thông báo trên server đang cập nhật!');
        };

        window.markReadAndGo = async (id, siteId) => {
            await NotificationService.markRead(id);
            location.hash = '#detail?id=' + siteId;
        };

        return `
            <div class="animate-fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem">
                    <h1>🔔 Thông báo của bạn</h1>
                    <div style="display:flex; gap:10px">
                        <button class="btn-ghost" onclick="window.markAllRead()">✔️ Đã đọc tất cả</button>
                        <button class="btn-ghost" style="color:red; border-color:#FEE2E2" onclick="window.deleteNotifs()">🗑️ Xóa hết</button>
                    </div>
                </div>
                <div class="glass" style="border-radius:24px; overflow:hidden">
                    ${ns.length === 0 ? '<div style="padding:4rem; text-align:center; color:#ccc">Không có thông báo mới</div>' : ns.map(n => `
                        <div style="padding:1.5rem; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; background:${n.isRead ? 'white' : '#F0F9FF'}; cursor:pointer; transition:0.2s" 
                             onclick="window.markReadAndGo('${n.id}', '${n.sId}')">
                            <div>
                                <div style="font-weight:700; margin-bottom:0.3rem; color:${n.isRead ? '#64748B' : '#1E293B'}">${n.msg}</div>
                                <div style="font-size:0.75rem; color:#999">${new Date(n.date).toLocaleString()}</div>
                            </div>
                            ${!n.isRead ? '<div style="width:10px; height:10px; background:var(--accent-blue); border-radius:50%"></div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }
};
