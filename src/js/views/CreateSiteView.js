import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const CreateSiteView = {
            render: async () => {
                const fs = (await FormService.getFields());
                let ex = null;
                if (window.currentId) {
                    const site = (await SiteService.getSites()).find(s => s.id === window.currentId);
                    if (window.editingV2 && site && site.v2_data) {
                        ex = { ...site, answers: site.v2_data };
                    } else {
                        ex = site;
                    }
                }

                setTimeout(() => {
                    if (ex && ex.thumb && !ex.thumb.includes('unsplash.com')) {
                        const pi = document.getElementById('p-img');
                        if (pi) {
                            pi.src = ex.thumb;
                            document.getElementById('p-ui').style.display = 'block';
                            document.getElementById('h-ui').style.display = 'none';
                            window.lastB64 = ex.thumb;
                        }
                    } else {
                        window.lastB64 = null;
                    }
                    if (ex && ex.inner_images && ex.inner_images.length > 0) {
                        window.currentInnerImages = [...ex.inner_images];
                        const prv = document.getElementById('multi-preview');
                        if (prv) prv.innerHTML = window.currentInnerImages.map(img => `<img src="${img}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #ddd;">`).join('');
                    } else {
                        window.currentInnerImages = [];
                    }
                }, 50);

                return `
                    <div class="animate-fade-in" style="max-width:850px; margin: 0 auto;">
                        <h1 style="margin-bottom:2rem; font-family:var(--font-heading)">✍️ Soạn thảo hồ sơ mặt bằng</h1>
                        <form class="glass" onsubmit="event.preventDefault(); window.save(window.editingV2 ? 'UPDATE_V2' : 'SUBMITTED');" style="padding:4rem; border-radius:24px; display:flex; flex-direction:column; gap:2rem;">
                            ${window.editingV2 ? '<div style="background:#FEF3C7; color:#B45309; padding:1rem; border-radius:12px; font-weight:700; text-align:center">⚠� ĐANG CHỈNH SỬA VERSION 2 (DEAL DATA)</div>' : ''}
                            
                            ${(store.getState().user.role === 'ADMIN' && !window.editingV2) ? `
                                <div class="form-group">
                                    <label style="display:block; font-weight:700; margin-bottom:0.8rem; color:var(--primary-color);">Vùng miền (Dành cho Admin) <span style="color:red">*</span></label>
                                    <select id="admin-region" style="width:100%; padding:1.2rem; border-radius:14px; border:1px solid var(--border-glass); background:#EFF6FF; font-size:1rem; font-family:inherit; font-weight:700; border:2px solid var(--accent-blue);">
                                        <option value="NORTH" ${ex?.region === 'NORTH' ? 'selected' : ''}>Miền Bắc</option>
                                        <option value="SOUTH" ${ex?.region === 'SOUTH' ? 'selected' : '' || (!ex ? 'selected' : '')}>Miền Nam</option>
                                    </select>
                                </div>
                            ` : ''}
                            
                            ${fs.map(f => {
                    let v = '';
                    if (ex && ex.answers && ex.answers[f.id]) v = ex.answers[f.id];
                    else if (ex && f.id === 'f1') v = ex.name;
                    else if (ex && f.id === 'f2_2') v = ex.price;

                    return `<div class="form-group">
                                    <label style="display:block; font-weight:700; margin-bottom:0.8rem; color:var(--primary-color);">${f.label} ${f.req ? '<span style="color:red">*</span>' : ''}</label>
                                    ${f.type === 'textarea' ?
                            `<textarea id="${f.id}" rows="3" placeholder="Nhập ${f.label}..." style="width:100%; padding:1.2rem; border-radius:14px; border:1px solid var(--border-glass); background:#F8FAFC; font-size:1rem; font-family:inherit; resize:vertical;">${v}</textarea>`
                            : (f.type === 'select' ?
                                `<select id="${f.id}" style="width:100%; padding:1.2rem; border-radius:14px; border:1px solid var(--border-glass); background:#F8FAFC; font-size:1rem; font-family:inherit;"><option value="">-- Chọn --</option>${(f.options || []).map(o => `<option value="${o}" ${v === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`
                                : (f.type === 'checkboxes' ?
                                    `<div id="${f.id}" class="checkbox-group" style="display:flex; gap:15px; flex-wrap:wrap; padding:0.5rem 0;">${(f.options || []).map(o => `<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:1rem;"><input type="checkbox" name="${f.id}" value="${o}" ${(v || '').includes(o) ? 'checked' : ''} style="width:18px;height:18px; cursor:pointer;">${o}</label>`).join('')}</div>`
                                    : `<input id="${f.id}" type="${f.type}" value="${v}" placeholder="Nhập ${f.label}..." style="width:100%; padding:1.2rem; border-radius:14px; border:1px solid var(--border-glass); background:#F8FAFC; font-size:1rem;">`))}
                                </div>`;
                }).join('')}

                            <div class="form-group">
                                <label style="display:block; font-weight:700; margin-bottom:0.8rem; color:var(--primary-color);">Ảnh mặt tiền thật (1 ảnh Thumbnail)</label>
                                <div class="glass" style="border:2px dashed #CBD5E1; border-radius:20px; padding:3.5rem; text-align:center; cursor:pointer; background:#F8FAFC; transition:all 0.3s;" onclick="document.getElementById('input-fp').click()" onmouseover="this.style.borderColor='var(--accent-blue)'; this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#CBD5E1'; this.style.background='#F8FAFC'">
                                    <input id="input-fp" type="file" accept="image/*" style="display:none" onchange="window.prev(this)">
                                    <div id="p-ui" style="display:none"><img id="p-img" style="width:100%; border-radius:16px; max-height:450px; object-fit:cover; box-shadow:var(--shadow-soft);"></div>
                                    <div id="h-ui"><span style="font-size:3.5rem">📸</span><p style="margin-top:1.2rem; font-weight:600; color:var(--accent-blue);">Bấm vào đây để tải ảnh mặt tiền</p><p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.5rem;">(Bắt buộc)</p></div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label style="display:block; font-weight:700; margin-bottom:0.8rem; color:var(--primary-color);">Hình ảnh mặt bằng bên trong (Nhiều ảnh)</label>
                                <div style="background:#F8FAFC; padding:1.5rem; border-radius:20px; border:1px solid var(--border-glass);">
                                    <input id="inner-images" type="file" multiple accept="image/*" style="width:100%; padding:0.8rem; background:white; border-radius:10px; border:1px solid #ddd; cursor:pointer;" onchange="window.prevMulti(this)">
                                    <div id="multi-preview" style="display:flex; gap:10px; margin-top:1rem; flex-wrap:wrap;"></div>
                                </div>
                            </div>
                            
                            <hr style="border:none; border-top:1px solid var(--border-glass); margin:1rem 0;">

                            <div style="display:flex; justify-content:flex-end; gap:16px;">
                                <button type="button" class="btn-ghost" style="padding:1rem 2rem; border-radius:14px; background:#F1F5F9; border:none; color:#333;" onclick="window.save('DRAFT')">💾 Lưu lại Bản Nháp</button>
                                <button type="button" class="btn-primary" style="padding:1rem 2.5rem; border-radius:14px; font-size:1.05rem;" onclick="window.save(window.editingV2 ? 'UPDATE_V2' : 'SUBMITTED')">🚀 ${window.editingV2 ? 'Cập nhật Version 2' : 'Nộp Hồ Sơ Ngay'}</button>
                            </div>
                        </form>
                    </div>`;
            }
        }
