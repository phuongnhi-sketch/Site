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
            draft: ss.filter(s => s.status === 'DRAFT').length,
            submitted: ss.filter(s => s.status === 'SUBMITTED').length,
            survey: ss.filter(s => s.status === 'GATE1').length,
            sitepack: ss.filter(s => s.status === 'GATE2').length,
            deal: ss.filter(s => s.status === 'GATE3').length,
            finish: ss.filter(s => s.status === 'FINISH').length
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
                    <p style="opacity:0.9; font-weight:500; font-size:1.1rem">Hệ thống Master POC v3.2.0 đang hoạt động ổn định và tối ưu.</p>
                </div>
                
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem">
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #94A3B8">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Bản nháp (Draft)</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#64748B">${stats.draft}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #6366F1">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Hồ sơ nộp mới</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#6366F1">${stats.submitted}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #F59E0B">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Đang khảo sát</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#F59E0B">${stats.survey}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #8B5CF6">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Lên Sitepack</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#8B5CF6">${stats.sitepack}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #3B82F6">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Đang chốt Deal</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#3B82F6">${stats.deal}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #10B981">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Hoàn tất / Thuê</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#10B981">${stats.finish}</div>
                    </div>
                </div>

                <div class="glass" style="margin-top:2.5rem; padding:2.5rem; border-radius:28px">
                    <h3 style="margin-bottom:1.5rem; font-family:var(--font-heading)">📊 Phân bổ hồ sơ theo trạng thái</h3>
                    <div style="display:flex; height:50px; border-radius:15px; overflow:hidden; box-shadow:inset 0 2px 10px rgba(0,0,0,0.05)">
                        <div style="width:${(stats.draft / stats.total) * 100}%; background:#94A3B8; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Draft</div>
                        <div style="width:${(stats.submitted / stats.total) * 100}%; background:#6366F1; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">New</div>
                        <div style="width:${(stats.survey / stats.total) * 100}%; background:#F59E0B; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Survey</div>
                        <div style="width:${(stats.sitepack / stats.total) * 100}%; background:#8B5CF6; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Sitepack</div>
                        <div style="width:${(stats.deal / stats.total) * 100}%; background:#3B82F6; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Deal</div>
                        <div style="width:${(stats.finish / stats.total) * 100}%; background:#10B981; display:flex; align-items:center; justify-content:center; color:white; font-size:0.75rem; font-weight:700">Done</div>
                    </div>
                </div>
            </div>`;
    }
};
