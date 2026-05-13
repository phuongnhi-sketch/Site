import { supabase } from './supabaseClient.js';

/**
 * AuthService — Quản lý đăng nhập/đăng xuất qua Supabase Auth.
 */
export const AuthService = {
    /**
     * Đăng nhập bằng email + password.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{user: object, profile: object} | null>}
     */
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Lấy profile mở rộng
        const profile = await this.getProfile(data.user.id);
        return { user: data.user, profile };
    },

    /**
     * Đăng xuất.
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Lấy user hiện tại (nếu đã đăng nhập).
     * @returns {Promise<{user: object, profile: object} | null>}
     */
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const profile = await this.getProfile(user.id);
        return { user, profile };
    },

    /**
     * Lấy thông tin profile mở rộng từ bảng profiles.
     * @param {string} userId
     * @returns {Promise<object | null>}
     */
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    },

    /**
     * Lắng nghe thay đổi trạng thái auth (đăng nhập/đăng xuất).
     * @param {function} callback - (event, session) => void
     */
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    },

    /**
     * Tạo user mới (chỉ Admin dùng).
     * Supabase free tier: dùng signUp rồi Admin confirm.
     * @param {string} email
     * @param {string} password
     * @param {object} metadata - { username, name, role, region, brand }
     */
    async createUser(email, password, metadata) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        if (error) throw error;
        return data;
    },

    /**
     * Gửi mã OTP đổi mật khẩu qua email.
     */
    async requestPasswordResetOTP(email) {
        // 1. Tạo mã 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // Hết hạn sau 10 phút

        // 2. Lưu vào bảng otp_codes (Giả định bảng này đã được tạo)
        const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
        if (!user) throw new Error('Không tìm thấy tài khoản với email này.');

        const { error: otpErr } = await supabase.from('otp_codes').insert({
            user_id: user.id.toString(), // Chuyển sang string cho chắc chắn
            email: email,
            code: otp,
            expires_at: expiresAt
        });
        if (otpErr) {
            console.error('Lỗi lưu OTP:', otpErr);
            throw new Error(`Lỗi Database: ${otpErr.message || 'Không thể lưu mã'}`);
        }

        // 3. Gửi email qua API nội bộ
        const apiUrl = window.location.origin + '/api/send-email';
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: email,
                subject: '[Site Management] Mã xác thực đổi mật khẩu',
                text: `Mã xác thực của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                        <h2 style="color: #2563EB;">🔐 Mã xác thực đổi mật khẩu</h2>
                        <p>Chào bạn,</p>
                        <p>Bạn vừa yêu cầu đổi mật khẩu. Vui lòng sử dụng mã xác thực dưới đây:</p>
                        <div style="font-size: 2rem; font-weight: 800; color: #2563EB; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #F8FAFC; padding: 15px; border-radius: 8px;">
                            ${otp}
                        </div>
                        <p>Mã này có hiệu lực trong <b>10 phút</b>. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
                    </div>
                `
            })
        });
        return true;
    },

    /**
     * Xác thực OTP và đổi mật khẩu mới.
     */
    async verifyOTPAndChangePassword(email, otp, newPassword) {
        // 1. Kiểm tra mã OTP
        const { data: record, error: fetchErr } = await supabase
            .from('otp_codes')
            .select('*')
            .eq('email', email)
            .eq('code', otp)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (fetchErr || !record) {
            throw new Error('Mã xác thực không đúng hoặc đã hết hạn.');
        }

        // 2. Cập nhật mật khẩu trong Supabase Auth
        const { error: authErr } = await supabase.auth.updateUser({ password: newPassword });
        if (authErr) throw authErr;

        // 3. Cập nhật mật khẩu trong bảng users (Nếu cần đồng bộ như logic cũ)
        await supabase.from('users').update({ password: newPassword }).eq('email', email);

        // 4. Xóa mã OTP đã dùng
        await supabase.from('otp_codes').delete().eq('id', record.id);

        return true;
    }
};
