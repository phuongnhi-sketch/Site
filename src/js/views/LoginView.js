import { store } from '../store.js';

export const LoginView = {
    render: async () => {

        return `
        <div style="display:flex; align-items:center; justify-content:center; height:100vh; background:#F1F5F9; overflow:auto;">
            <div class="glass" style="width:500px; padding:3rem; border-radius:32px; text-align:center; margin: auto;">
                <h1 style="color:var(--accent-blue); font-family:var(--font-heading); font-size:2.2rem; margin-bottom:1.5rem">Site Management POC</h1>
                <form onsubmit="event.preventDefault(); window.doLogin();" style="display:flex; flex-direction:column; gap:15px; margin-bottom:2rem; text-align:left;">
                    <div>
                        <label style="font-size:0.8rem; font-weight:700">Tài khoản (VD: admin)</label>
                        <input type="text" id="login-user" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; margin-top:5px" required>
                    </div>
                    <div>
                        <label style="font-size:0.8rem; font-weight:700">Mật khẩu (VD: 123)</label>
                        <input type="password" id="login-pass" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; margin-top:5px" required>
                    </div>
                    <button type="submit" class="btn-primary" style="margin-top:10px">🚀 Đăng nhập</button>
                </form>
                <div style="border-top:1px dashed #ddd; padding-top:1.5rem; margin-bottom:1rem">
                    <p style="font-size:0.85rem; color:#666; font-weight:600; margin-bottom:15px">Hoặc đăng nhập nhanh (Quick Demo):</p>
                    <button onclick="window.login('ADMIN', 'ALL')" class="btn-primary" style="width:100%; margin-bottom:12px">🚪 Đăng nhập ADMIN (Chị Nhi)</button>
                </div>
                <div style="display:flex; gap:10px; margin-bottom:12px;">
                    <button onclick="window.login('MB', 'NORTH')" class="btn-primary" style="flex:1; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; padding:0.8rem 0; font-size:0.8rem">🏗️ MB Bắc</button>
                    <button onclick="window.login('MB', 'SOUTH')" class="btn-primary" style="flex:1; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; padding:0.8rem 0; font-size:0.8rem">🏗️ MB Nam</button>
                </div>
                <button onclick="window.login('BOD_L1', 'ALL')" class="btn-primary" style="width:100%; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; margin-bottom:12px; font-size:0.9rem">📈 BOD</button>
                <div style="display:flex; gap:10px; margin-bottom:12px;">
                    <button onclick="window.login('BOD_L2', 'ALL', 'TPC')" class="btn-primary" style="flex:1; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; padding:0.8rem 0; font-size:0.8rem">🛒 TPC</button>
                    <button onclick="window.login('BOD_L2', 'ALL', 'CHANG')" class="btn-primary" style="flex:1; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; padding:0.8rem 0; font-size:0.8rem">🇹🇭 CHANG</button>
                </div>
                <div style="display:flex; gap:10px; margin-bottom:12px;">
                    <button onclick="window.login('BOD_L2', 'ALL', 'DQ')" class="btn-primary" style="flex:1; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; padding:0.8rem 0; font-size:0.8rem">🥟 DQ</button>
                    <button onclick="window.login('BOD_L2', 'ALL', 'SW')" class="btn-primary" style="flex:1; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; padding:0.8rem 0; font-size:0.8rem">🍦 SW</button>
                </div>
                <button onclick="window.login('PROJECT', 'ALL')" class="btn-primary" style="width:100%; background:#fff; color:#333; box-shadow:none; border:1px solid #ddd; font-size:0.9rem">👷 Project</button>
            </div>
        </div>`;
    }
};
