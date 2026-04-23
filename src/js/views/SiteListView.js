/**
 * SITELISTVIEW.JS - DANH SÁCH MẶT BẰNG
 */

import { SiteService } from '../services/siteService.js';
import { store } from '../store.js';

export const SiteListView = {
    render: async () => {
        const sites = SiteService.getSites();
        
        const tableRows = sites.map(site => `
            <tr>
                <td>
                    <img src="${site.thumbnail}" alt="Façade" class="site-thumb glass-glow">
                </td>
                <td><strong>${site.site_code}</strong></td>
                <td>
                    <div style="font-weight: 600">${site.site_name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted)">${site.address}</div>
                </td>
                <td>${site.region === 'NORTH' ? 'Miền Bắc' : 'Miền Nam'}</td>
                <td style="font-weight: 700; color: var(--accent-blue)">
                    ${typeof site.rent_price === 'number' ? site.rent_price.toLocaleString('vi-VN') + ' đ' : site.rent_price}
                </td>
                <td>
                    <div style="font-size: 0.85rem">${site.submitted_at ? new Date(site.submitted_at).toLocaleDateString('vi-VN') : '---'}</div>
                </td>
                <td>
                    <span class="status-pill status-${site.status}">
                        ${site.status}
                    </span>
                </td>
                <td>
                    ${site.status === 'DRAFT' ? 
                        `<button class="btn btn-sm glass-glow" style="padding: 0.4rem; font-size: 0.8rem; background: var(--accent-azure); color: white;" onclick="window.location.hash = 'create?id=${site.id}'">Sửa tiếp</button>` : 
                        `<button class="btn btn-sm glass-glow" style="padding: 0.4rem; font-size: 0.8rem" onclick="window.location.hash = 'site-detail?id=${site.id}'">Chi tiết</button>`
                    }
                </td>
            </tr>
        `).join('');

        return `
            <div class="site-list-page animate-fade-in">
                <div class="page-header">
                    <h1>Danh sách mặt bằng</h1>
                    <p>Quản lý và theo dõi tiến độ các hồ sơ mặt bằng trên toàn hệ thống.</p>
                </div>

                <div class="toolbar glass">
                    <div class="filter-group">
                        <input type="text" placeholder="Tìm kiếm mã, tên, địa chỉ..." class="input-search">
                        <select class="select-filter">
                            <option value="">Tất cả trạng thái</option>
                            <option value="DRAFT">Bản nháp</option>
                            <option value="SUBMITTED">Đã nộp</option>
                            <option value="UNDER_REVIEW">Đang duyệt</option>
                            <option value="COMPLETED">Hoàn thành</option>
                        </select>
                        <select class="select-filter">
                            <option value="">Tất cả khu vực</option>
                            <option value="NORTH">Miền Bắc</option>
                            <option value="SOUTH">Miền Nam</option>
                        </select>
                    </div>
                    <button class="btn btn-primary">+ Thêm mặt bằng</button>
                </div>

                <div class="table-container glass shadow-soft">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Ảnh mặt tiền</th>
                                <th>Mã MB</th>
                                <th>Thông tin Site</th>
                                <th>Khu vực</th>
                                <th>Giá thuê</th>
                                <th>Ngày nộp</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows.length > 0 ? tableRows : '<tr><td colspan="8" style="text-align:center; padding:2rem;">Không tìm thấy dữ liệu mặt bằng.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        // Logic for search and filtering will be added here
        console.log('Site List View rendered');
    }
};
