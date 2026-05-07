import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const DashboardView = {
            render: async () => {
                const u = store.getState().user;
                // Áp dụng bộ lọc phân quyền cho Dashboard
                const ss = (await SiteService.getSites()).filter(s => {
                    if (s.status === 'DRAFT') return s.owner === u.id || u.role === 'ADMIN';
                    if (u.role === 'ADMIN' || u.role === 'BOD_L1') return true;
                    if (u.role === 'BOD_L2') {
                        if (s.status === 'FINISH' || s.status === 'REJECTED') return true;
                        const sBrand = s.brand || s.answers?.f0 || '';
                        if (['DQ', 'SW'].includes(u.brand)) return sBrand.includes('DQ') || sBrand.includes('SW');
                        return sBrand.includes(u.brand);
                    }
                    if (u.role === 'PROJECT') return ['GATE1', 'GATE2', 'GATE3', 'FINISH', 'REJECTED'].includes(s.status);
                    return u.role === 'MB' ? s.region === u.region : false;
                });

                const mySites = ss.filter(s => s.owner === u.id);
                const submitted = ss.filter(s => s.status === 'SUBMITTED').length;
                const gate1 = ss.filter(s => s.status === 'GATE1').length;
                const gate2 = ss.filter(s => s.status === 'GATE2').length;
                const gate3 = ss.filter(s => s.status === 'GATE3').length;
                const finished = ss.filter(s => s.status === 'FINISH').length;
                const rejected = ss.filter(s => s.status === 'REJECTED').length;
                const draft = ss.filter(s => s.status === 'DRAFT').length;

                const feedbackCount = mySites.filter(s => (s.status === 'DRAFT' || s.status === 'GATE1') && s.comments && s.comments.length > 0).length;

                return `
            <div class="animate-fade-in">
                ${(u.role === 'MB' && feedbackCount > 0) ? `
                <div style="background:#FEF2F2; border-left:4px solid #EF4444; padding:1.5rem; border-radius:12px; margin-bottom:2rem; box-shadow:var(--shadow-soft); display:flex; align-items:center; gap:1rem;">
                    <span style="font-size:2rem;">🔔</span>
                    <div>
                        <h3 style="color:#991B1B; margin-bottom:0.2rem;">Thông báo phản hồi</h3>
                        <p style="color:#B91C1C;">Bạn có <strong>${feedbackCount}</strong> hồ sơ đang có phản hồi/yêu cầu sửa từ sếp. Vui lòng kiểm tra danh sách hồ sơ!</p>
                    </div>
                </div>` : ''}
                <div class="glass" style="padding:3.5rem; border-radius:30px; background:var(--grad-primary); color:white; margin-bottom:2.5rem; box-shadow:0 15px 40px rgba(37,99,235,0.15)">
                    <h1 style="font-size:2.8rem; margin-bottom:0.5rem; font-family:var(--font-heading)">Xin chào ${u.name}! 👋</h1>
                    <p style="opacity:0.9; font-weight:500; font-size:1.1rem">Hệ thống Master POC v2.5 đang hoạt động ổn định và tối ưu.</p>
                </div>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem">
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid var(--accent-blue)">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${submitted}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Submitted</p>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #7E22CE">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${gate1}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Survey</p>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid var(--accent-azure)">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${gate2}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Sitepack</p>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #B45309">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${gate3}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Deal</p>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #10B981">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${finished}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Complete</p>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #EF4444">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${rejected}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Rejected</p>
                    </div>
                    <div class="glass" style="padding:2.2rem; border-radius:24px; border-bottom:6px solid #64748B">
                        <h2 style="font-size:2.5rem; color:var(--primary-color)">${draft}</h2>
                        <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-transform:uppercase; margin-top:0.5rem">Bản nháp</p>
                    </div>
                </div>
            </div>`;
            }
        }
