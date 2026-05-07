import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwmjtyctvstrovmxuni.supabase.co';
const supabaseAnonKey = 'sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
    console.log("Bắt đầu tạo dữ liệu mẫu (Users & Sites)...");

    const users = [
        { email: 'admin@site.com', password: 'password123', meta: { username: 'admin', name: 'System Admin', role: 'ADMIN', region: 'ALL', brand: 'ALL' } },
        { email: 'mb_north@site.com', password: 'password123', meta: { username: 'mb_north', name: 'Nhân viên MB Bắc', role: 'MB', region: 'NORTH', brand: 'ALL' } },
        { email: 'mb_south@site.com', password: 'password123', meta: { username: 'mb_south', name: 'Nhân viên MB Nam', role: 'MB', region: 'SOUTH', brand: 'ALL' } },
        { email: 'bod@site.com', password: 'password123', meta: { username: 'bod_l1', name: 'Giám đốc khối', role: 'BOD_L1', region: 'ALL', brand: 'ALL' } },
        { email: 'project@site.com', password: 'password123', meta: { username: 'project', name: 'Quản lý dự án', role: 'PROJECT', region: 'ALL', brand: 'ALL' } }
    ];

    for (const u of users) {
        const { data, error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
            options: { data: u.meta }
        });
        if (error) {
            console.log(`❌ Lỗi tạo user ${u.email}:`, error.message);
        } else {
            console.log(`✅ Đã tạo user: ${u.email}`);
        }
    }

    console.log("\nBắt đầu tạo Mock Sites...");
    const mockSites = [
        { id: 'MB-2024-001', code: 'MB-2024-001', name: 'Mặt bằng Ngã Sáu Ô Chợ Dừa', thumb_url: 'https://images.unsplash.com/photo-1577495508326-0610ce394464?w=200&h=200&fit=crop', addr: 'Số 1, Ô Chợ Dừa, Đống Đa, Hà Nội', region: 'NORTH', price: 120000000, status: 'SUBMITTED', answers: {} },
        { id: 'MB-2024-002', code: 'MB-2024-002', name: 'Góc ngã tư Nguyễn Huệ', thumb_url: 'https://images.unsplash.com/photo-1541339905195-266293a20131?w=200&h=200&fit=crop', addr: '99 Nguyễn Huệ, Quận 1, TP. HCM', region: 'SOUTH', price: 250000000, status: 'GATE1', answers: {} },
        { id: 'MB-2024-003', code: 'MB-2024-003', name: 'Khu thương mại Landmark', thumb_url: 'https://images.unsplash.com/photo-1577495508326-0610ce394464?w=200&h=200&fit=crop', addr: 'Tôn Đức Thắng, Quận 1, TP. HCM', region: 'SOUTH', price: 400000000, status: 'GATE3', answers: {} }
    ];

    for (const s of mockSites) {
        const { error } = await supabase.from('sites').upsert(s, { onConflict: 'id' });
        if (error) {
            console.log(`❌ Lỗi tạo site ${s.name}:`, error.message);
        } else {
            console.log(`✅ Đã tạo site: ${s.name}`);
        }
    }

    console.log("\nHoàn tất việc Seed Data!");
}

seed();
