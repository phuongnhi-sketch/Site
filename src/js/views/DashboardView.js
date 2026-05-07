import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const DashboardView = {
    render: async () => {
        window.printSelected = async () => {
            const u = store.getState().user;
            let selectedIds = Array.from(document.querySelectorAll('.site-checkbox:checked')).map(cb => cb.dataset.id);
            if (selectedIds.length === 0) {
                selectedIds = (await SiteService.getSites()).map(s => s.id);
            }

            const incQA = window.siteFilters?.includeQA;
            const allSites = await SiteService.getSites();
            const fields = await FormService.getFields();

            const win = window.open('', '_blank');
            if (!win) return alert('Trình duyệt đã chặn cửa sổ bật lên (popup). Vui lòng cho phép hiện popup để in báo cáo!');

            win.document.write('<html><head><title>Báo cáo chọn lọc</title>');
            win.document.write('<style>@page { size: auto; margin: 20mm 15mm; } body{font-family:sans-serif;padding:0} .page-break{page-break-after:always; border-bottom:2px dashed #eee; padding-bottom:40px; margin-bottom:40px} .header{display:flex;justify-content:space-between;margin-bottom:20px} .grid{display:grid;grid-template-columns:1fr 1fr;gap:15px} .field label{font-weight:bold;font-size:11px;color:#666;display:block} .field p{margin:3px 0;font-size:13px} .thumb-img{width:350px;border-radius:10px;margin-bottom:15px} .images-grid{display:grid;grid-template-columns:repeat(4, 1fr);gap:8px} .images-grid img{height:100px;width:100%;object-fit:cover;border-radius:8px} .version-tag{background:#2563EB;color:white;padding:4px 10px;border-radius:4px;font-size:11px} h2{color:#2563EB; font-size:1.2rem; margin-top:20px; border-left:4px solid #2563EB; padding-left:10px}</style>');
            win.document.write('</head><body>');

            for (let index = 0; index < selectedIds.length; index++) {
                const id = selectedIds[index];
                const site = allSites.find(s => s.id === id);
                if (!site) continue;

                win.document.write(`<div class="${index < selectedIds.length - 1 ? 'page-break' : ''}">`);
                win.document.write(`<div class="header"><h1>#${index + 1}. ${site.name}</h1><div class="version-tag">Mã: ${site.code}</div></div>`);
                win.document.write(`<img src="${site.thumb}" class="thumb-img">`);

                const renderSection = (data, title) => {
                    const isMasked = (u.role === 'PROJECT' || (site.status === 'FINISH' && u.role !== 'ADMIN') || (site.status === 'REJECTED' && u.role !== 'ADMIN'));
                    win.document.write(`<h2>${title}</h2><div class="grid">`);
                    fields.forEach(f => {
                        let v = data[f.id] || '';
                        if (isMasked && (f.id === 'f2_1' || f.id === 'f2_2' || f.id === 'f7')) v = '*******';
                        let displayVal = v || '---';
                        if (f.num && v && v !== '*******') {
                            const num = parseFloat(v.toString().replace(/,/g, ''));
                            if (!isNaN(num)) displayVal = num.toLocaleString('en-US');
                        }
                        win.document.write(`<div class="field"><label>${f.label}</label><p>${displayVal}</p></div>`);
                    });
                    win.document.write('</div>');
                };

                const verOpt = window.siteFilters?.exportVer || 'BOTH';
                if (verOpt === 'BOTH') {
                    renderSection(site.answers || {}, 'PHIÊN BẢN GỐC (V1)');
                    if (site.v2_data) renderSection(site.v2_data, 'PHIÊN BẢN CHỐT DEAL (V2)');
                } else {
                    const data = site.v2_data || site.answers || {};
                    const title = site.v2_data ? 'PHIÊN BẢN CHỐT DEAL (V2)' : 'PHIÊN BẢN GỐC (V1)';
                    renderSection(data, title);
                }

                if (site.inner_images && site.inner_images.length > 0) {
                    win.document.write('<h3>Hình ảnh chi tiết</h3><div class="images-grid">');
                    site.inner_images.forEach(img => win.document.write(`<img src="${img}">`));
                    win.document.write('</div>');
                }

                if (incQA && site.comments && site.comments.length > 0) {
                    win.document.write('<h3>Lịch sử thảo luận</h3>');
                    site.comments.forEach(c => {
                        win.document.write(`<div style="margin-bottom:8px;padding:8px;background:#f5f5f5;border-radius:6px;font-size:12px"><strong>${c.author}</strong>: ${c.text}</div>`);
                    });
                }
                win.document.write('</div>');
            }
            win.document.write('</body></html>');
            win.document.close();
            win.setTimeout(() => { win.print(); }, 500);
        };

        const u = store.getState().user;
        // Áp dụng bộ lọc phân quyền cho Dashboard
        const ss = (await SiteService.getSites()).filter(s => {
            if (s.status === 'DRAFT') {
                if (u.role === 'ADMIN') return true;
                if (u.role === 'MB') return (s.owner === u.id || s.owner_id === u.id || (s.region === u.region && (!s.owner_id && !s.owner)));
                return false;
            }
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
                    <p style="opacity:0.9; font-weight:500; font-size:1.1rem">Hệ thống Master POC v3.1.8 đang hoạt động ổn định và tối ưu.</p>
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
};
