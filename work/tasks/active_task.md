# ACTIVE_TASK.MD - TRIỂN KHAI SUPABASE + VERCEL (Phase 6) ✅ HOÀN THÀNH

## 1. Thông tin Task
- **Tên Task**: Triển khai Site Management lên Web thật (Supabase + Vercel).
- **Mục tiêu**: Chuyển đổi POC từ localStorage sang Supabase (Database + Auth + Storage), deploy lên Vercel.
- **Phương án đã chọn**: Phương án A — Supabase + Vercel (Miễn phí).
- **Project Owner**: Nhi.
- **Ngày bắt đầu**: 2026-05-06.
- **Trạng thái**: ✅ **Đã hoàn thành và deploy thành công.**

## 2. Thông tin Supabase
- **Project URL**: `https://gvwmjtyctvstrovmxuni.supabase.co`
- **Anon Key**: `sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy`
- **Storage**: Bucket `site-photos` (Public) - Đã tạo.

## 3. Kế hoạch & Trạng thái

### Phase 6.1: Chuẩn bị & Thiết lập ✅ HOÀN THÀNH
- [x] Cài đặt Node.js v24.15.0 LTS + npm v11.12.1.
- [x] Khởi tạo project: `package.json`, `vite.config.js`, `.env`.
- [x] Cài dependencies: `vite`, `@supabase/supabase-js`.
- [x] Tạo `.gitignore` (thêm `.env`, `dist/`).
- [x] Tạo file SQL migration: `supabase/migration.sql`.
- [x] **NHI ĐÃ LÀM**: Chạy `supabase/migration.sql` trong Supabase SQL Editor.
- [x] **NHI ĐÃ LÀM**: Tạo Storage Bucket `site-photos` (Public) trong Supabase Dashboard.

### Phase 6.2: Tạo Services (Data Layer) ✅ HOÀN THÀNH
- [x] `src/services/supabaseClient.js` — Supabase client singleton.
- [x] `src/services/authService.js` — Đăng nhập/đăng xuất qua Supabase Auth.
- [x] `src/services/siteService.js` — CRUD sites qua Supabase.
- [x] `src/services/notificationService.js` — CRUD notifications qua Supabase.
- [x] `src/services/userService.js` — Quản lý profiles qua Supabase.
- [x] `src/services/formService.js` — Quản lý form fields qua Supabase.
- [x] `src/services/storageService.js` — Upload/nén ảnh lên Supabase Storage.

### Phase 6.3: Tách demo.html → Project Vite ✅ HOÀN THÀNH
- [x] Tách CSS từ demo.html → `src/styles/main.css`.
- [x] Tách SVG Map data → `src/assets/vietnam-map.js`.
- [x] Tách Views từ demo.html thành các file riêng biệt trong `src/js/views/`.
- [x] Tạo `src/js/router.js` — Hash-based router.
- [x] Tạo `src/js/app.js` — App entry point.
- [x] Tạo `index.html` mới cho Vite.
- [x] Cập nhật tất cả Views: đổi từ sync → async/await.

### Phase 6.4: Tạo Users & Test Local ✅ HOÀN THÀNH
- [x] Tạo users mẫu trên Supabase Auth (admin, mb_north, mb_south, bod_l1, project).
- [x] Seed sites mẫu (Mock data) vào database.
- [x] Chạy `npm run dev` → test local tất cả chức năng.
- [x] Test RBAC (phân quyền theo role).
- [x] Sửa lỗi giao diện và điều hướng modal, Export PDF/Excel.

### Phase 6.5: Deploy lên Vercel ✅ HOÀN THÀNH
- [x] Push code lên GitHub.
- [x] Kết nối GitHub → Vercel.
- [x] Cấu hình Environment Variables trên Vercel.
- [x] Deploy thành công link production.

### Phase 6.6: Kiểm thử & Hoàn thiện ✅ HOÀN THÀNH
- [x] Test toàn bộ trên production.
- [x] Sửa lỗi giao diện (font size, layout) cho khớp với bản demo cũ.
- [x] Tích hợp hệ thống thông báo Email qua Resend (đã chuyển sang Gmail SMTP ổn định).
- [x] Kiểm tra lại các quy tắc bảo mật (RLS) lần cuối.
- [x] Đóng gói tài liệu bàn giao.
- [x] Thêm tính năng xóa ảnh khi soạn hồ sơ.

## 4. Cấu trúc file hiện tại

```
d:\AI\Site_Management\
├── .env
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── services/       ← Supabase services
│   ├── js/
│   │   ├── views/      ← Các màn hình ứng dụng
│   │   ├── router.js
│   │   ├── app.js
│   │   └── globals.js
│   ├── assets/         ← Map data, images
│   └── styles/         ← main.css
└── docs/, work/        ← Tài liệu & Task logs
```

## 5. Lưu ý quan trọng
- **Đã deploy lên Vercel**: Mọi thay đổi code cần được test local kỹ trước khi push.
- **Auth**: Dùng `authService.js` và Supabase Auth. Credentials đã cập nhật trong `docs/progress.md`.
- **Dữ liệu**: Đồng bộ hoàn toàn với Supabase, không dùng localStorage cho dữ liệu chính nữa.
