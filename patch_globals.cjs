const fs = require('fs');
let c = fs.readFileSync('src/js/globals.js', 'utf8');

const oldLogin = `        window.doLogin = async () => {
            const uInput = document.getElementById('login-user').value.trim();
            const pInput = document.getElementById('login-pass').value;
            
            // Map username → email (lowercase để khớp với Supabase Auth)
            let email = uInput.includes('@') ? uInput.toLowerCase() : (uInput.toLowerCase() + '@system.com');
            
            console.log('Attempting login for:', email);
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password: pInput });
                if (error) throw error;
                
                // Lấy metadata từ Supabase Auth user (trigger đã populate từ bảng users)
                const meta = data.user.user_metadata || {};
                const uObj = {
                    id: meta.username || data.user.id,
                    name: meta.name || email,
                    role: meta.role || 'MB',
                    region: meta.region || 'ALL',
                    brand: meta.brand || 'ALL',
                    email: data.user.email,
                };
                
                localStorage.setItem('site_poc_user', JSON.stringify(uObj));
                store.setState({ user: uObj });
                
                console.log('Login successful:', uObj.name);
                location.href = '#dashboard';
                location.reload();
            } catch (err) {
                console.error('Login error:', err);
                alert(\`LỖI ĐĂNG NHẬP:\\n\${err.message || 'Sai tài khoản hoặc mật khẩu'}\\n\\nVui lòng kiểm tra lại thông tin.\`);
            }
        };`;

const newLogin = `        window.doLogin = async () => {
            const uInput = document.getElementById('login-user').value.trim();
            const pInput = document.getElementById('login-pass').value;
            
            let email = uInput.includes('@') ? uInput.toLowerCase() : (uInput.toLowerCase() + '@system.com');
            
            console.log('Attempting login for:', email);
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password: pInput });
                if (error) throw error;
                
                // Lấy thông tin chính xác từ bảng users public
                const { data: dbUser, error: dbErr } = await supabase.from('users').select('*').eq('email', email).single();
                
                if (dbErr || !dbUser) {
                    throw new Error('Tài khoản Auth hợp lệ nhưng không tìm thấy trong database nội bộ.');
                }
                
                const uObj = {
                    id: dbUser.id,
                    name: dbUser.name,
                    role: dbUser.role,
                    region: dbUser.region,
                    brand: dbUser.brand,
                    email: dbUser.email
                };
                
                localStorage.setItem('site_poc_user', JSON.stringify(uObj));
                store.setState({ user: uObj });
                
                console.log('Login successful:', uObj.name);
                location.href = '#dashboard';
                location.reload();
            } catch (err) {
                console.error('Login error:', err);
                alert(\`LỖI ĐĂNG NHẬP:\\n\${err.message || 'Sai tài khoản hoặc mật khẩu'}\\n\\nVui lòng kiểm tra lại thông tin.\`);
            }
        };`;

if (c.includes('// Lấy metadata từ Supabase Auth user')) {
    c = c.replace(oldLogin, newLogin);
    fs.writeFileSync('src/js/globals.js', c);
    console.log('globals.js patched.');
} else {
    console.log('Could not patch globals.js');
}
