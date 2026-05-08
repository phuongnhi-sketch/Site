-- ============================================================
-- FIX: Tạo Auth Users cho Site Management
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================
-- BƯỚC 1: Xóa trigger cũ (nó reference bảng 'profiles' không tồn tại)
-- BƯỚC 2: Tạo trigger mới reference bảng 'users' 
-- BƯỚC 3: Tạo auth users (trigger tự insert vào bảng 'users')
-- BƯỚC 4: Thêm RLS policy cho bảng 'users' (cho authenticated đọc)
-- ============================================================

-- ========== BƯỚC 1: Xóa trigger + function cũ ==========
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ========== BƯỚC 2: Tạo trigger mới cho bảng 'users' ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, password, name, role, region, brand)
    VALUES (
        NEW.id::text,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        '***',
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'MB'),
        COALESCE(NEW.raw_user_meta_data->>'region', 'ALL'),
        COALESCE(NEW.raw_user_meta_data->>'brand', 'ALL')
    );
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    -- User đã tồn tại trong bảng users, bỏ qua
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== BƯỚC 3: Tạo auth users ==========
-- Bật extension pgcrypto (thường đã bật sẵn)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin (Chị Nhi) — map với admin-01 trong bảng users
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'admin@sitemanagement.app',
    crypt('123', gen_salt('bf')),
    now(),
    '{"username":"admin","name":"Chi Nhi (Admin)","role":"ADMIN","region":"ALL","brand":"ALL"}'::jsonb,
    now(), now(), '', ''
);

-- MB Bắc (ngoc)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'ngoc@sitemanagement.app',
    crypt('123', gen_salt('bf')),
    now(),
    '{"username":"ngoc","name":"Ngoc","role":"MB","region":"NORTH","brand":"ALL"}'::jsonb,
    now(), now(), '', ''
);

-- BOD Level 1 (Nam)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'nam@sitemanagement.app',
    crypt('123', gen_salt('bf')),
    now(),
    '{"username":"Nam","name":"Anh Nam","role":"BOD_L1","region":"ALL","brand":"ALL"}'::jsonb,
    now(), now(), '', ''
);

-- Project
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'project@sitemanagement.app',
    crypt('123', gen_salt('bf')),
    now(),
    '{"username":"Project","name":"Project","role":"PROJECT","region":"ALL","brand":"ALL"}'::jsonb,
    now(), now(), '', ''
);

-- BOD Level 2 - TPC
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'tpc@sitemanagement.app',
    crypt('123', gen_salt('bf')),
    now(),
    '{"username":"TPC","name":"TPC","role":"BOD_L2","region":"ALL","brand":"TPC"}'::jsonb,
    now(), now(), '', ''
);

-- Project (Nguyễn Văn Sứ)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), 'authenticated', 'authenticated',
    'su@sitemanagement.app',
    crypt('123', gen_salt('bf')),
    now(),
    '{"username":"su","name":"Nguyễn Văn Sứ","role":"PROJECT","region":"ALL","brand":"ALL"}'::jsonb,
    now(), now(), '', ''
);

-- ========== BƯỚC 4: RLS cho bảng users ==========
-- Đảm bảo authenticated users có thể đọc bảng users
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users are viewable by authenticated'
    ) THEN
        EXECUTE 'CREATE POLICY "Users are viewable by authenticated" ON public.users FOR SELECT TO authenticated USING (true)';
    END IF;
END $$;

-- Cho phép authenticated insert/update (để Admin quản lý users)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Authenticated can manage users'
    ) THEN
        EXECUTE 'CREATE POLICY "Authenticated can manage users" ON public.users FOR ALL TO authenticated USING (true)';
    END IF;
END $$;
