import { supabase } from './supabaseClient.js';

/**
 * UserService — Quản lý profiles qua Supabase (chỉ Admin dùng).
 */
export const UserService = {
    async getUsers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: true });
        if (error) { 
            console.warn('Supabase not ready, using mock users:', error); 
            return [
                { id: 'admin', name: 'Admin Tối Cao', username: 'admin', role: 'ADMIN', region: 'ALL', brand: 'ALL' },
                { id: 'nhi', name: 'Chị Nhi', username: 'nhi', role: 'BOD_L1', region: 'ALL', brand: 'ALL' }
            ];
        }
        return data;
    },

    async saveUser(user) {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                region: user.region || 'ALL',
                brand: user.brand || 'ALL',
                email: user.email,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
        if (error) console.error('Error saving user:', error);
    },

    async deleteUser(id) {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) console.error('Error deleting user:', error);
    },
};
