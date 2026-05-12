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

    async add(userId, msg, siteId, shouldEmail = true) {
        // 1. Lưu vào Database trước (Luôn lưu để hiện trong App)
        const { error } = await supabase.from('notifications').insert({
            user_target: userId, message: msg, site_id: siteId,
        });
        if (error) {
            console.error('Error adding notification to DB:', error);
        }

        // 2. Gửi Email thông báo (Chỉ gửi nếu shouldEmail là true)
        if (shouldEmail) {
            try {
                let emails = [];
                
                if (userId.includes('-all')) {
                    // Lấy email của tất cả user thuộc role đó
                    const roleMap = { 
                        'admin-all': 'ADMIN', 
                        'project-all': 'PROJECT', 
                        'bod_l1-all': 'BOD_L1',
                        'bod_l2-all': 'BOD_L2',
                        'mb-all': 'MB'
                    };
                    const targetRole = roleMap[userId];
                    if (targetRole) {
                        let query = supabase.from('users').select('email, region, brand').eq('role', targetRole).eq('is_active', true);
                        const { data: users } = await query;
                        
                        if (users && users.length > 0) {
                            if (siteId && (targetRole === 'MB' || targetRole === 'BOD_L2')) {
                                // Lấy thông tin site để lọc vùng miền/brand
                                const { data: site } = await supabase.from('sites').select('region, brand').eq('id', siteId).single();
                                if (site) {
                                    emails = users.filter(u => {
                                        if (targetRole === 'MB' || targetRole === 'PROJECT') {
                                            // MB & Project: Chỉ lọc theo Vùng miền
                                            return (u.region === 'ALL' || u.region === site.region);
                                        }
                                        if (targetRole === 'BOD_L2') {
                                            // BOD L2: Chỉ lọc theo Thương hiệu
                                            return (u.brand === 'ALL' || u.brand === site.brand);
                                        }
                                        return true;
                                    }).map(u => u.email).filter(e => !!e && !e.endsWith('@system.com'));
                                } else {
                                    emails = users.map(u => u.email).filter(e => !!e && !e.endsWith('@system.com'));
                                }
                            } else {
                                // Admin/BOD L1 nhận tất cả
                                emails = users.map(u => u.email).filter(e => !!e && !e.endsWith('@system.com'));
                            }
                        }
                    }
                } else {
                    // Lấy email của 1 user cụ thể
                    const { data } = await supabase.from('users').select('email').eq('id', userId).single();
                    if (data && data.email && !data.email.endsWith('@system.com')) {
                        emails = [data.email];
                    }
                }

                if (emails.length > 0) {
                    console.log('Sending notification email to:', emails);
                    const apiUrl = window.location.origin + '/api/send-email';
                    const res = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: emails,
                            subject: '[Site Management] Thông báo mới',
                            text: msg,
                            html: `
                                <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 12px;">
                                    <h2 style="color: #2563EB;">🔔 Thông báo từ Site Management</h2>
                                    <p style="font-size: 1.1rem;">${msg}</p>
                                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                                    <p style="font-size: 0.8rem; color: #666;">Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>
                                    <a href="${window.location.origin}" style="display: inline-block; padding: 10px 20px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Mở Website</a>
                                </div>
                            `
                        })
                    });
                    const result = await res.json();
                    console.log('Email API response:', result);
                }
            } catch (err) {
                console.error('Error sending notification email:', err);
            }
        }
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
