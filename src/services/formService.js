import { supabase } from './supabaseClient.js';

/**
 * FormService — Quản lý cấu hình form fields qua Supabase.
 */
export const FormService = {
    async getFields(all = false) {
        const INIT_FIELDS = [
            { id: 'f0', label: 'Brand', type: 'checkboxes', options: ['TPC', 'CHANG', 'DQ', 'SW'], is_active: true, req: true },
            { id: 'f1', label: 'Mã mặt bằng', type: 'text', is_active: true, req: true },
            { id: 'f6', label: 'Địa chỉ (Số nhà)', type: 'text', is_active: true, req: true },
            { id: 'f3', label: 'Google map', type: 'text', is_active: true, req: true },
            { id: 'f13', label: 'Bên cho thuê', type: 'select', options: ['Cá nhân', 'Pháp nhân'], is_active: true, req: true },
            { id: 'f2_3', label: 'Bên khai và trả thuế', type: 'select', options: ['Chủ nhà', 'QSR'], is_active: true, req: true },
            { id: 'f14', label: 'Thời hạn thuê (năm)', type: 'text', is_active: true, req: true, num: true },
            { id: 'f2_1', label: 'Giá thuê chưa thuế (VD: 100,000,000)', type: 'text', is_active: true, req: true, num: true },
            { id: 'f2_2', label: 'Giá thuê có thuế (VD: 130,000,000)', type: 'text', is_active: true, req: true, num: true },
            { id: 'f8', label: 'Biên độ tăng giá', type: 'textarea', is_active: true, req: true },
            { id: 'f7', label: 'Cọc - Thanh toán', type: 'textarea', is_active: true, req: true },
            { id: 'f4', label: 'Mặt tiền (m)', type: 'text', is_active: true, req: true, num: true },
            { id: 'f5', label: 'Tổng diện tích cho thuê (m2)', type: 'text', is_active: true, req: true, num: true },
            { id: 'f9', label: 'Mô tả khác (VD: Kết cấu, hiện trạng,..)', type: 'textarea', is_active: true, req: true },
            { id: 'f11', label: 'Điều kiện kỹ thuật', type: 'textarea', is_active: true, req: true },
            { id: 'f10_2', label: 'Ngày nhận nhà', type: 'text', is_active: true, req: true },
            { id: 'f10_1', label: 'Thời gian miễn phí xây dựng', type: 'text', is_active: true, req: true }
        ];

        let query = supabase.from('form_fields').select('*').order('sort_order');
        if (!all) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (error) { 
            console.warn('Supabase not ready, using mock form fields:', error); 
            return all ? INIT_FIELDS : INIT_FIELDS.filter(f => f.is_active);
        }
        
        if (data.length === 0) {
            // Fallback to INIT_FIELDS and try to save them to Supabase
            try { await this.saveFields(INIT_FIELDS); } catch(e){}
            return all ? INIT_FIELDS : INIT_FIELDS.filter(f => f.is_active);
        }

        // Map sang format tương thích với UI hiện tại
        return data.map(f => ({
            id: f.id, label: f.label, type: f.type,
            options: f.options || [], is_active: f.is_active,
            req: f.required, num: f.is_numeric,
        }));
    },

    async saveFields(fields) {
        for (const f of fields) {
            await supabase.from('form_fields').upsert({
                id: f.id, label: f.label, type: f.type,
                options: f.options || [], is_active: f.is_active,
                required: f.req || false, is_numeric: f.num || false,
            }, { onConflict: 'id' });
        }
    },

    async updateField(id, updates) {
        const dbUpdates = {};
        if (updates.label !== undefined) dbUpdates.label = updates.label;
        if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
        if (updates.req !== undefined) dbUpdates.required = updates.req;
        if (updates.options !== undefined) dbUpdates.options = updates.options;

        await supabase.from('form_fields').update(dbUpdates).eq('id', id);
    },
};
