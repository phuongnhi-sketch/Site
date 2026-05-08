
-- Sửa lỗi không xóa được User do vướng dữ liệu (Foreign Key Constraint) - BẢN FIX
-- Bản này đã bỏ phần author_id bị lỗi.

-- 1. Sửa khóa ngoại ở bảng sites (Đây là nguyên nhân chính gây lỗi)
ALTER TABLE public.sites
DROP CONSTRAINT IF EXISTS sites_owner_id_fkey,
ADD CONSTRAINT sites_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. Sửa khóa ngoại ở bảng notifications
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_target_fkey,
ADD CONSTRAINT notifications_user_target_fkey 
FOREIGN KEY (user_target) REFERENCES public.users(id) ON DELETE CASCADE;

-- Sau khi chạy xong 2 lệnh này, chị quay lại web và xóa User 'ngoc' nhé!
