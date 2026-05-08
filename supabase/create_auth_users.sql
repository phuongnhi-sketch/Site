-- ============================================================
-- CLEAN SLATE: Tạo lại Auth Users chuẩn 100% cho Supabase
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Xóa sạch các user demo cũ trong Auth để tránh lỗi trùng lặp
DELETE FROM auth.users WHERE email LIKE '%@sitemanagement.app';

-- 2. Đảm bảo pgcrypto đã sẵn sàng
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. Hàm hỗ trợ tạo user (để code ngắn gọn và tránh sai sót)
DO $$
DECLARE
  instance_id_val UUID;
BEGIN
  -- Lấy instance_id thực tế từ hệ thống (nếu có)
  SELECT id INTO instance_id_val FROM auth.instances LIMIT 1;
  IF instance_id_val IS NULL THEN
    instance_id_val := '00000000-0000-0000-0000-000000000000';
  END IF;

  -- ADMIN
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, last_sign_in_at)
  VALUES (instance_id_val, gen_random_uuid(), 'authenticated', 'authenticated', 'admin@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"admin","name":"Chi Nhi (Admin)","role":"ADMIN","region":"ALL","brand":"ALL"}'::jsonb, now(), now(), now());

  -- NGOC (MB NORTH)
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, last_sign_in_at)
  VALUES (instance_id_val, gen_random_uuid(), 'authenticated', 'authenticated', 'ngoc@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"ngoc","name":"Ngọc","role":"MB","region":"NORTH","brand":"ALL"}'::jsonb, now(), now(), now());

  -- NAM (BOD L1)
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, last_sign_in_at)
  VALUES (instance_id_val, gen_random_uuid(), 'authenticated', 'authenticated', 'nam@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"nam","name":"Anh Nam","role":"BOD_L1","region":"ALL","brand":"ALL"}'::jsonb, now(), now(), now());

  -- PROJECT
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, last_sign_in_at)
  VALUES (instance_id_val, gen_random_uuid(), 'authenticated', 'authenticated', 'project@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"project","name":"Project Team","role":"PROJECT","region":"ALL","brand":"ALL"}'::jsonb, now(), now(), now());

  -- TPC (BOD L2)
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, last_sign_in_at)
  VALUES (instance_id_val, gen_random_uuid(), 'authenticated', 'authenticated', 'tpc@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"tpc","name":"BOD TPC","role":"BOD_L2","region":"ALL","brand":"TPC"}'::jsonb, now(), now(), now());

  -- SU (PROJECT)
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, last_sign_in_at)
  VALUES (instance_id_val, gen_random_uuid(), 'authenticated', 'authenticated', 'su@sitemanagement.app', crypt('123456', gen_salt('bf')), now(), '{"username":"su","name":"Nguyễn Văn Sứ","role":"PROJECT","region":"ALL","brand":"ALL"}'::jsonb, now(), now(), now());

END $$;

-- 4. Đồng bộ mật khẩu bảng public.users cho đồng nhất
UPDATE public.users SET password = '123456';
