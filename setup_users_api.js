import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const usersToCreate = [
    { email: 'admin@sitemanagement.app', password: '123456', meta: { username: 'admin', name: 'Chị Nhi (Admin)', role: 'ADMIN', region: 'ALL', brand: 'ALL' } },
    { email: 'ngoc@sitemanagement.app', password: '123456', meta: { username: 'ngoc', name: 'Ngọc (MB Bắc)', role: 'MB', region: 'NORTH', brand: 'ALL' } },
    { email: 'nam@sitemanagement.app', password: '123456', meta: { username: 'nam', name: 'Nam (BOD)', role: 'BOD_L1', region: 'ALL', brand: 'ALL' } },
    { email: 'project@sitemanagement.app', password: '123456', meta: { username: 'project', name: 'Team Project', role: 'PROJECT', region: 'ALL', brand: 'ALL' } },
    { email: 'tpc@sitemanagement.app', password: '123456', meta: { username: 'tpc', name: 'BOD TPC', role: 'BOD_L2', region: 'ALL', brand: 'TPC' } },
    { email: 'su@sitemanagement.app', password: '123456', meta: { username: 'su', name: 'BOD SW', role: 'BOD_L2', region: 'ALL', brand: 'SW' } }
];

async function setupUsers() {
    for (const u of usersToCreate) {
        console.log(`Signing up ${u.email}...`);
        const { data, error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
            options: { data: u.meta }
        });
        if (error) {
            console.error(`Error for ${u.email}:`, error.message);
        } else {
            console.log(`Success for ${u.email}:`, data.user?.id);
        }
    }
}

setupUsers();
