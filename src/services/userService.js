import { supabase } from './supabaseClient.js';

/**
 * UserService — Quản lý users qua Supabase.
 * Bảng thực tế trong DB là 'users' (do Nhi tạo).
 */
export const UserService = {
    async getUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: true });
            
        if (error) { 
            console.error('Supabase error fetching users:', error); 
            return [];
        }
        return data || [];
    },

    async getUserByUsername(username) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (error) return null;
        return data;
    },

    async saveUser(user) {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                username: user.username,
                password: user.password,
                name: user.name,
                role: user.role,
                region: user.region || 'ALL',
                brand: user.brand || 'ALL',
                email: user.email,
                is_active: user.is_active !== undefined ? user.is_active : true,
            }, { onConflict: 'id' });
            
        if (error) {
            console.error('Error saving user:', error);
            return false;
        }
        return true;
    },

    async deleteUser(id) {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) console.error('Error deleting user:', error);
    },

    async toggleActive(id, currentStatus) {
        const { error } = await supabase
            .from('users')
            .update({ is_active: !currentStatus })
            .eq('id', id);
        if (error) console.error('Error toggling user status:', error);
        return !error;
    },
};
