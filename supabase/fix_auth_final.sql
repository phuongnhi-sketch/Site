-- ============================================================
-- SCRIPT KHẮC PHỤC TRIỆT ĐỂ LỖI TRIGGER (V3)
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

-- BƯỚC 1: Xóa bỏ Trigger gây lỗi (Đây là nguyên nhân làm chị chạy script trước bị thất bại)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- BƯỚC 2: Xóa dữ liệu rác trong auth
DELETE FROM auth.identities WHERE provider = 'email' AND identity_data->>'email' LIKE '%@sitemanagement.app';
DELETE FROM auth.users WHERE email LIKE '%@sitemanagement.app';

-- BƯỚC 3: Tạo mới toàn bộ tài khoản Auth & Cập nhật ID sang bảng Users
DO $$
DECLARE
    uid UUID;
BEGIN
    -- 1. ADMIN
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
    VALUES (uid, 'authenticated', 'authenticated', 'admin@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"admin","name":"Chị Nhi (Admin)","role":"ADMIN","region":"ALL","brand":"ALL"}', now(), now());
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) 
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"admin@sitemanagement.app"}', uid::text)::jsonb, 'email', 'admin@sitemanagement.app', now(), now(), now());
    -- Liên kết bảng public.users
    UPDATE public.users SET password = '123456' WHERE username = 'admin';

    -- 2. NGỌC (MB Bắc)
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
    VALUES (uid, 'authenticated', 'authenticated', 'ngoc@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"ngoc","name":"Ngọc (MB Bắc)","role":"MB","region":"NORTH","brand":"ALL"}', now(), now());
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) 
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"ngoc@sitemanagement.app"}', uid::text)::jsonb, 'email', 'ngoc@sitemanagement.app', now(), now(), now());
    UPDATE public.users SET password = '123456' WHERE username = 'ngoc';

    -- 3. NAM (BOD)
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
    VALUES (uid, 'authenticated', 'authenticated', 'nam@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"nam","name":"Nam (BOD)","role":"BOD_L1","region":"ALL","brand":"ALL"}', now(), now());
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) 
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"nam@sitemanagement.app"}', uid::text)::jsonb, 'email', 'nam@sitemanagement.app', now(), now(), now());
    UPDATE public.users SET password = '123456' WHERE username = 'nam' OR username = 'Nam';

    -- 4. PROJECT
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
    VALUES (uid, 'authenticated', 'authenticated', 'project@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"project","name":"Team Project","role":"PROJECT","region":"ALL","brand":"ALL"}', now(), now());
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) 
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"project@sitemanagement.app"}', uid::text)::jsonb, 'email', 'project@sitemanagement.app', now(), now(), now());
    UPDATE public.users SET password = '123456' WHERE username = 'project' OR username = 'Project';

    -- 5. TPC (BOD TPC)
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
    VALUES (uid, 'authenticated', 'authenticated', 'tpc@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"tpc","name":"BOD TPC","role":"BOD_L2","region":"ALL","brand":"TPC"}', now(), now());
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) 
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"tpc@sitemanagement.app"}', uid::text)::jsonb, 'email', 'tpc@sitemanagement.app', now(), now(), now());
    UPDATE public.users SET password = '123456' WHERE username = 'tpc' OR username = 'TPC';

    -- 6. SU (BOD SW)
    uid := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) 
    VALUES (uid, 'authenticated', 'authenticated', 'su@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"su","name":"BOD SW","role":"BOD_L2","region":"ALL","brand":"SW"}', now(), now());
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) 
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"su@sitemanagement.app"}', uid::text)::jsonb, 'email', 'su@sitemanagement.app', now(), now(), now());
    UPDATE public.users SET password = '123456' WHERE username = 'su' OR username = 'Su';
END $$;
