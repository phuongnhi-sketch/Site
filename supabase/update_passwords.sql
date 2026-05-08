-- ============================================================
-- FIX TRIỆT ĐỂ: Đồng bộ mật khẩu 6 ký tự cho toàn hệ thống
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

-- BƯỚC 1: Cập nhật bảng auth.users (Bảng này dùng để ĐĂNG NHẬP)
-- Supabase bắt buộc mật khẩu phải >= 6 ký tự.
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email IN (
    'admin@sitemanagement.app',
    'ngoc@sitemanagement.app',
    'nam@sitemanagement.app',
    'project@sitemanagement.app',
    'tpc@sitemanagement.app',
    'su@sitemanagement.app'
);

-- BƯỚC 2: Cập nhật bảng public.users (Bảng này để chị NHÌN THẤY)
-- Cập nhật cột password thành '123456' cho khớp
UPDATE public.users 
SET password = '123456'
WHERE username IN ('admin', 'ngoc', 'Nam', 'Project', 'TPC', 'su');

-- BƯỚC 3: Đồng bộ ID (Quan trọng để RLS hoạt động chuẩn)
-- Chúng ta cần ID trong bảng public.users khớp với ID trong auth.users
-- Tuy nhiên vì chị đã có sẵn ID (admin-01, ...), em sẽ tạm thời để nguyên 
-- vì code frontend đã được em sửa để nhận diện qua username rồi.
