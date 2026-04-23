/**
 * FORMSERVICE.JS - QUẢN LÝ CẤU HÌNH FORM ĐỘNG (MOCK)
 */

const DEFAULT_FIELDS = [
    { id: 'f1', label: 'Tên mặt bằng', type: 'text', placeholder: 'KFC Nguyễn Huệ...', required: true, is_active: true },
    { id: 'f2', label: 'Mô tả kết cấu', type: 'textarea', placeholder: 'Dài x Rộng, Số tầng, Lối đi riêng...', required: true, is_active: true },
    { id: 'f3', label: 'Giá thuê mong muốn', type: 'number', placeholder: 'VNĐ...', required: true, is_active: true },
    { id: 'f4', label: 'Hình ảnh mặt tiền', type: 'image', required: true, is_active: true }
];

class FormService {
    constructor() {
        const stored = localStorage.getItem('site_poc_form_schema');
        this.fields = stored ? JSON.parse(stored) : DEFAULT_FIELDS;
    }

    getFields(onlyActive = true) {
        return onlyActive ? this.fields.filter(f => f.is_active) : this.fields;
    }

    updateField(id, newData) {
        this.fields = this.fields.map(f => f.id === id ? { ...f, ...newData } : f);
        this.save();
    }

    addField(field) {
        const newField = { id: 'f' + Date.now(), is_active: true, ...field };
        this.fields.push(newField);
        this.save();
    }

    // Soft delete: Chỉ ẩn đi để bảo toàn dữ liệu cũ trong Database
    removeField(id) {
        this.fields = this.fields.map(f => f.id === id ? { ...f, is_active: false } : f);
        this.save();
    }

    save() {
        localStorage.setItem('site_poc_form_schema', JSON.stringify(this.fields));
    }

    reset() {
        this.fields = DEFAULT_FIELDS;
        this.save();
    }
}

export const formService = new FormService();
