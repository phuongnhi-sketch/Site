import { supabase } from './supabaseClient.js';

const STATUS_LABELS = {
    'DRAFT': 'Draft', 'SUBMITTED': 'Submitted', 'GATE1': 'Survey',
    'GATE2': 'Sitepack', 'GATE3': 'Deal', 'FINISH': 'Complete', 'REJECTED': 'Rejected',
};

export { STATUS_LABELS };

export const SiteService = {
    async getSites() {
        const { data, error } = await supabase
            .from('sites')
            .select('*, comments:site_comments(*), mpsa_entries:mpsa_history(*)')
            .order('created_at', { ascending: false });
        if (error) { 
            console.warn('Supabase not ready, using mock sites:', error); 
            return [
                { id: '1', site_code: 'MB-2024-001', name: 'Mặt bằng Ngã Sáu Ô Chợ Dừa', thumb: 'https://images.unsplash.com/photo-1577495508326-0610ce394464?w=200&h=200&fit=crop', addr: 'Số 1, Ô Chợ Dừa, Đống Đa, Hà Nội', region: 'NORTH', price: 120000000, status: 'SUBMITTED', owner: 'system', answers: {} },
                { id: '2', site_code: 'MB-2024-002', name: 'Góc ngã tư Nguyễn Huệ', thumb: 'https://images.unsplash.com/photo-1541339905195-266293a20131?w=200&h=200&fit=crop', addr: '99 Nguyễn Huệ, Quận 1, TP. HCM', region: 'SOUTH', price: 250000000, status: 'GATE1', owner: 'system', answers: {} }
            ]; 
        }
        return data.map(s => ({ ...s, comments: s.comments || [], mpsa_history: s.mpsa_entries || [], owner: s.owner_id, inner_images: s.inner_images || [] }));
    },

    async getSiteById(id) {
        const { data, error } = await supabase
            .from('sites')
            .select('*, comments:site_comments(*), mpsa_entries:mpsa_history(*)')
            .eq('id', id).single();
        if (error) { console.error('Error:', error); return null; }
        return { ...data, comments: data.comments || [], mpsa_history: data.mpsa_entries || [], owner: data.owner_id, inner_images: data.inner_images || [] };
    },

    async save(site) {
        const isNew = !site.id;
        if (isNew) {
            const now = new Date();
            const yymmdd = now.getFullYear().toString().slice(-2) + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
            const { count } = await supabase.from('sites').select('*', { count: 'exact', head: true }).like('id', `${yymmdd}%`);
            site.id = yymmdd + ((count || 0) + 1).toString().padStart(2, '0');
        }
        const dbSite = {
            id: site.id, code: site.code || null, name: site.name, brand: site.brand || null,
            addr: site.addr || null, region: site.region || 'SOUTH', status: site.status || 'DRAFT',
            owner_id: site.owner_id || null, owner_name: site.owner_name || null,
            thumb_url: site.thumb || site.thumb_url || null, answers: site.answers || {},
            v2_data: site.v2_data || null, current_mpsa: site.current_mpsa || null,
            price: site.price || null, date: site.date || new Date().toLocaleDateString('vi-VN'),
            inner_images: site.inner_images || [], updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('sites').upsert(dbSite, { onConflict: 'id' });
        if (error) { console.error('Error saving site:', error); alert('Lỗi khi lưu: ' + error.message); return false; }
        if (isNew) {
            const sBrand = site.brand || (site.answers && site.answers.f0) || '';
            await NotificationService.add('admin-all', `🚀 Site mới: ${site.name} vừa được nộp!`, site.id);
            await NotificationService.add('bod_l1-all', `🚀 Site mới: ${site.name} vừa được nộp!`, site.id);
        }
        return true;
    },

    async updateStatus(id, status, commentText) {
        const site = await this.getSiteById(id);
        if (!site) return;
        const oldStatus = site.status;
        await supabase.from('sites').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
        if (commentText) {
            await supabase.from('site_comments').insert({ site_id: id, author_name: 'Hệ thống', text: commentText, stage: oldStatus });
        }
        await NotificationService.add(site.owner_id, `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id);
        await NotificationService.add('admin-all', `🔄 Hồ sơ ${site.name} chuyển sang: ${STATUS_LABELS[status]}`, id);
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
    },

    async updateMPSA(siteId, value, note) {
        await supabase.from('mpsa_history').insert({ site_id: siteId, value, note });
        await supabase.from('sites').update({ current_mpsa: value, updated_at: new Date().toISOString() }).eq('id', siteId);
    },

    async createVersion2(siteId) {
        const site = await this.getSiteById(siteId);
        if (!site) return;
        await supabase.from('sites').update({ v2_data: JSON.parse(JSON.stringify(site.answers)), updated_at: new Date().toISOString() }).eq('id', siteId);
    },

    getLatestData(site) { return site.v2_data || site.answers || {}; },

    async getStats() {
        const sites = await this.getSites();
        const stats = { north: { FINISH: 0, SURVEY: 0, SITEPACK: 0, DEAL: 0, REJECTED: 0, SUBMITTED: 0 }, south: { FINISH: 0, SURVEY: 0, SITEPACK: 0, DEAL: 0, REJECTED: 0, SUBMITTED: 0 } };
        sites.forEach(s => {
            const group = (s.region || 'SOUTH').toUpperCase().includes('NORTH') ? 'north' : 'south';
            let st = s.status;
            if (st === 'GATE1') st = 'SURVEY'; else if (st === 'GATE2') st = 'SITEPACK'; else if (st === 'GATE3') st = 'DEAL';
            if (stats[group] && stats[group][st] !== undefined) stats[group][st]++;
        });
        return stats;
    },

    async deleteSite(id) {
        const { error } = await supabase.from('sites').delete().eq('id', id);
        if (error) { console.error('Error deleting site:', error); return false; }
        return true;
    },
};

// Import NotificationService (cùng folder)
import { NotificationService } from './notificationService.js';
