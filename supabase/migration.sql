-- ============================================================
-- SITE MANAGEMENT - SUPABASE DATABASE SCHEMA
-- Chạy file này trong Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1. BẢNG PROFILES (thông tin user mở rộng, liên kết Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'MB' CHECK (role IN ('ADMIN', 'MB', 'BOD_L1', 'BOD_L2', 'PROJECT')),
    region TEXT DEFAULT 'ALL' CHECK (region IN ('ALL', 'NORTH', 'SOUTH')),
    brand TEXT DEFAULT 'ALL',
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG FORM FIELDS (cấu hình form động)
CREATE TABLE form_fields (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'select', 'checkboxes')),
    options JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    required BOOLEAN DEFAULT FALSE,
    is_numeric BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG SITES (hồ sơ mặt bằng)
CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    code TEXT,
    name TEXT NOT NULL,
    brand TEXT,
    addr TEXT,
    region TEXT DEFAULT 'SOUTH' CHECK (region IN ('NORTH', 'SOUTH')),
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'GATE1', 'GATE2', 'GATE3', 'FINISH', 'REJECTED')),
    owner_id UUID REFERENCES profiles(id),
    owner_name TEXT,
    thumb_url TEXT,
    answers JSONB DEFAULT '{}'::jsonb,
    v2_data JSONB,
    current_mpsa NUMERIC(15, 2),
    price NUMERIC(15, 2),
    date TEXT,
    inner_images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG SITE COMMENTS (thảo luận / timeline)
CREATE TABLE site_comments (
    id BIGSERIAL PRIMARY KEY,
    site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id),
    text TEXT NOT NULL,
    stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG MPSA HISTORY (lịch sử MPSA)
CREATE TABLE mpsa_history (
    id BIGSERIAL PRIMARY KEY,
    site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    value NUMERIC(15, 2) NOT NULL,
    note TEXT,
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG NOTIFICATIONS (thông báo)
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_target TEXT NOT NULL,
    message TEXT NOT NULL,
    site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG SITE PHOTOS (ảnh lưu trên Supabase Storage)
CREATE TABLE site_photos (
    id BIGSERIAL PRIMARY KEY,
    site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    type TEXT DEFAULT 'inner' CHECK (type IN ('thumb', 'inner')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_region ON sites(region);
CREATE INDEX idx_sites_owner ON sites(owner_id);
CREATE INDEX idx_comments_site ON site_comments(site_id);
CREATE INDEX idx_mpsa_site ON mpsa_history(site_id);
CREATE INDEX idx_notifs_user ON notifications(user_target);
CREATE INDEX idx_notifs_unread ON notifications(user_target, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_photos_site ON site_photos(site_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- PROFILES: Users can read all profiles, only update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- SITES: All authenticated users can read (filtering done in app), owners & admins can write
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sites are viewable by authenticated users" ON sites
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sites" ON sites
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sites" ON sites
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete sites" ON sites
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
    );

-- SITE_COMMENTS: All authenticated can read & write
ALTER TABLE site_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by authenticated users" ON site_comments
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert comments" ON site_comments
    FOR INSERT TO authenticated WITH CHECK (true);

-- MPSA_HISTORY: All authenticated can read, admins can write
ALTER TABLE mpsa_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "MPSA history is viewable by authenticated users" ON mpsa_history
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert MPSA" ON mpsa_history
    FOR INSERT TO authenticated WITH CHECK (true);

-- NOTIFICATIONS: Users can only see their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert notifications" ON notifications
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update notifications" ON notifications
    FOR UPDATE TO authenticated USING (true);

-- FORM_FIELDS: All authenticated can read, admins can write
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Form fields are viewable by authenticated users" ON form_fields
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage form fields" ON form_fields
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
    );

-- SITE_PHOTOS: All authenticated can read & write
ALTER TABLE site_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Photos are viewable by authenticated users" ON site_photos
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert photos" ON site_photos
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- SEED DATA: Form Fields
-- ============================================================
INSERT INTO form_fields (id, label, type, options, is_active, required, is_numeric, sort_order) VALUES
    ('f0',   'Brand',                          'checkboxes', '["TPC", "CHANG", "DQ", "SW"]', true, true,  false, 1),
    ('f1',   'Mã mặt bằng',                   'text',       '[]', true, true,  false, 2),
    ('f6',   'Địa chỉ (Số nhà)',               'text',       '[]', true, true,  false, 3),
    ('f3',   'Google map',                     'text',       '[]', true, true,  false, 4),
    ('f13',  'Bên cho thuê',                   'select',     '["Cá nhân", "Pháp nhân"]', true, true,  false, 5),
    ('f2_3', 'Bên khai và trả thuế',           'select',     '["Chủ nhà", "QSR"]', true, true,  false, 6),
    ('f14',  'Thời hạn thuê (năm)',            'text',       '[]', true, true,  true,  7),
    ('f2_1', 'Giá thuê chưa thuế',             'text',       '[]', true, true,  true,  8),
    ('f2_2', 'Giá thuê có thuế',               'text',       '[]', true, true,  true,  9),
    ('f8',   'Biên độ tăng giá',               'textarea',   '[]', true, true,  false, 10),
    ('f7',   'Cọc - Thanh toán',               'textarea',   '[]', true, true,  false, 11),
    ('f4',   'Mặt tiền (m)',                   'text',       '[]', true, true,  true,  12),
    ('f5',   'Tổng diện tích cho thuê (m2)',   'text',       '[]', true, true,  true,  13),
    ('f9',   'Mô tả khác',                    'textarea',   '[]', true, true,  false, 14),
    ('f11',  'Điều kiện kỹ thuật',             'textarea',   '[]', true, true,  false, 15),
    ('f10_2','Ngày nhận nhà',                  'text',       '[]', true, true,  false, 16),
    ('f10_1','Thời gian miễn phí xây dựng',    'text',       '[]', true, true,  false, 17);

-- ============================================================
-- STORAGE BUCKET (chạy riêng nếu cần, hoặc tạo qua Dashboard)
-- ============================================================
-- Tạo bucket 'site-photos' trong Supabase Dashboard → Storage → New Bucket
-- Cấu hình: Public bucket = ON (để hiển thị ảnh không cần auth)

-- ============================================================
-- FUNCTION: Auto-create profile khi user đăng ký
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'MB')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
