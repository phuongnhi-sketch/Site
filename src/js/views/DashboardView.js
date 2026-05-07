import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { store } from '../store.js';

export const STATUS_LABELS = {
    'DRAFT': 'Draft',
    'SUBMITTED': 'Submitted',
    'GATE1': 'Survey',
    'GATE2': 'Sitepack',
    'GATE3': 'Deal',
    'FINISH': 'Complete',
    'REJECTED': 'Rejected'
};

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


        return `
            <div class="animate-fade-in">
                ${u.role === 'ADMIN' ? `
                <div style="background:#F0F9FF; border:1px solid #BAE6FD; padding:1.2rem; border-radius:16px; margin-bottom:2rem; display:flex; align-items:center; gap:12px; color:#0369A1;">
                    <span style="font-size:1.5rem">💡</span>
                    <p style="margin:0; font-weight:500; font-size:0.95rem">Chào chị Nhi! Chị có quyền Admin toàn hệ thống. Chị có thể mở khóa (Unlock) bất kỳ hồ sơ nào để các bạn MB sửa lại nhé.</p>
                </div>` : ''}
                <div class="glass" style="padding:3.5rem; border-radius:30px; background:var(--grad-primary); color:white; margin-bottom:2.5rem; box-shadow:0 15px 40px rgba(37,99,235,0.15)">
                    <h1 style="font-size:2.8rem; margin-bottom:0.5rem; font-family:var(--font-heading)">Xin chào ${u.name}! 👋</h1>
                    <p style="opacity:0.9; font-weight:500; font-size:1.1rem">Hệ thống Master POC v3.2.1 đang hoạt động ổn định và tối ưu.</p>
                </div>
                
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem">
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #94A3B8">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Draft</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#64748B">${ss.filter(s => s.status === 'DRAFT').length}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #6366F1">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Submitted</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#6366F1">${ss.filter(s => s.status === 'SUBMITTED').length}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #F59E0B">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Survey</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#F59E0B">${ss.filter(s => s.status === 'GATE1').length}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #8B5CF6">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Sitepack</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#8B5CF6">${ss.filter(s => s.status === 'GATE2').length}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #3B82F6">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Deal</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#3B82F6">${ss.filter(s => s.status === 'GATE3').length}</div>
                    </div>
                    <div class="glass" style="padding:1.5rem; border-radius:20px; border-bottom:4px solid #10B981">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:0.4rem">Complete</div>
                        <div style="font-size:2.2rem; font-weight:900; color:#10B981">${ss.filter(s => s.status === 'FINISH').length}</div>
                    </div>
                </div>
            </div>`;
    }
};
