import { AuthService } from '../../services/authService.js';
import { store } from '../store.js';

export const ChangePasswordView = {
    render: async () => {
        const user = store.getState().user;
        const email = user ? user.email : '';

        return `
            <div class="animate-fade-in" style="max-width:500px; margin: 4rem auto;">
                <div class="glass" style="padding: 3rem; border-radius: 24px; box-shadow: var(--shadow-soft);">
                    <h2 style="margin-bottom: 1.5rem; color: var(--primary-color); text-align: center;">🛡️ Đổi mật khẩu</h2>
                    
                    <div id="step-1">
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">
                            Hệ thống sẽ gửi mã xác thực (OTP) tới email: <br>
                            <strong style="color: var(--primary-color)">${email || 'Vui lòng nhập email'}</strong>
                        </p>
                        
                        ${!email ? `
                            <div class="form-group" style="margin-bottom: 1.5rem;">
                                <label style="display:block; font-weight:700; margin-bottom:0.5rem;">Email tài khoản</label>
                                <input id="reset-email" type="email" placeholder="name@example.com" style="width:100%; padding:1rem; border-radius:12px; border:1px solid #ddd;">
                            </div>
                        ` : ''}

                        <button id="btn-request-otp" class="btn-primary" style="width:100%; padding:1.2rem; border-radius:12px; font-weight:700;">
                            Gửi mã xác thực qua Email
                        </button>
                    </div>

                    <div id="step-2" style="display:none">
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">
                            Vui lòng nhập mã OTP và mật khẩu mới.
                        </p>
                        
                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <label style="display:block; font-weight:700; margin-bottom:0.5rem;">Mã OTP (6 chữ số)</label>
                            <input id="otp-code" type="text" maxlength="6" placeholder="123456" style="width:100%; padding:1rem; border-radius:12px; border:1px solid #ddd; text-align:center; letter-spacing:5px; font-size:1.5rem; font-weight:800;">
                        </div>

                        <div class="form-group" style="margin-bottom: 1.2rem;">
                            <label style="display:block; font-weight:700; margin-bottom:0.5rem;">Mật khẩu mới</label>
                            <input id="new-pass" type="password" placeholder="Tối thiểu 6 ký tự" style="width:100%; padding:1rem; border-radius:12px; border:1px solid #ddd;">
                        </div>

                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label style="display:block; font-weight:700; margin-bottom:0.5rem;">Xác nhận mật khẩu mới</label>
                            <input id="confirm-pass" type="password" placeholder="Nhập lại mật khẩu" style="width:100%; padding:1rem; border-radius:12px; border:1px solid #ddd;">
                        </div>

                        <button id="btn-verify-change" class="btn-primary" style="width:100%; padding:1.2rem; border-radius:12px; font-weight:700;">
                            Xác nhận Đổi mật khẩu
                        </button>
                        
                        <button onclick="document.getElementById('step-2').style.display='none'; document.getElementById('step-1').style.display='block';" style="width:100%; background:none; border:none; color:var(--accent-blue); margin-top:1rem; cursor:pointer; font-size:0.9rem;">
                             Quay lại bước 1
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        const btnRequest = document.getElementById('btn-request-otp');
        const btnVerify = document.getElementById('btn-verify-change');
        const user = store.getState().user;

        if (btnRequest) {
            btnRequest.onclick = async () => {
                const email = user ? user.email : document.getElementById('reset-email').value.trim();
                if (!email) return alert('Vui lòng nhập email!');

                btnRequest.disabled = true;
                btnRequest.innerText = '⏳ Đang gửi mã...';

                try {
                    await AuthService.requestPasswordResetOTP(email);
                    alert('Đã gửi mã xác thực tới email của bạn. Vui lòng kiểm tra hộp thư!');
                    document.getElementById('step-1').style.display = 'none';
                    document.getElementById('step-2').style.display = 'block';
                    window.currentResetEmail = email;
                } catch (err) {
                    alert('Lỗi: ' + err.message);
                } finally {
                    btnRequest.disabled = false;
                    btnRequest.innerText = 'Gửi mã xác thực qua Email';
                }
            };
        }

        if (btnVerify) {
            btnVerify.onclick = async () => {
                const otp = document.getElementById('otp-code').value.trim();
                const newPass = document.getElementById('new-pass').value;
                const confirmPass = document.getElementById('confirm-pass').value;
                const email = window.currentResetEmail;

                if (!otp || otp.length < 6) return alert('Vui lòng nhập đủ 6 chữ số OTP!');
                if (!newPass || newPass.length < 6) return alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
                if (newPass !== confirmPass) return alert('Xác nhận mật khẩu không khớp!');

                btnVerify.disabled = true;
                btnVerify.innerText = '⏳ Đang xử lý...';

                try {
                    await AuthService.verifyOTPAndChangePassword(email, otp, newPass);
                    alert('Chúc mừng! Mật khẩu của bạn đã được đổi thành công.');
                    location.hash = '#dashboard';
                } catch (err) {
                    alert('Lỗi: ' + err.message);
                } finally {
                    btnVerify.disabled = false;
                    btnVerify.innerText = 'Xác nhận Đổi mật khẩu';
                }
            };
        }
    }
};
