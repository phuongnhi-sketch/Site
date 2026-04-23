/**
 * SITEDETAILVIEW.JS - CHI TIẾT HỒ SƠ & PHÊ DUYỆT
 */

import { SiteService } from '../services/siteService.js';
import { formService } from '../services/formService.js';
import { store } from '../store.js';

export const SiteDetailView = {
    render: async () => {
        const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const id = queryParams.get('id');
        const { user } = store.getState();
        
        const sites = SiteService.getSites();
        const site = sites.find(s => s.id === id);

        if (!site) {
            return `<div class="error-page"><h1>Không tìm thấy hồ sơ</h1><button onclick="window.history.back()">Quay lại</button></div>`;
        }

        const fields = formService.getFields();
        const comments = site.comments || [];

        return `
            <div class="site-detail-page animate-fade-in">
                <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h1>Chi tiết hồ sơ: ${site.site_name}</h1>
                        <p>${site.address || ''} | Khu vực: ${site.region}</p>
                    </div>
                    <div class="status-badge-large status-${site.status}">
                        ${site.status}
                    </div>
                </div>

                <div class="detail-grid" style="display:grid; grid-template-columns: 1fr 350px; gap:2rem; margin-top:2rem;">
                    <!-- Cột trái: Thông tin & Ảnh -->
                    <div class="detail-main glass" style="padding:2.5rem; border-radius:var(--radius-lg);">
                        <div class="image-gallery" style="margin-bottom:2rem;">
                            <img src="${site.thumbnail || (site.answers && site.answers['f4']) || ''}" alt="Facade" style="width:100%; border-radius:var(--radius-md); box-shadow:var(--shadow-md);">
                        </div>
                        
                        <div class="info-section">
                            <h3 style="margin-bottom:1.5rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;">Thông tin chi tiết</h3>
                            <div class="info-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
                                ${fields.map(f => {
                                    if (f.type === 'image') return '';
                                    const value = site.answers ? site.answers[f.id] : site[f.id === 'f1' ? 'site_name' : (f.id === 'f2' ? 'rent_price' : '')];
                                    return `
                                        <div class="info-item">
                                            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">${f.label}</div>
                                            <div style="font-weight:600; font-size:1.1rem; margin-top:0.2rem;">
                                                ${f.type === 'number' && typeof value === 'number' ? value.toLocaleString() + ' đ' : (value || '---')}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        ${(user.role === 'MB' && site.status !== 'DRAFT') ? `
                            <div style="margin-top:2.5rem; padding:1.5rem; background:#F1F5F9; border-radius:12px; display:flex; align-items:center; justify-content:space-between;">
                                <div><strong>Hồ sơ đang bị khóa.</strong> Nếu cần chỉnh sửa, hãy gửi yêu cầu tới Admin.</div>
                                <button class="btn btn-sm" style="background:var(--accent-azure); color:white;" onclick="window.requestUnlock('${site.id}')">Gửi yêu cầu sửa</button>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Cột phải: Bình luận & Phê duyệt -->
                    <div class="detail-sidebar">
                        <div class="glass" style="padding:1.5rem; border-radius:var(--radius-md); height: 100%; display:flex; flex-direction:column;">
                            <h3 style="margin-bottom:1.2rem;">Luồng phê duyệt</h3>
                            
                            <!-- Status Controller (Admin/BOD only) -->
                            ${(user.role === 'ADMIN' || user.role === 'BOD') ? `
                                <div class="status-controller" style="margin-bottom:2rem; padding:1.2rem; background:#EFF6FF; border-radius:12px;">
                                    <label style="font-size:0.75rem; font-weight:700; display:block; margin-bottom:0.8rem;">CẬP NHẬT TRẠNG THÁI</label>
                                    <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                                        <button class="btn btn-sm" style="background:#FEF3C7; color:#B45309;" onclick="window.changeStatus('${site.id}', 'UNDER_REVIEW')">📌 Review</button>
                                        <button class="btn btn-sm" style="background:#EDE9FE; color:#6D28D9;" onclick="window.changeStatus('${site.id}', 'SURVEY')">🔍 Khảo sát</button>
                                        <button class="btn btn-sm" style="background:#DCFCE7; color:#15803D;" onclick="window.changeStatus('${site.id}', 'COMPLETED')">✅ Xong</button>
                                        <button class="btn btn-sm" style="background:#FEE2E2; color:#B91C1C;" onclick="window.changeStatus('${site.id}', 'REJECTED')">❌ Từ chối</button>
                                    </div>
                                </div>
                            ` : ''}

                            <div class="comments-list" style="flex:1; overflow-y:auto; margin-bottom:1.5rem;">
                                ${comments.length === 0 ? '<p style="color:var(--text-muted); text-align:center; font-style:italic;">Chưa có bình luận nào.</p>' : 
                                    comments.map(c => `
                                        <div class="comment-item" style="margin-bottom:1.2rem; padding-bottom:0.8rem; border-bottom:1px solid #f1f1f1;">
                                            <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                                                <span style="font-weight:700; font-size:0.85rem;">${c.author}</span>
                                                <span style="font-size:0.7rem; color:var(--text-muted);">${new Date(c.date).toLocaleDateString()}</span>
                                            </div>
                                            <div style="font-size:0.9rem; line-height:1.5;">${c.text}</div>
                                        </div>
                                    `).join('')}
                            </div>

                            <div class="comment-form">
                                <textarea id="comment-text" placeholder="Viết nhận xét..." style="width:100%; border-radius:10px; padding:0.8rem; border:1px solid #ddd; margin-bottom:0.8rem;"></textarea>
                                <button class="btn btn-primary" style="width:100%;" onclick="window.postComment('${site.id}')">Gửi nhận xét</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        window.postComment = (id) => {
            const text = document.getElementById('comment-text').value;
            if (!text) return;
            const { user } = store.getState();
            SiteService.addComment(id, text, user.name);
            window.location.reload();
        };

        window.changeStatus = (id, status) => {
            if (confirm(`Bạn muốn chuyển trạng thái hồ sơ sang ${status}?`)) {
                SiteService.updateStatus(id, status);
                window.location.reload();
            }
        };

        window.requestUnlock = (id) => {
            const reason = prompt('Vui lòng nhập lý do muốn chỉnh sửa:');
            if (reason) {
                const { user } = store.getState();
                SiteService.addComment(id, `YÊU CẦU MỞ KHÓA: ${reason}`, user.name);
                alert('Đã gửi yêu cầu tới Admin!');
            }
        };
    }
};
