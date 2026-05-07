import { supabase } from './supabaseClient.js';

/**
 * UserService — Quản lý profiles qua Supabase (chỉ Admin dùng).
 */
export const UserService = {
    async getUsers() {
        console.log('Fetching users from Supabase...');
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: true });
            
        if (error) { 
            console.error('Supabase error fetching users:', error); 
            // Trả về mock users để web không bị trắng trang, nhưng cảnh báo
            return [
                { id: 'admin', name: 'Admin (Mock)', username: 'admin', password: '123', role: 'ADMIN', region: 'ALL', brand: 'ALL' },
                { id: 'nhi', name: 'Chị Nhi (Mock)', username: 'nhi', password: '123', role: 'ADMIN', region: 'ALL', brand: 'ALL' }
            ];
        }
        console.log('Users fetched successfully:', data);
        return data;
    },

    async saveUser(user) {
        console.log('Saving user to Supabase:', user);
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
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
            
        if (error) {
            console.error('Error saving user:', error);
            alert('LỖI KHI LƯU USER (Supabase): ' + error.message + '\nChị kiểm tra lại bảng [users] đã có cột [password] chưa nhé.');
            return false;
        }
        return true;
    },

    async deleteUser(id) {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) console.error('Error deleting user:', error);
    },
};
