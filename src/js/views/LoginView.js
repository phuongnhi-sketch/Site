import { store } from '../store.js';

export const LoginView = {
    render: async () => {

        return `
        <div style="display:flex; align-items:center; justify-content:center; height:100vh; background:#F1F5F9; overflow:auto;">
            <div class="glass" style="width:500px; padding:3rem; border-radius:32px; text-align:center; margin: auto;">
                <h1 style="color:var(--accent-blue); font-family:var(--font-heading); font-size:2.2rem; margin-bottom:1.5rem">Site Management Master</h1>
                <form onsubmit="event.preventDefault(); window.doLogin();" style="display:flex; flex-direction:column; gap:15px; text-align:left;">
                    <div>
                        <label style="font-size:0.8rem; font-weight:700">Email Đăng nhập</label>
                        <input type="text" id="login-user" placeholder="Nhập Email (VD: admin@system.com hoặc admin)" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; margin-top:5px" required>
                    </div>
                    <div>
                        <label style="font-size:0.8rem; font-weight:700">Mật khẩu</label>
                        <input type="password" id="login-pass" placeholder="Nhập mật khẩu (VD: 123456)" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; margin-top:5px" required>
                    </div>
                    <button type="submit" class="btn-primary" style="margin-top:10px; width:100%">🚀 Đăng nhập Hệ thống</button>
                </form>
                <p style="font-size:0.75rem; color:#666; margin-top:1.5rem; font-style:italic">
                    * Vui lòng sử dụng tài khoản đã được cấp để truy cập hệ thống.
                </p>
            </div>
        </div>`;
    }
};
