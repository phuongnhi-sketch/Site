import { SiteService, STATUS_LABELS } from '../../services/siteService.js';
import { store } from '../store.js';

export const SiteListView = {
    render: async () => {
        const u = store.getState().user;
        const sites = await SiteService.getSites();
        
        // Define global actions
        window.printSelected = () => {
            const selected = Array.from(document.querySelectorAll('.site-checkbox:checked')).map(cb => cb.dataset.id);
            if (selected.length === 0) return alert('Vui lòng chọn ít nhất 1 mặt bằng!');
            window.printSites(selected);
        };
        
        window.exportSelected = async () => {
            const selected = Array.from(document.querySelectorAll('.site-checkbox:checked')).map(cb => cb.dataset.id);
            if (selected.length === 0) return alert('Vui lòng chọn ít nhất 1 mặt bằng!');
            await window.exportExcel(selected);
        };

        return `
            <div class="animate-fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem">
                    <h1>📋 Danh sách mặt bằng</h1>
                    <div style="display:flex; gap:10px">
                        <button class="btn-ghost" onclick="window.printSelected()">🖨️ In PDF đã chọn</button>
                        <button class="btn-ghost" onclick="window.exportSelected()">📊 Xuất Excel đã chọn</button>
                        <button class="btn-primary" onclick="location.hash='#create'">➕ Thêm mặt bằng mới</button>
                    </div>
                </div>

                <div class="glass" style="padding:1rem; border-radius:20px; overflow-x:auto">
                    <table style="width:100%; border-collapse:collapse; min-width:1000px">
                        <thead>
                            <tr style="text-align:left; border-bottom:1px solid #eee">
                                <th style="padding:1rem; width:40px"><input type="checkbox" onclick="const cbs=document.querySelectorAll('.site-checkbox'); cbs.forEach(cb=>cb.checked=this.checked)" style="width:18px; height:18px; cursor:pointer"></th>
                                <th style="width:80px">Ảnh</th>
                                <th>Tên mặt bằng</th>
                                <th>Brand</th>
                                <th>Giá thuê (Tháng)</th>
                                <th>Người nộp</th>
                                <th>Ngày nộp</th>
                                <th>Quy mô (S/W)</th>
                                <th>Google Map</th>
                                <th style="min-width:120px">Trạng thái</th>
                                <th style="min-width:80px">Miền</th>
                                <th style="min-width:120px">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sites.map(s => {
                                const displayData = SiteService.getLatestData(s);
                                const sName = displayData.f1 || s.name;
                                const sPrice = displayData.f2_2 || s.price;
                                const sBrand = displayData.f0 || s.brand;

                                return `
                                    <tr style="border-bottom:1px solid #f9f9f9">
                                        <td style="padding:1rem"><input type="checkbox" class="site-checkbox" data-id="${s.id}" style="width:18px; height:18px; cursor:pointer"></td>
                                        <td>
                                            <img src="${s.thumb}" onerror="this.src='https://images.unsplash.com/photo-1582410118839-959c86940d99?w=400&h=400'" style="width:65px; height:45px; border-radius:8px; object-fit:cover; border:1px solid #eee;">
                                        </td>
                                        <td><strong>${sName}</strong> ${s.v2_data ? '<span style="font-size:0.6rem; background:var(--accent-blue); color:white; padding:2px 4px; border-radius:4px; margin-left:4px">V2</span>' : ''}</td>
                                        <td><span style="font-weight:600; color:#555">${sBrand || '---'}</span></td>
                                        <td style="font-weight:700; color:var(--accent-blue)">
                                            ${(u.role === 'PROJECT' || (s.status === 'FINISH' && u.role !== 'ADMIN') || (s.status === 'REJECTED' && u.role !== 'ADMIN')) ? '*******' : (sPrice ? (isNaN(parseFloat(sPrice.toString().replace(/,/g, ''))) ? sPrice : parseFloat(sPrice.toString().replace(/,/g, '')).toLocaleString('en-US') + ' đ') : '---')}
                                        </td>
                                        <td>${s.owner_name || s.owner}</td>
                                        <td>${s.date}</td>
                                        <td>
                                            <div style="font-size:0.8rem"><strong>S:</strong> ${displayData.f5 || '---'} m2</div>
                                            <div style="font-size:0.8rem"><strong>W:</strong> ${displayData.f4 || '---'} m</div>
                                        </td>
                                        <td>${displayData.f3 ? `<a href="${displayData.f3}" target="_blank" style="color:var(--accent-blue); text-decoration:none;">📍 Xem Map</a>` : '---'}</td>
                                        <td><span class="status-pill status-${s.status}">${STATUS_LABELS[s.status]}</span></td>
                                        <td><span style="font-size:0.75rem; font-weight:800; color:#555">${s.region}</span></td>
                                        <td>
                                            <div style="display:flex; gap:6px">
                                                ${(s.status === 'DRAFT' || u.role === 'ADMIN') ? `<button onclick="location.hash='#create?id=${s.id}'" class="btn-primary" style="padding:6px 12px; border-radius:10px; font-size:0.8rem; height:fit-content;">Sửa</button>` : ''}
                                                <button class="btn-ghost" style="padding:6px 12px; font-size:0.8rem; height:fit-content;" onclick="location.hash='#detail?id=${s.id}'">Xem</button>
                                                ${u.role === 'ADMIN' ? `<button class="btn-ghost" style="padding:6px 12px; font-size:0.8rem; height:fit-content; background:#FEE2E2; color:#B91C1C; border:none;" onclick="window.delSite('${s.id}')">Xóa</button>` : ''}
                                            </div>
                                        </td>
                                    </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
    }
}
