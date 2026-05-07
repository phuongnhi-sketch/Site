import { SiteService } from '../../services/siteService.js';
import { store } from '../store.js';

export const DashboardView = {
    render: async () => {
        const u = store.getState().user;
        // Áp dụng bộ lọc phân quyền cho Dashboard
        const ss = (await SiteService.getSites()).filter(s => {
            if (u.role === 'ADMIN') return true;
            if (u.role === 'BOD_L1') return true;
            if (u.role === 'BOD_L2') return s.brand === u.brand;
            if (u.role === 'PROJECT') return true;
            if (u.role === 'MB') {
                if (s.status === 'DRAFT') {
                    // Draft thì chỉ thấy của mình hoặc cùng vùng (đã nộp)
                    return (s.owner_id === u.id || s.region === u.region);
                }
                return s.region === u.region;
            }
            return false;
        });

        const stats = {
            total: ss.length,
            survey: ss.filter(s => s.status === 'GATE1').length,
            sitepack: ss.filter(s => s.status === 'GATE2').length,
            deal: ss.filter(s => s.status === 'GATE3').length,
            finish: ss.filter(s => s.status === 'FINISH').length,
            draft: ss.filter(s => s.status === 'DRAFT').length
        };

        return `
            <div class="animate-fade-in">
                ${u.role === 'ADMIN' ? `
                <div style="background:#F0F9FF; border:1px solid #BAE6FD; padding:1.2rem; border-radius:16px; margin-bottom:2rem; display:flex; align-items:center; gap:12px; color:#0369A1;">
                    <span style="font-size:1.5rem">💡</span>
                    <p style="margin:0; font-weight:500; font-size:0.95rem">Chào chị Nhi! Chị có quyền Admin toàn hệ thống. Chị có thể mở khóa (Unlock) bất kỳ hồ sơ nào để các bạn MB sửa lại nhé.</p>
                </div>` : ''}
                <div class="glass" style="padding:3.5rem; border-radius:30px; background:var(--grad-primary); color:white; margin-bottom:2.5rem; box-shadow:0 15px 40px rgba(37,99,235,0.15)">
                    <h1 style="font-size:2.8rem; margin-bottom:0.5rem; font-family:var(--font-heading)">Xin chào ${u.name}! 👋</h1>
                    <p style="opacity:0.9; font-weight:500; font-size:1.1rem">Hệ thống Master POC v3.1.9 đang hoạt động ổn định và tối ưu.</p>
                </div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem">
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid var(--accent-blue)">
                        <div style="font-size:0.9rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.8rem">Tổng số hồ sơ</div>
                        <div style="font-size:3rem; font-weight:900; color:var(--primary-color)">${stats.total}</div>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #F59E0B">
                        <div style="font-size:0.9rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.8rem">Đang khảo sát</div>
                        <div style="font-size:3rem; font-weight:900; color:#F59E0B">${stats.survey}</div>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #10B981">
                        <div style="font-size:0.9rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.8rem">Đã hoàn tất</div>
                        <div style="font-size:3rem; font-weight:900; color:#10B981">${stats.finish}</div>
                    </div>
                </div>
                <div class="glass" style="margin-top:2.5rem; padding:2.5rem; border-radius:28px">
                    <h3 style="margin-bottom:1.5rem; font-family:var(--font-heading)">📊 Phân bổ hồ sơ theo trạng thái</h3>
                    <div style="display:flex; height:50px; border-radius:15px; overflow:hidden; box-shadow:inset 0 2px 10px rgba(0,0,0,0.05)">
                        <div style="width:${(stats.survey / stats.total) * 100}%; background:#F59E0B; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Survey</div>
                        <div style="width:${(stats.sitepack / stats.total) * 100}%; background:#8B5CF6; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Sitepack</div>
                        <div style="width:${(stats.deal / stats.total) * 100}%; background:#3B82F6; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Deal</div>
                        <div style="width:${(stats.finish / stats.total) * 100}%; background:#10B981; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Done</div>
                        <div style="width:${(stats.draft / stats.total) * 100}%; background:#94A3B8; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Draft</div>
                    </div>
                    <div style="display:flex; gap:20px; margin-top:1.5rem; flex-wrap:wrap">
                        <div style="display:flex; align-items:center; gap:8px"><div style="width:12px; height:12px; border-radius:3px; background:#F59E0B"></div> <span style="font-size:0.85rem; font-weight:600">Survey: ${stats.survey}</span></div>
                        <div style="display:flex; align-items:center; gap:8px"><div style="width:12px; height:12px; border-radius:3px; background:#8B5CF6"></div> <span style="font-size:0.85rem; font-weight:600">Sitepack: ${stats.sitepack}</span></div>
                        <div style="display:flex; align-items:center; gap:8px"><div style="width:12px; height:12px; border-radius:3px; background:#3B82F6"></div> <span style="font-size:0.85rem; font-weight:600">Deal: ${stats.deal}</span></div>
                        <div style="display:flex; align-items:center; gap:8px"><div style="width:12px; height:12px; border-radius:3px; background:#10B981"></div> <span style="font-size:0.85rem; font-weight:600">Done: ${stats.finish}</span></div>
                        <div style="display:flex; align-items:center; gap:8px"><div style="width:12px; height:12px; border-radius:3px; background:#94A3B8"></div> <span style="font-size:0.85rem; font-weight:600">Draft: ${stats.draft}</span></div>
                    </div>
                </div>
            </div>`;
    }
};
