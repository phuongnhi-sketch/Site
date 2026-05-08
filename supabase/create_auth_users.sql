-- ============================================================
-- EMERGENCY FIX v2: Gỡ lỗi Database error querying schema
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

-- BƯỚC 1: Gỡ bỏ Trigger và Function (Nghi ngờ gây xung đột schema)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- BƯỚC 2: Dọn dẹp các bản ghi lỗi
DELETE FROM auth.users WHERE email LIKE '%@sitemanagement.app';

-- BƯỚC 3: Tạo ADMIN với cấu trúc tối giản nhất (Mật khẩu: 123456)
-- Đã loại bỏ cột 'confirmed_at' vì đây là cột tự động (generated)
INSERT INTO auth.users (
    id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    created_at, 
    updated_at, 
    confirmation_token, 
    recovery_token, 
    is_super_admin
) VALUES (
    gen_random_uuid(), 
    'authenticated', 
    'authenticated', 
    'admin@sitemanagement.app', 
    '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8vA66/uXvJEq.7Ff/rVlX.FvV/rVlX', 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"username":"admin","name":"Chi Nhi (Admin)","role":"ADMIN","region":"ALL","brand":"ALL"}', 
    now(), 
    now(), 
    '', 
    '', 
    false
);

-- BƯỚC 4: Đồng bộ mật khẩu bảng public.users cho đồng nhất để chị quản lý
UPDATE public.users SET password = '123456' WHERE username = 'admin';
