
-- Thêm cột trạng thái hoạt động cho User
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Đảm bảo các user cũ đều đang ở trạng thái TRUE
UPDATE public.users SET is_active = TRUE WHERE is_active IS NULL;
