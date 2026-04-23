/**
 * ADMINSETTINGSVIEW.JS - CẤU HÌNH TRƯỜNG THÔNG TIN FORM
 */

import { formService } from '../services/formService.js';

export const AdminSettingsView = {
    render: async () => {
        const fields = formService.getFields(false); // Lấy tất cả, kể cả đã ẩn
        
        const fieldsHtml = fields.map(field => `
            <div class="setting-item glass shadow-soft animate-fade-in ${!field.is_active ? 'inactive-field' : ''}" style="${!field.is_active ? 'opacity:0.6; background:#F1F5F9' : ''}">
                <div class="setting-info">
                    <span class="setting-label">
                        ${!field.is_active ? '<span style="color:#64748B">[Đã ẩn] </span>' : ''}
                        ${field.label} ${field.required ? '<span style="color:red">*</span>' : ''}
                    </span>
                    <span class="setting-type">${field.type}</span>
                </div>
                <div class="setting-actions" style="display:flex; gap:10px">
                    ${field.is_active ? `
                        <button class="btn btn-sm glass-glow edit-field-btn" data-id="${field.id}" style="padding:0.5rem; background:#F1F5F9">✏️ Sửa</button>
                        <button class="btn btn-sm glass-glow delete-field-btn" data-id="${field.id}" style="padding:0.5rem; background:#FFF1F2; color:#E11D48">🗑️ Ẩn</button>
                    ` : `
                        <button class="btn btn-sm glass-glow restore-field-btn" data-id="${field.id}" style="padding:0.5rem; background:#DCFCE7; color:#15803D">🔄 Khôi phục</button>
                    `}
                </div>
            </div>
        `).join('');

        return `
            <div class="settings-page animate-fade-in">
                <div class="page-header" style="display:flex; justify-content:space-between; align-items:center">
                    <div>
                        <h1>Cấu hình hệ thống</h1>
                        <p>Tùy chỉnh các câu hỏi và trường dữ liệu cho Form nhập liệu chi tiết.</p>
                    </div>
                    <button id="add-field-btn" class="btn btn-primary" style="width:auto; padding:0 20px">+ Thêm câu hỏi mới</button>
                </div>

                <div class="settings-content" style="max-width: 800px; margin-top:2rem">
                    <h3 style="margin-bottom:1.5rem">Danh sách các trường hiện tại</h3>
                    <div id="fields-list">
                        ${fieldsHtml}
                    </div>
                    
                    <div style="margin-top:2rem; padding:1.5rem; background:rgba(37,99,235,0.05); border-radius:12px; border: 1px dashed var(--accent-blue)">
                        <p style="font-size:0.9rem; color:var(--accent-blue)">💡 <strong>Mẹo:</strong> Chị Nhi có thể sửa tên nhãn của các câu hỏi. Sau khi Sửa, nhân viên MB khi nộp hồ sơ sẽ thấy các câu hỏi mới này ngay lập tức.</p>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        // Xử lý Sửa câu hỏi (Giả lập cho POC)
        document.querySelectorAll('.edit-field-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const newLabel = prompt('Nhập tên nhãn mới cho câu hỏi này:');
                if (newLabel) {
                    const newType = prompt('Chọn định dạng (text, number, image):', 'text');
                    formService.updateField(id, { label: newLabel, type: newType || 'text' });
                    window.location.reload();
                }
            };
        });

        // Xử lý Thêm câu hỏi mới (Giả lập)
        const addBtn = document.getElementById('add-field-btn');
        if (addBtn) {
            addBtn.onclick = () => {
                const label = prompt('Nhập tên câu hỏi muốn thêm:');
                if (label) {
                    const type = prompt('Chọn định dạng (text, number, image):', 'text');
                    formService.addField({ label, type: type || 'text', required: false });
                    window.location.reload();
                }
            };
        }

        // Xử lý Xóa/Ẩn
        document.querySelectorAll('.delete-field-btn').forEach(btn => {
            btn.onclick = () => {
                if (confirm('Chị có chắc muốn ẩn câu hỏi này không? (Dữ liệu cũ vẫn sẽ được giữ nguyên)')) {
                    formService.removeField(btn.dataset.id);
                    window.location.reload();
                }
            };
        });

        // Xử lý Khôi phục
        document.querySelectorAll('.restore-field-btn').forEach(btn => {
            btn.onclick = () => {
                formService.updateField(btn.dataset.id, { is_active: true });
                window.location.reload();
            };
        });
    }
};
