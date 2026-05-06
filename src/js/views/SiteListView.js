import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const SiteListView = {
            render: async () => {
                const u = store.getState().user;
                if (!window.siteFilters) window.siteFilters = { search: '', region: 'ALL', brand: 'ALL', status: 'ALL', includeQA: false, exportVer: 'BOTH' };
                const filters = window.siteFilters;
                const sites = (await SiteService.getSites()).filter(s => {
                    if (s.status === 'DRAFT') return s.owner === u.id || u.role === 'ADMIN';
                    if (u.role === 'ADMIN' || u.role === 'BOD_L1') return true;
                    if (u.role === 'BOD_L2') {
                        if (s.status === 'FINISH' || s.status === 'REJECTED') return true;
                        const sBrand = s.brand || s.answers?.f0 || '';
                        if (['DQ', 'SW'].includes(u.brand)) return sBrand.includes('DQ') || sBrand.includes('SW');
                        return sBrand.includes(u.brand);
                    }
                    if (u.role === 'PROJECT') return ['GATE1', 'GATE2', 'GATE3', 'FINISH', 'REJECTED'].includes(s.status);
                    return u.role === 'MB' ? s.region === u.region : false;
                }).filter(s => {
                    const sBrand = s.brand || s.answers?.f0 || '';
                    const matchSearch = s.name.toLowerCase().includes(filters.search.toLowerCase()) || (s.code && s.code.toLowerCase().includes(filters.search.toLowerCase()));
                    const matchRegion = filters.region === 'ALL' || s.region === filters.region;
                    const matchBrand = filters.brand === 'ALL' || sBrand.includes(filters.brand);
                    const matchStatus = filters.status === 'ALL' || s.status === filters.status;
                    return matchSearch && matchRegion && matchBrand && matchStatus;
                }).reverse();

                return `
                    <div class="animate-fade-in">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem">
                            <h1>📍 Danh sách hồ sơ</h1>
                            <div style="display:flex; gap:10px; align-items:center">
                                <div style="display:flex; flex-direction:column; gap:6px; margin-right:10px; padding:8px; background:#F8FAFC; border-radius:12px; border:1px solid #eee">
                                    <div style="display:flex; align-items:center; gap:8px; font-size:0.75rem; font-weight:700; color:var(--text-muted)">
                                        <input type="checkbox" id="include-qa" ${filters.includeQA ? 'checked' : ''} onchange="window.setFilter('includeQA', this.checked)" style="width:14px; height:14px; cursor:pointer"> <label for="include-qa" style="cursor:pointer">Kèm thảo luận</label>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px; font-size:0.75rem; font-weight:700; color:var(--text-muted)">
                                        <label>Phiên bản:</label>
                                        <select id="export-ver" onchange="window.setFilter('exportVer', this.value)" style="border:1px solid #ddd; border-radius:6px; padding:2px 5px; font-size:0.7rem; background:white">
                                            <option value="BOTH" ${filters.exportVer === 'BOTH' ? 'selected' : ''}>Cả V1 & V2</option>
                                            <option value="LATEST" ${filters.exportVer === 'LATEST' ? 'selected' : ''}>Chỉ bản mới nhất</option>
                                        </select>
                                    </div>
                                </div>
                                <button class="btn-ghost" style="padding:10px 20px; font-size:0.85rem" onclick="window.exportCSV()">📊 Xuất Excel</button>
                                <button class="btn-ghost" style="padding:10px 20px; font-size:0.85rem; background:#EFF6FF; border-color:#DBEAFE" onclick="window.printSelected()">🖨️ In PDF</button>
                                ${(u.role === 'ADMIN' || u.role === 'MB') ? `<button class="btn-primary" style="padding:10px 25px; font-size:0.85rem" onclick="location.hash='#create'">+ Thêm MB</button>` : ''}
                            </div>
                        </div>

                        <div style="display:flex; gap:15px; margin-bottom:20px; flex-wrap:wrap; background:white; padding:1.5rem; border-radius:16px; border:1px solid #eee; align-items:flex-end">
                            <div style="flex:1; min-width:200px">
                                <label style="font-size:0.7rem; font-weight:800; color:var(--accent-blue); display:block; margin-bottom:8px">TÌM KIẾM</label>
                                <input type="text" placeholder="Tìm tên hoặc mã hồ sơ..." value="${filters.search}" oninput="window.setFilter('search', this.value)" style="width:100%; padding:10px 14px; border:1px solid #E2E8F0; border-radius:10px; font-size:0.9rem">
                            </div>
                            <div style="width:160px">
                                <label style="font-size:0.7rem; font-weight:800; color:var(--accent-blue); display:block; margin-bottom:8px">MIỀN</label>
                                <select onchange="window.setFilter('region', this.value)" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:10px; font-size:0.9rem">
                                    <option value="ALL" ${filters.region === 'ALL' ? 'selected' : ''}>Tất cả Miền</option>
                                    <option value="NORTH" ${filters.region === 'NORTH' ? 'selected' : ''}>Miền Bắc</option>
                                    <option value="SOUTH" ${filters.region === 'SOUTH' ? 'selected' : ''}>Miền Nam</option>
                                </select>
                            </div>
                            <div style="width:160px">
                                <label style="font-size:0.7rem; font-weight:800; color:var(--accent-blue); display:block; margin-bottom:8px">BRAND</label>
                                <select onchange="window.setFilter('brand', this.value)" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:10px; font-size:0.9rem">
                                    <option value="ALL" ${filters.brand === 'ALL' ? 'selected' : ''}>Tất cả Brand</option>
                                    <option value="TPC" ${filters.brand === 'TPC' ? 'selected' : ''}>TPC</option>
                                    <option value="CHANG" ${filters.brand === 'CHANG' ? 'selected' : ''}>CHANG</option>
                                    <option value="DQ" ${filters.brand === 'DQ' ? 'selected' : ''}>DQ</option>
                                    <option value="SW" ${filters.brand === 'SW' ? 'selected' : ''}>SW</option>
                                </select>
                            </div>
                            <div style="width:160px">
                                <label style="font-size:0.7rem; font-weight:800; color:var(--accent-blue); display:block; margin-bottom:8px">TRẠNG THÁI</label>
                                <select onchange="window.setFilter('status', this.value)" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:10px; font-size:0.9rem">
                                    <option value="ALL" ${filters.status === 'ALL' ? 'selected' : ''}>Tất cả Trạng thái</option>
                                    ${Object.keys(STATUS_LABELS).filter(k => k !== 'DRAFT' || (u.role === 'ADMIN' || u.role === 'MB')).map(k => `<option value="${k}" ${filters.status === k ? 'selected' : ''}>${STATUS_LABELS[k]}</option>`).join('')}
                                </select>
                            </div>
                            <button onclick="window.siteFilters={search:'',region:'ALL',brand:'ALL',status:'ALL'}; handleRoute();" class="btn-ghost" style="padding:10px; font-size:0.8rem">Làm mới 🔄</button>
                        </div>
                        <div class="glass" style="border-radius:24px; overflow:auto">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th style="width:40px"><input type="checkbox" onclick="window.toggleAll(this)" style="width:18px; height:18px; cursor:pointer"></th>
                                        <th style="width:80px">Ảnh</th>
                                        <th style="min-width:180px">Tên MB</th>
                                        <th style="min-width:100px">Brand</th>
                                        <th style="min-width:140px">Giá thuê</th>
                                        <th style="min-width:120px">Người nộp</th>
                                        <th style="min-width:100px">Ngày nộp</th>
                                        <th style="min-width:120px">Thông số</th>
                                        <th style="min-width:100px">Map</th>
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
                                        <tr>
                                            <td><input type="checkbox" class="site-checkbox" data-id="${s.id}" style="width:18px; height:18px; cursor:pointer"></td>
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
                                                    ${s.status === 'DRAFT' ? `<button onclick="location.hash='#create?id=${s.id}'" class="btn-primary" style="padding:6px 12px; border-radius:10px; font-size:0.8rem; height:fit-content;">Sửa</button>` : ''}
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
