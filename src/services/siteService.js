export const STATUS_LABELS = {
    'DRAFT': 'Draft',
    'SUBMITTED': 'Submitted',
    'GATE1': 'Survey',
    'GATE2': 'Sitepack',
    'GATE3': 'Deal',
    'FINISH': 'Complete',
    'REJECTED': 'Rejected'
};

import { supabase } from './supabaseClient.js';
import { NotificationService } from './notificationService.js';

/**
 * Helper: Trả về dữ liệu hiển thị mới nhất (v2_data nếu có, ngược lại answers).
 */
function getLatestData(site) {
    return site.v2_data || site.answers || {};
}

export const SiteService = {
    /**
     * Trả về dữ liệu hiển thị mới nhất cho site (v2_data hoặc answers).
     */
    getLatestData(site) {
        return getLatestData(site);
    },

    async getSites() {
        const { data, error } = await supabase
            .from('sites')
            .select(`
                *,
                comments:site_comments(*),
                mpsa_history(*)
            `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching sites:', error);
            return [];
        }
        // Map thumb_url → thumb & comment fields cho tương thích UI legacy
        return (data || []).map(s => ({ 
            ...s, 
            thumb: s.thumb_url || s.thumb,
            comments: (s.comments || []).map(c => ({
                ...c,
                author: c.author_name || c.author,
                date: c.created_at || c.date
            }))
        }));
    },

    async getSiteById(id) {
        const { data, error } = await supabase
            .from('sites')
            .select(`
                *,
                comments:site_comments(*),
                mpsa_history(*)
            `)
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching site:', error);
            return null;
        }
        // Map thumb_url → thumb & comment fields cho tương thích UI legacy
        if (data) {
            data.thumb = data.thumb_url || data.thumb;
            data.comments = (data.comments || []).map(c => ({
                ...c,
                author: c.author_name || c.author,
                date: c.created_at || c.date
            }));
        }
        return data;
    },

    async save(site) {
        const { data, error } = await supabase
            .from('sites')
            .upsert({
                id: site.id,
                owner_id: site.owner_id,
                owner_name: site.owner_name,
                region: site.region,
                status: site.status,
                thumb_url: site.thumb,
                inner_images: site.inner_images,
                name: site.name,
                brand: site.brand,
                price: site.price,
                answers: site.answers,
                v2_data: site.v2_data,
                current_mpsa: site.current_mpsa,
                code: site.code,
                date: site.date
            });
        if (error) {
            console.error('Error saving site:', error);
            return false;
        }
        return true;
    },

    async deleteSite(id) {
        const { error } = await supabase
            .from('sites')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting site:', error);
            return false;
        }
        return true;
    },

    async updateStatus(id, status, commentText) {
        const site = await this.getSiteById(id);
        if (!site) return;

        const { error } = await supabase
            .from('sites')
            .update({ status })
            .eq('id', id);
        if (error) {
            console.error('Error updating status:', error);
            return;
        }

        if (commentText) {
            await this.addComment(id, commentText, 'Hệ thống');
        }
        const shouldEmail = ['SUBMITTED', 'GATE2', 'GATE3'].includes(status);
        
        // Luôn thông báo cho Chủ hồ sơ (MB), Admin và BOD
        await NotificationService.add(site.owner_id, `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id, shouldEmail);
        await NotificationService.add('admin-all', `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id, shouldEmail);
        await NotificationService.add('bod_l1-all', `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id, shouldEmail);
        await NotificationService.add('bod_l2-all', `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id, shouldEmail);
        
        // Nếu chuyển sang bước Khảo sát (SURVEY), thông báo thêm cho Team Project
        if (status === 'SURVEY') {
            await NotificationService.add('project-all', `👷 Hồ sơ ${site.name} cần khảo sát`, id, false);
        }
    },

    async addComment(siteId, text, authorName) {
        const site = await this.getSiteById(siteId);
        if (!site) return;
        await supabase.from('site_comments').insert({ site_id: siteId, author_name: authorName, text, stage: site.status });
        
        // Bình luận thì gửi thông báo chuông (không gửi mail) cho tất cả bên liên quan
        // BỎ QUA thông báo nếu là 'Hệ thống' bình luận (để tránh trùng lặp với thông báo chuyển trạng thái)
        if (authorName === 'Hệ thống') return;

        if (authorName !== site.owner_name) {
            await NotificationService.add(site.owner_id, `💬 ${authorName} bình luận: ${text.substring(0, 50)}...`, siteId, false);
        }
        await NotificationService.add('admin-all', `💬 ${authorName} bình luận trong ${site.name}`, siteId, false);
        await NotificationService.add('bod_l1-all', `💬 ${authorName} bình luận trong ${site.name}`, siteId, false);
        await NotificationService.add('project-all', `💬 ${authorName} bình luận trong ${site.name}`, siteId, false);
    },

    async updateMPSA(siteId, value, note) {
        await supabase.from('mpsa_history').insert({ site_id: siteId, value, note });
        const { error } = await supabase
            .from('sites')
            .update({ current_mpsa: value })
            .eq('id', siteId);
        if (error) console.error('Error updating MPSA:', error);
    },

    async createVersion2(id) {
        const site = await this.getSiteById(id);
        if (!site) return;
        const { error } = await supabase
            .from('sites')
            .update({ v2_data: JSON.parse(JSON.stringify(site.answers)) })
            .eq('id', id);
        if (error) console.error('Error creating V2:', error);
    }
};
