/**
 * SITESERVICE.JS - QUẢN LÝ DỮ LIỆU MẶT BẰNG (PERSISTENT & PRIVATE)
 */

import { store } from '../store.js';

const INITIAL_MOCK_SITES = [
    {
        id: '1',
        site_code: 'MB-2024-001',
        site_name: 'Mặt bằng Ngã Sáu Ô Chợ Dừa',
        thumbnail: 'https://images.unsplash.com/photo-1577495508326-0610ce394464?w=200&h=200&fit=crop',
        address: 'Số 1, Ô Chợ Dừa, Đống Đa, Hà Nội',
        region: 'NORTH',
        rent_price: 120000000,
        status: 'SUBMITTED',
        submitted_at: '2024-04-10T10:30:00Z',
        owner_id: 'system'
    },
    {
        id: '2',
        site_code: 'MB-2024-002',
        site_name: 'Góc ngã tư Nguyễn Huệ',
        thumbnail: 'https://images.unsplash.com/photo-1541339905195-266293a20131?w=200&h=200&fit=crop',
        address: '99 Nguyễn Huệ, Quận 1, TP. HCM',
        region: 'SOUTH',
        rent_price: 250000000,
        status: 'UNDER_REVIEW',
        submitted_at: '2024-04-12T15:45:00Z',
        owner_id: 'system'
    }
];

const STORAGE_KEY = 'site_poc_persistent_sites';

export const SiteService = {
    /**
     * Khởi tạo dữ liệu nếu chưa có
     */
    init: () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SITES));
        }
    },

    /**
     * Lấy danh sách mặt bằng kèm logic bảo mật
     */
    getSites: () => {
        SiteService.init();
        const { user } = store.getState();
        if (!user) return [];

        const allSites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // Logic lọc:
        // 1. DRAFT: Chỉ chủ sở hữu (owner_id) mới thấy
        // 2. SUBMITTED/UNDER_REVIEW/COMPLETED: 
        //    - Admin/BOD: Thấy hết
        //    - Project Team: Thấy hết nhưng bị che giá
        //    - MB: Thấy cùng Region
        
        return allSites.filter(site => {
            // Quyền xem bản nháp
            if (site.status === 'DRAFT') {
                return site.owner_id === user.id || user.role === 'ADMIN';
            }
            
            // Quyền xem hồ sơ đã nộp
            if (user.role === 'ADMIN' || user.role === 'BOD' || user.role === 'PROJECT') return true;
            if (user.role === 'MB') return site.region === user.region;
            
            return false;
        }).map(site => {
            // Financial Masking cho Project Team
            const result = { ...site };
            if (user.role === 'PROJECT') {
                result.rent_price = '**********';
            }
            return result;
        });
    },

    /**
     * Lưu một mặt bằng mới (hoặc cập nhật)
     */
    saveSite: (siteData) => {
        SiteService.init();
        const { user } = store.getState();
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        const newSite = {
            id: siteData.id || Date.now().toString(),
            owner_id: user ? user.id : 'anonymous',
            created_at: new Date().toISOString(),
            submitted_at: siteData.status === 'SUBMITTED' ? new Date().toISOString() : null,
            ...siteData
        };

        const existingIndex = sites.findIndex(s => s.id === newSite.id);
        if (existingIndex > -1) {
            sites[existingIndex] = newSite;
        } else {
            sites.push(newSite);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
        return newSite;
    },

    /**
     * Admin mở khóa cho phép sửa lại
     */
    unlockSite: (id) => {
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const index = sites.findIndex(s => s.id === id);
        if (index > -1) {
            sites[index].status = 'DRAFT';
            // Lưu lịch sử mở khóa vào comment
            if (!sites[index].comments) sites[index].comments = [];
            sites[index].comments.push({
                author: 'Hệ thống',
                text: 'Hồ sơ đã được Admin mở khóa để chỉnh sửa lại.',
                date: new Date().toISOString()
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
        }
    },

    /**
     * Thêm bình luận vào hồ sơ
     */
    addComment: (id, text, author) => {
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const index = sites.findIndex(s => s.id === id);
        if (index > -1) {
            if (!sites[index].comments) sites[index].comments = [];
            sites[index].comments.push({
                author: author || 'User',
                text: text,
                date: new Date().toISOString()
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
        }
    },

    /**
     * Cập nhật trạng thái phê duyệt
     */
    updateStatus: (id, status) => {
        const sites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const index = sites.findIndex(s => s.id === id);
        if (index > -1) {
            sites[index].status = status;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
        }
    }
};
