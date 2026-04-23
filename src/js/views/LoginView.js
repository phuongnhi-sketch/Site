/**
 * LOGINVIEW.JS - GIAO DIỆN ĐĂNG NHẬP
 */

import { AuthService } from '../services/authService.js';

export const LoginView = {
    render: () => {
        return `
            <div class="login-page">
                <div class="login-card glass">
                    <div class="login-header">
                        <h2>Site Management</h2>
                        <p>Chào mừng chị Nhi, vui lòng đăng nhập</p>
                    </div>
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" placeholder="admin@site.com" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Mật khẩu</label>
                            <input type="password" id="password" placeholder="••••••••" required>
                        </div>
                        <div id="login-error" class="login-error hide"></div>
                        <button type="submit" id="login-btn" class="btn btn-primary btn-block">
                            <span class="btn-text">Đăng nhập</span>
                            <span class="btn-loader hide"></span>
                        </button>
                    </form>
                    <div class="login-footer">
                        <p>Dự án POC - Site Management Web</p>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: () => {
        const form = document.querySelector('#login-form');
        const loginBtn = document.querySelector('#login-btn');
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        const errorEl = document.querySelector('#login-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            // Start Loading
            loginBtn.disabled = true;
            btnText.classList.add('hide');
            btnLoader.classList.remove('hide');
            errorEl.classList.add('hide');

            try {
                await AuthService.login(email, password);
                // Redirect on success (router will handle it or we can force)
                window.location.href = '/dashboard';
            } catch (error) {
                errorEl.textContent = error;
                errorEl.classList.remove('hide');
                
                // End Loading on error
                loginBtn.disabled = false;
                btnText.classList.remove('hide');
                btnLoader.classList.add('hide');
            }
        });
    }
};
