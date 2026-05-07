import { SiteService, STATUS_LABELS } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const DetailView = {
    render: async () => {
        const u = store.getState().user;
        const params = new URLSearchParams(location.hash.split('?')[1]);
        const id = params.get('id');
        const sites = await SiteService.getSites();
        const site = sites.find(s => s.id === id);
        if (!site) return '<h1>Không tìm thấy hồ sơ</h1>';

        const isMasked = (u.role === 'PROJECT' || (site.status === 'FINISH' && u.role !== 'ADMIN') || (site.status === 'REJECTED' && u.role !== 'ADMIN'));

        // Versioning logic via URL
        const isViewV1 = params.get('v') === '1';
        const hasV2 = !!site.v2_data;
        const showV2 = hasV2 && !isViewV1;
        const data = showV2 ? site.v2_data : (site.answers || {});

        const fields = await FormService.getFields();

        return `
            <div class="animate-fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem">
                    <div>
                        <h1 style="margin-bottom:0.4rem">Chi tiết: ${data.f1 || site.name}</h1>
                        <div style="display:flex; gap:10px; align-items:center">
                            <span class="status-pill status-${site.status}" style="font-size:0.9rem; padding:0.4rem 1.2rem">${STATUS_LABELS[site.status]}</span>
                            ${hasV2 ? `
                                <button class="btn-ghost" style="padding:4px 12px; font-size:0.75rem; border-color:var(--accent-blue); color:var(--accent-blue)" onclick="location.hash='#detail?id=${site.id}${showV2 ? '&v=1' : ''}'">
                                    ${showV2 ? '👁️ Xem Version gốc (V1)' : '👁️ Xem bản chốt Deal (V2)'}
                                </button>
                                ${(showV2 && u.role === 'ADMIN') ? `
                                    <button class="btn-ghost" style="padding:4px 12px; font-size:0.75rem; background:var(--accent-blue); color:white; border:none" onclick="window.editV2('${site.id}')">✍️ Sửa Version 2</button>
                                ` : ''}
                            ` : ''}
                        </div>
                    </div>
                    <div style="text-align:right">
                        <div style="display:flex; gap:10px; margin-bottom:10px; justify-content:flex-end">
                            <button class="btn-ghost" style="font-size:0.8rem; background:white" onclick="window.printDetail('${site.id}')">🖨️ Xuất PDF Chi tiết</button>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700">VERSION ĐANG XEM</div>
                        <div style="font-size:1.2rem; font-weight:800; color:var(--accent-blue)">${showV2 ? 'VERSION 2 (DEAL)' : 'VERSION 1 (ORIGINAL)'}</div>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 380px; gap:2rem">
                    <!-- Main Info -->
                    <div class="glass" style="padding:2.5rem; border-radius:28px">
                        <img src="${site.thumb}" style="width:100%; border-radius:18px; margin-bottom:2rem; box-shadow:var(--shadow-soft); cursor:pointer" onclick="window.openSiteLightbox('${site.id}', 0)">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem">
                            ${fields.map(f => {
                                const v = data[f.id] || (f.id === 'f1' ? site.name : (f.id === 'f2_2' ? site.price : ''));
                                if (!v && !f.req) return '';

                                // Masking logic
                                const isFinancial = ['f2_1', 'f2_2', 'f7', 'f8'].includes(f.id);
                                const hideMask = (u.role === 'PROJECT') || (site.status === 'FINISH' && u.role !== 'ADMIN') || (site.status === 'REJECTED' && u.role !== 'ADMIN');
                                const displayValue = (isFinancial && hideMask) ? '*******' : ((f.num && v && !isNaN(parseFloat(v.toString().replace(/,/g, '')))) ? parseFloat(v.toString().replace(/,/g, '')).toLocaleString('en-US') : (v || '---'));

                                return `<div ${f.type === 'textarea' ? 'style="grid-column: 1/span 2"' : ''}><label style="color:var(--text-muted); font-size:0.7rem; font-weight:700">${f.label.toUpperCase()}</label><p style="font-size:1rem; font-weight:600; margin-top:0.3rem; word-break:break-word; line-height:1.5">${f.id === 'f3' && v ? `<a href="${v}" target="_blank">📍 Mở Bản Đồ</a>` : displayValue}</p></div>`;
                            }).join('')}
                        </div>
                        ${site.inner_images && site.inner_images.length > 0 ? `
                            <div style="margin-top:2.5rem">
                                <label style="color:var(--text-muted); font-size:0.85rem; font-weight:700; margin-bottom:1rem; display:block">📸 HÌNH ẢNH MẶT BẰNG BÊN TRONG</label>
                                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1rem;">
                                    ${site.inner_images.map((img, idx) => `<img src="${img}" style="width:100%; height:120px; object-fit:cover; border-radius:12px; cursor:pointer; border:1px solid #ddd" onclick="window.openSiteLightbox('${site.id}', ${idx + 1})">`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${(u.role === 'MB' && site.status !== 'DRAFT' && site.status !== 'FINISH' && site.status !== 'REJECTED') ? `
                            <div style="margin-top:2rem; padding:1.5rem; background:#F8FAFC; border-radius:14px; border:1px solid #eee; display:flex; justify-content:space-between; align-items:center">
                                <div>💡 <strong>Hồ sơ đang khóa.</strong> Cần sửa dữ liệu?</div>
                                <button class="btn-ghost" style="background:var(--accent-azure); color:white; border:none" onclick="window.reqEdit('${site.id}')">Gửi yêu cầu sửa</button>
                            </div>
                        ` : ''}

                        ${(u.role === 'ADMIN') ? `
                            <div style="margin-top:2rem; padding:1.5rem; background:#EFF6FF; border-radius:14px; border:1px solid #DBEAFE; display:flex; justify-content:space-between; align-items:center">
                                <div>🛡️ <strong>Admin Control:</strong> Trao quyền sửa cho MB hoặc tự chỉnh sửa?</div>
                                <div style="display:flex; gap:10px">
                                    <button class="btn-ghost" style="background:#2563EB; color:white; border:none" onclick="location.hash='#create?id=${site.id}'">✍️ Chỉnh sửa hồ sơ</button>
                                    ${site.status !== 'DRAFT' ? `<button class="btn-ghost" style="background:#059669; color:white; border:none" onclick="window.unlock('${site.id}')">🔓 Mở khóa cho MB</button>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Sidebar: Discussion & Approval -->
                    <div class="detail-sidebar glass" style="padding:1.5rem; border-radius:28px; display:flex; flex-direction:column">
                        <h3 style="margin-bottom:1.2rem">Phê duyệt & Thảo luận</h3>
                        
                        <!-- MPSA Section -->
                        <div style="padding:1rem; background:white; border:1px solid #eee; border-radius:14px; margin-bottom:1.2rem">
                            <label style="font-size:0.7rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:0.5rem">MPSA ESTIMATE</label>
                            <div style="font-size:1.2rem; font-weight:800; color:var(--accent-blue); margin-bottom:0.5rem">
                                ${isMasked ? '*******' : (site.current_mpsa ? parseFloat(site.current_mpsa).toLocaleString('en-US') + ' đ' : '---')}
                            </div>
                            ${(() => {
                                if (isMasked) return '';
                                const pTax = parseFloat((data['f2_2'] || '').toString().replace(/,/g, '')) || 0;
                                const mpsa = parseFloat(site.current_mpsa) || 0;
                                if (mpsa > 0 && pTax > 0) {
                                    const ratio = (pTax / mpsa).toLocaleString('en-US', { maximumFractionDigits: 2 });
                                    return `<div style="font-size:0.85rem; font-weight:700; color:#059669; background:#ECFDF5; padding:6px 10px; border-radius:8px; margin-bottom:0.8rem; display:inline-block; border: 1px solid #A7F3D0">📈 Giá thuê có thuế / MPSA: ${ratio}</div>`;
                                }
                                return '';
                            })()}
                            ${u.role === 'ADMIN' ? `
                                <button class="btn-ghost" style="width:100%; font-size:0.75rem; padding:6px" onclick="window.mpsaPrompt('${site.id}')">Update MPSA</button>
                            ` : ''}
                        </div>

                         ${(u.role === 'ADMIN' || u.role === 'MB') ? `
                            <div style="padding:1rem; background:#EFF6FF; border-radius:14px; margin-bottom:1.2rem">
                                <label style="font-size:0.7rem; font-weight:700; display:block; margin-bottom:0.8rem">CẬP NHẬT TRẠNG THÁI</label>
                                <div style="display:flex; flex-wrap:wrap; gap:6px">
                                    <button onclick="window.upStatus('${site.id}','GATE1')" class="btn-ghost" style="font-size:0.7rem; background:#F3E8FF; color:#7E22CE; transition:0.3s; opacity:${site.status === 'GATE1' ? '1' : '0.35'}">👷 Survey</button>
                                    <button onclick="window.upStatus('${site.id}','GATE2')" class="btn-ghost" style="font-size:0.7rem; background:#DBEAFE; color:#1E40AF; transition:0.3s; opacity:${site.status === 'GATE2' ? '1' : '0.35'}">📦 Sitepack</button>
                                    <button onclick="window.upStatus('${site.id}','GATE3')" class="btn-ghost" style="font-size:0.7rem; background:#FEF3C7; color:#B45309; transition:0.3s; opacity:${site.status === 'GATE3' ? '1' : '0.35'}">🤝 Deal</button>
                                    <button onclick="window.upStatus('${site.id}','FINISH')" class="btn-ghost" style="font-size:0.7rem; background:#DCFCE7; color:#15803D; transition:0.3s; opacity:${site.status === 'FINISH' ? '1' : '0.35'}">🏆 Complete</button>
                                    <button onclick="window.upStatus('${site.id}','REJECTED')" class="btn-ghost" style="font-size:0.7rem; background:#FEE2E2; color:#DC2626; transition:0.3s; opacity:${site.status === 'REJECTED' ? '1' : '0.35'}">❌ Rejected</button>
                                    ${u.role === 'ADMIN' && site.status === 'GATE3' ? `
                                        <button onclick="window.ver2('${site.id}')" class="btn-ghost" style="font-size:0.7rem; background:#fff; border-color:var(--accent-azure); color:var(--accent-azure)">⭐ Create V2</button>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                        <div id="comments-box" style="flex:1; overflow-y:auto; margin-bottom:1.2rem">
                            ${(site.comments || []).map(c => {
                                let cStyle = 'background:#eee; color:#666;';
                                if (c.stage === 'SUBMITTED') cStyle = 'background:#E0F2FE; color:#0369A1;';
                                if (c.stage === 'GATE1') cStyle = 'background:#F3E8FF; color:#7E22CE;';
                                if (c.stage === 'GATE2') cStyle = 'background:#DBEAFE; color:#1E40AF;';
                                if (c.stage === 'GATE3') cStyle = 'background:#FEF3C7; color:#B45309;';
                                if (c.stage === 'FINISH') cStyle = 'background:#DCFCE7; color:#15803D;';
                                if (c.stage === 'REJECTED') cStyle = 'background:#FEE2E2; color:#DC2626;';

                                return `
                                    <div class="comment-item" style="position:relative">
                                        ${c.stage ? `<span style="position:absolute; top:8px; right:8px; font-size:0.6rem; font-weight:800; ${cStyle} padding:2px 6px; border-radius:4px;">${STATUS_LABELS[c.stage]}</span>` : ''}
                                        <strong>${c.author}</strong> <small style="display:block; color:#999; font-size:0.7rem">${new Date(c.date).toLocaleString()}</small>
                                        <p style="margin-top:5px; font-size:0.85rem">${c.text}</p>
                                    </div>`;
                            }).join('')}
                            ${(!site.comments || site.comments.length === 0) ? '<p style="text-align:center; color:#ccc">Chưa có bình luận.</p>' : ''}
                        </div>
                        <div>
                            <textarea id="msg" style="width:100%; border-radius:12px; padding:0.8rem; border:1px solid #ddd; margin-bottom:0.8rem" placeholder="Viết nhận xét..."></textarea>
                            <button class="btn-primary" style="width:100%" onclick="window.doComment('${site.id}')">Gửi nhận xét</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }
};
