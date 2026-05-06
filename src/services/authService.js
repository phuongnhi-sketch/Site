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
};
