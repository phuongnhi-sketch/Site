import { supabase } from './supabaseClient.js';

/**
 * NotificationService — CRUD thông báo qua Supabase.
 */
export const NotificationService = {
    async getNotifs(userId, role) {
        let query = supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50);
        
        // Fetch specific + role broadcasts
        const targets = [userId];
        if (role === 'ADMIN') targets.push('admin-all');
        if (role === 'BOD_L1') targets.push('bod_l1-all');
        if (role === 'PROJECT') targets.push('project-all');
        
        query = query.in('user_target', targets);

        const { data, error } = await query;
        if (error) { console.error('Error fetching notifs:', error); return []; }
        return data.map(n => ({ id: n.id, uId: n.user_target, msg: n.message, sId: n.site_id, date: n.created_at, isRead: n.is_read }));
    },

    async add(userId, msg, siteId) {
        const { error } = await supabase.from('notifications').insert({
            user_target: userId, message: msg, site_id: siteId,
        });
        if (error) console.error('Error adding notification:', error);
    },

    async markRead(id) {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    },

    async getUnreadCount(userId, role) {
        const targets = [userId];
        if (role === 'ADMIN') targets.push('admin-all');
        if (role === 'BOD_L1') targets.push('bod_l1-all');
        if (role === 'PROJECT') targets.push('project-all');

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .in('user_target', targets)
            .eq('is_read', false);
        if (error) return 0;
        return count || 0;
    },

    async clearAll() {
        const { error } = await supabase.from('notifications').delete().neq('id', 0);
        if (error) console.error('Error clearing notifications:', error);
    },
};
