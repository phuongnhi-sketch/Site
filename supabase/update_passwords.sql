-- ============================================================
-- FIX: Cập nhật mật khẩu 6 ký tự (123456) cho Auth Users
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================
-- Supabase thường mặc định yêu cầu mật khẩu tối thiểu 6 ký tự.
-- Script này cập nhật mật khẩu của 6 users lên '123456'.
-- ============================================================

-- Admin
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'admin@sitemanagement.app';

-- MB Bắc
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'ngoc@sitemanagement.app';

-- BOD Level 1
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'nam@sitemanagement.app';

-- Project
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'project@sitemanagement.app';

-- BOD Level 2 - TPC
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'tpc@sitemanagement.app';

-- Project (Sứ)
UPDATE auth.users 
SET encrypted_password = crypt('123456', gen_salt('bf'))
WHERE email = 'su@sitemanagement.app';
