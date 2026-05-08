const fs = require('fs');
let c = fs.readFileSync('src/js/views/UserManagementView.js', 'utf8');

c = c.replace(
    /window\.saveUserModal = async \(\) => \{[\s\S]*?if\(window\.router\) window\.router\.handleRoute\(\);\r?\n        \};/,
    `window.saveUserModal = async () => {
            const id = document.getElementById('u-id').value;
            const pw = document.getElementById('u-password').value;
            const email = document.getElementById('u-email').value;
            
            const u = {
                id: id,
                name: document.getElementById('u-name').value,
                username: document.getElementById('u-username').value,
                role: document.getElementById('u-role').value,
                email: email,
                region: document.getElementById('u-role').value === 'MB' ? document.getElementById('u-region').value : 'ALL',
                brand: document.getElementById('u-role').value === 'BOD_L2' ? document.getElementById('u-brand').value : 'ALL'
            };

            if (!id) {
                // Tạo mới User qua Supabase Auth
                try {
                    const authRes = await AuthService.createUser(email, pw, {
                        username: u.username,
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
            if(window.router) window.router.handleRoute();
        };`
);

c = c.replace(
    `document.getElementById('u-email').value = u.email || '';`,
    `document.getElementById('u-email').value = u.email || '';
                    document.getElementById('u-email').readOnly = true;
                    document.getElementById('u-email').style.background = '#f5f5f5';
                    document.getElementById('u-email-hint').style.display = 'block';`
);

c = c.replace(
    `document.getElementById('u-email').value = '';`,
    `document.getElementById('u-email').value = '';
                document.getElementById('u-email').readOnly = false;
                document.getElementById('u-email').style.background = '#fff';
                document.getElementById('u-email-hint').style.display = 'none';`
);

fs.writeFileSync('src/js/views/UserManagementView.js', c);
console.log('Replaced successfully');
