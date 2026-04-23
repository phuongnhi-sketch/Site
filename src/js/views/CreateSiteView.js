/**
 * CREATESITEVIEW.JS - FORM NHẬP LIỆU CHI TIẾT (ĐỘNG)
 */

import { formService } from '../services/formService.js';

export const CreateSiteView = {
    render: async () => {
        const fields = formService.getFields();
        
        const fieldsHtml = fields.map(field => {
            let inputHtml = '';
            
            switch (field.type) {
                case 'textarea':
                    inputHtml = `<textarea id="${field.id}" class="textarea-field" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`;
                    break;
                case 'select':
                    const options = field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
                    inputHtml = `
                        <select id="${field.id}" class="select-field" ${field.required ? 'required' : ''}>
                            <option value="">-- Chọn một tùy chọn --</option>
                            ${options}
                        </select>
                    `;
                    break;
                case 'image':
                    inputHtml = `
                        <div class="image-upload-wrapper" onclick="this.querySelector('input').click()">
                            <input type="file" accept="image/*" style="display:none" onchange="window.previewImage(this)">
                            <div class="preview-container" style="display:none; width:100%">
                                <img src="" style="width:100%; border-radius:12px; object-fit:cover; max-height:300px">
                                <p style="margin-top:10px; color:var(--accent-blue)">✨ Nhấn để thay đổi ảnh</p>
                            </div>
                            <div class="placeholder-container">
                                <span style="font-size: 2rem">📸</span>
                                <p style="margin-top: 10px; color: var(--text-muted)">Nhấn để tải ảnh mặt tiền lên</p>
                            </div>
                        </div>
                    `;
                    break;
                default:
                    inputHtml = `<input type="${field.type}" id="${field.id}" class="input-field" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
            }

            return `
                <div class="form-group ${field.type === 'textarea' || field.type === 'image' ? 'full-width' : ''} animate-fade-in">
                    <label for="${field.id}">${field.label} ${field.required ? '<span style="color:red">*</span>' : ''}</label>
                    ${inputHtml}
                </div>
            `;
        }).join('');

        return `
            <div class="create-site-page animate-fade-in">
                <div class="page-header">
                    <h1>Nộp hồ sơ mặt bằng mới</h1>
                    <p>Nhân viên MB vui lòng nhập đầy đủ và chính xác các thông tin chi tiết dưới đây.</p>
                </div>

                <div class="form-card glass shadow-soft" style="margin-top: 2rem">
                    <form id="create-site-form">
                        <div class="form-grid">
                            ${fieldsHtml}
                        </div>
                        
                        <div style="margin-top: 2.5rem; display: flex; gap: 1rem; justify-content: flex-end">
                            <button type="button" class="btn glass-glow" style="padding:0.8rem 2rem; background:#F1F5F9" onclick="history.back()">Hủy bỏ</button>
                            <button type="button" id="save-draft-btn" class="btn glass-glow" style="padding:0.8rem 2rem; background:#E2E8F0; width: auto">Lưu nháp</button>
                            <button type="submit" class="btn btn-primary" style="padding:0.8rem 3rem; width: auto">Nộp hồ sơ ngay</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const editId = queryParams.get('id');

        window.previewImage = async (input) => {
            const wrapper = input.parentElement;
            const preview = wrapper.querySelector('.preview-container');
            const placeholder = wrapper.querySelector('.placeholder-container');
            const img = preview.querySelector('img');
            
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                    // Lưu Base64 vào dataset để handleSubmit lấy
                    preview.dataset.base64 = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        // Load dữ liệu nếu đang sửa
        if (editId) {
            import('../services/siteService.js').then(({ SiteService }) => {
                const site = SiteService.getSites().find(s => s.id === editId);
                if (site && site.answers) {
                    Object.keys(site.answers).forEach(key => {
                        const el = document.getElementById(key);
                        if (el) el.value = site.answers[key];
                        // Xử lý hiển thị ảnh cũ
                        if (site.answers[key] && site.answers[key].startsWith('data:image')) {
                            const wrapper = el.parentElement;
                            const preview = wrapper.querySelector('.preview-container');
                            const placeholder = wrapper.querySelector('.placeholder-container');
                            const img = preview.querySelector('img');
                            if (img) {
                                img.src = site.answers[key];
                                preview.style.display = 'block';
                                placeholder.style.display = 'none';
                                preview.dataset.base64 = site.answers[key];
                            }
                        }
                    });
                }
            });
        }

        const form = document.getElementById('create-site-form');
        const draftBtn = document.getElementById('save-draft-btn');

        const handleSubmit = (status) => {
            const fields = formService.getFields();
            const answers = {};
            let uploadedImage = null;

            fields.forEach(f => {
                const el = document.getElementById(f.id);
                if (el) {
                    if (f.type === 'image') {
                        const preview = el.parentElement.querySelector('.preview-container');
                        answers[f.id] = preview.dataset.base64 || '';
                        uploadedImage = preview.dataset.base64 || null;
                    } else {
                        answers[f.id] = el.value;
                    }
                }
            });

            // Ghép dữ liệu chuẩn để SiteService lưu
            const siteData = {
                id: editId || undefined,
                site_code: status === 'SUBMITTED' ? (editId ? undefined : `MB-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`) : 'Hồ sơ nháp',
                site_name: answers['f1'] || 'Mặt bằng chưa đặt tên',
                thumbnail: uploadedImage || 'https://images.unsplash.com/photo-1582410118839-959c86940d99?w=200&h=200&fit=crop',
                address: answers['f2'] || 'Đang cập nhật',
                region: 'NORTH', 
                status: status,
                answers: answers
            };

            import('../services/siteService.js').then(({ SiteService }) => {
                SiteService.saveSite(siteData);
                alert(status === 'DRAFT' ? 'Đã lưu bản nháp thành công!' : 'Hồ sơ đã được gửi thành công!');
                window.location.hash = 'sites';
            });
        };

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                handleSubmit('SUBMITTED');
            };
        }

        if (draftBtn) {
            draftBtn.onclick = () => handleSubmit('DRAFT');
        }
    }
};
