import { SiteService } from '../../services/siteService.js';
import { FormService } from '../../services/formService.js';
import { UserService } from '../../services/userService.js';
import { AuthService } from '../../services/authService.js';
import { NotificationService } from '../../services/notificationService.js';
import { store } from '../store.js';

export const UserManagementView = {
    render: async () => {
        const users = (await UserService.getUsers());
        return `
                    <div class="animate-fade-in" style="max-width:1200px; position:relative;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem">
                            <h1 style="font-family:var(--font-heading)">👤 Quản lý User</h1>
                            <button class="btn-primary" style="padding:0.8rem 1.5rem; border-radius:12px;" onclick="window.showUserModal()">+ Thêm User</button>
                        </div>
                        <div class="glass" style="border-radius:24px; overflow:hidden">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Tên User (Name)</th>
                                        <th>Email</th>
                                        <th>Mức độ (Role)</th>
                                        <th>Trạng thái</th>
                                        <th>Mật khẩu</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${users.map(u => {
            let roleDisplay = u.role;
            if (u.role === 'MB') roleDisplay = `Mặt bằng (${u.region})`;
            if (u.role === 'PROJECT') roleDisplay = 'Project';
            if (u.role === 'BOD_L1') roleDisplay = 'BOD';
            if (u.role === 'BOD_L2') roleDisplay = u.brand;
            return `
                                        <tr>
                                            <td><strong>${u.name}</strong></td>
                                            <td>${u.email || '---'}</td>
                                            <td>
                                                <span class="status-pill" style="background:${(() => {
                    if (u.role === 'ADMIN') return '#F3E8FF';
                    if (u.role === 'BOD_L1' || u.role === 'BOD_L2') return '#DBEAFE';
                    if (u.role === 'PROJECT') return '#DCFCE7';
                    if (u.role === 'MB') return '#FEF3C7';
                    return '#F1F5F9';
                })()}; color:${(() => {
                    if (u.role === 'ADMIN') return '#7E22CE';
                    if (u.role === 'BOD_L1' || u.role === 'BOD_L2') return '#1E40AF';
                    if (u.role === 'PROJECT') return '#15803D';
                    if (u.role === 'MB') return '#B45309';
                    return '#475569';
                })()}">${roleDisplay}</span>
                                            </td>
                                            <td>
                                                <span class="status-pill" style="background:${u.is_active !== false ? '#DCFCE7' : '#FEE2E2'}; color:${u.is_active !== false ? '#15803D' : '#B91C1C'}">
                                                    ${u.is_active !== false ? '● Hoạt động' : '● Đã khóa'}
                                                </span>
                                            </td>
                                            <td>*******</td>
                                            <td>
                                                <div style="display:flex; gap:6px">
                                                    <button class="btn-ghost" style="padding:4px 10px; font-size:0.75rem" onclick="window.showUserModal('${u.id}')">Sửa</button>
                                                    ${u.role !== 'ADMIN' ? `
                                                        <button class="btn-ghost" style="padding:4px 10px; font-size:0.75rem; color:${u.is_active !== false ? '#94a3b8' : '#059669'}; border-color:${u.is_active !== false ? '#e2e8f0' : '#dcfce7'}" onclick="window.toggleUserActive('${u.id}', ${u.is_active !== false})">
                                                            ${u.is_active !== false ? 'Khóa' : 'Mở khóa'}
                                                        </button>
                                                        <button class="btn-ghost" style="padding:4px 10px; font-size:0.75rem; color:red; border-color:#FEE2E2" onclick="window.deleteUser('${u.id}', '${u.role}')">Xóa</button>
                                                    ` : ''}
                                                </div>
                                            </td>
                                        </tr>`;
        }).join('')}
                                </tbody>
                            </table>
                        </div>

                        <!-- User Modal Overlay -->
                        <div id="userModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
                            <div class="glass" style="background:white; width:500px; padding:2.5rem; border-radius:24px; box-shadow:0 20px 50px rgba(0,0,0,0.2);">
                                <h2 id="uModalTitle" style="margin-bottom:1.5rem; color:var(--primary-color);">Thêm User mới</h2>
                                <form onsubmit="event.preventDefault(); window.saveUserModal();" style="display:flex; flex-direction:column; gap:15px;">
                                    <input type="hidden" id="u-id">
                                    <div>
                                        <label style="font-weight:700; font-size:0.85rem">Tên hiển thị <span style="color:red">*</span></label>
                                        <input type="text" id="u-name" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">
                                    </div>
                                    
                                    <div>
                                        <label style="font-weight:700; font-size:0.85rem">Email (Đăng nhập & Noti) <span style="color:red">*</span></label>
                                        <input type="email" id="u-email" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">
                                        <small id="u-email-hint" style="color:#666; font-size:0.75rem; display:none;">(Không thể thay đổi Email sau khi tạo)</small>
                                    </div>
                                    <div>
                                        <label style="font-weight:700; font-size:0.85rem">Mật khẩu <span style="color:red">*</span></label>
                                        <input type="password" id="u-password" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">
                                        <small id="u-pass-hint" style="color:#666; font-size:0.75rem; display:none;">(Nhập mật khẩu mới nếu muốn đổi)</small>
                                    </div>
                                    <div>
                                        <label style="font-weight:700; font-size:0.85rem">Mức độ sử dụng (Role) <span style="color:red">*</span></label>
                                        <select id="u-role" onchange="window.onRoleChange()" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="MB">Mặt bằng (Site)</option>
                                            <option value="PROJECT">Project</option>
                                            <option value="BOD_L1">BOD</option>
                                            <option value="BOD_L2">Brand</option>
                                        </select>
                                    </div>
                                    <div id="u-region-div" style="display:none;">
                                        <label style="font-weight:700; font-size:0.85rem">Miền quản lý (Region)</label>
                                        <select id="u-region" style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">
                                            <option value="NORTH">Miền Bắc</option>
                                            <option value="SOUTH">Miền Nam</option>
                                        </select>
                                    </div>
                                    <div id="u-brand-div" style="display:none;">
                                        <label style="font-weight:700; font-size:0.85rem">Brand quản lý</label>
                                        <select id="u-brand" style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">
                                            <option value="TPC">TPC</option>
                                            <option value="CHANG">CHANG</option>
                                            <option value="DQ">DQ</option>
                                            <option value="SW">SW</option>
                                        </select>
                                    </div>
                                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:15px">
                                        <button type="button" class="btn-ghost" onclick="document.getElementById('userModal').style.display='none'">Hủy</button>
                                        <button type="submit" class="btn-primary">Lưu User</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
    }
};

window.showUserModal = async (id) => {
    const users = (await UserService.getUsers());
    const modal = document.getElementById('userModal');
    const roleEl = document.getElementById('u-role');
    if (id) {
        const u = users.find(x => x.id === id);
        if (u) {
            document.getElementById('uModalTitle').innerText = 'Sửa thông tin User';
            document.getElementById('u-id').value = u.id;
            document.getElementById('u-name').value = u.name;

            document.getElementById('u-password').value = '***';
            document.getElementById('u-password').required = false;
            document.getElementById('u-pass-hint').style.display = 'block';
            document.getElementById('u-email').value = u.email || '';
            document.getElementById('u-email').readOnly = true;
            document.getElementById('u-email').style.background = '#f5f5f5';
            document.getElementById('u-email-hint').style.display = 'block';
            roleEl.value = u.role;
            document.getElementById('u-region').value = u.region || 'NORTH';
            document.getElementById('u-brand').value = u.brand || 'TPC';
        }
    } else {
        document.getElementById('uModalTitle').innerText = 'Thêm User mới';
        document.getElementById('u-id').value = '';
        document.getElementById('u-name').value = '';

        document.getElementById('u-password').value = '';
        document.getElementById('u-password').required = true;
        document.getElementById('u-pass-hint').style.display = 'none';
        document.getElementById('u-email').value = '';
        document.getElementById('u-email').readOnly = false;
        document.getElementById('u-email').style.background = '#fff';
        document.getElementById('u-email-hint').style.display = 'none';
        roleEl.value = 'MB';
        document.getElementById('u-region').value = 'NORTH';
        document.getElementById('u-brand').value = 'TPC';
    }
    window.onRoleChange();
    modal.style.display = 'flex';
};

window.onRoleChange = () => {
    const role = document.getElementById('u-role').value;
    document.getElementById('u-region-div').style.display = role === 'MB' ? 'block' : 'none';
    document.getElementById('u-brand-div').style.display = role === 'BOD_L2' ? 'block' : 'none';
};

window.saveUserModal = async () => {
    const id = document.getElementById('u-id').value;
    const pw = document.getElementById('u-password').value;
    const email = document.getElementById('u-email').value;

    const u = {
        id: id,
        name: document.getElementById('u-name').value,
        username: email,
        role: document.getElementById('u-role').value,
        email: email,
        region: document.getElementById('u-role').value === 'MB' ? document.getElementById('u-region').value : 'ALL',
        brand: document.getElementById('u-role').value === 'BOD_L2' ? document.getElementById('u-brand').value : 'ALL',
        is_active: id ? (users.find(x => x.id === id)?.is_active ?? true) : true
    };

    if (!id) {
        // Tạo mới User qua Supabase Auth
        try {
            const authRes = await AuthService.createUser(email, pw, {
                username: email,
                name: u.name,
                role: u.role,
                region: u.region,
                brand: u.brand
            });

            if (authRes && authRes.user) {
                u.id = authRes.user.id;
                u.password = '123456';
            } else {
                alert('Không thể tạo user trên hệ thống bảo mật (Auth). Vui lòng thử lại.');
                return;
            }
        } catch (err) {
            alert('Lỗi khi tạo tài khoản Auth: ' + err.message);
            return;
        }
    } else {
        if (pw !== '***' && pw.trim() !== '') u.password = pw;
        if (pw === '***') {
            u.password = '***'; // Mật khẩu cũ được giữ nguyên trên Supabase
        }
    }

    await UserService.saveUser(u);
    document.getElementById('userModal').style.display = 'none';
    if (window.router) window.router.handleRoute();
};

window.toggleUserActive = async (id, currentStatus) => {
    if (confirm(`Bạn có chắc chắn muốn ${currentStatus ? 'KHÓA' : 'MỞ KHÓA'} tài khoản này?`)) {
        await UserService.toggleActive(id, currentStatus);
        if (window.router) window.router.handleRoute();
    }
};

window.deleteUser = async (id, role) => {
    let msg = 'Chắc chắn xóa user này?';
    if (role === 'MB') {
        msg = '⚠️ CẢNH BÁO: User này thuộc team MB và có thể đã tạo nhiều hồ sơ mặt bằng.\n\nNếu bạn xóa User, các hồ sơ đó có thể bị lỗi hiển thị hoặc bị xóa mất.\n\nLỜI KHUYÊN: Bạn nên chọn "KHÓA" tài khoản thay vì Xóa để giữ lại dữ liệu hồ sơ.\n\nBạn vẫn muốn tiếp tục XÓA chứ?';
    }
    if (confirm(msg)) {
        await UserService.deleteUser(id);
        if (window.router) window.router.handleRoute();
    }
}
