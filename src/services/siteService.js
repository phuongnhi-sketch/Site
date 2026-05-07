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

export const SiteService = {
    async getSites() {
        const { data, error } = await supabase
            .from('sites')
            .select(`
                *,
                comments:site_comments(*),
                mpsa_history:site_mpsa_history(*)
            `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching sites:', error);
            return [];
        }
        return data || [];
    },

    async getSiteById(id) {
        const { data, error } = await supabase
            .from('sites')
            .select(`
                *,
                comments:site_comments(*),
                mpsa_history:site_mpsa_history(*)
            `)
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching site:', error);
            return null;
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
                thumb: site.thumb,
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
        await NotificationService.add(site.owner_id, `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id);
        await NotificationService.add('admin-all', `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id);
        await NotificationService.add('bod_l1-all', `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id);
        if (status === 'GATE1') await NotificationService.add('project-all', `👷 Site mới cần khảo sát: ${site.name}`, id);
    },

    async addComment(siteId, text, authorName) {
        const site = await this.getSiteById(siteId);
        if (!site) return;
        await supabase.from('site_comments').insert({ site_id: siteId, author_name: authorName, text, stage: site.status });
        if (authorName !== site.owner_name) {
            await NotificationService.add(site.owner_id, `💬 ${authorName} vừa bình luận trong hồ sơ ${site.name}`, siteId);
        }
        await NotificationService.add('admin-all', `💬 ${authorName} vừa bình luận trong hồ sơ ${site.name}`, siteId);
        await NotificationService.add('bod_l1-all', `💬 ${authorName} vừa bình luận trong hồ sơ ${site.name}`, siteId);
        await NotificationService.add('project-all', `💬 ${authorName} vừa bình luận trong hồ sơ ${site.name}`, siteId);
    },

    async updateMPSA(siteId, value, note) {
        await supabase.from('site_mpsa_history').insert({ site_id: siteId, value, note });
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
