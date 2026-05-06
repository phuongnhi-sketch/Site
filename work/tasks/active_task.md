# ACTIVE_TASK.MD - TRIỂN KHAI SUPABASE + VERCEL (Phase 6)

## 1. Thông tin Task
- **Tên Task**: Triển khai Site Management lên Web thật (Supabase + Vercel).
- **Mục tiêu**: Chuyển đổi POC từ localStorage sang Supabase (Database + Auth + Storage), deploy lên Vercel.
- **Phương án đã chọn**: Phương án A — Supabase + Vercel (Miễn phí).
- **Project Owner**: Nhi.
- **Ngày bắt đầu**: 2026-05-06.

## 2. Thông tin Supabase
- **Project URL**: `https://gvwmjtyctvstrovmxuni.supabase.co`
- **Anon Key**: `sb_publishable_FWeBhUGHaKpMQdinSvmECA_knVPHnEy`
- **Settings khi tạo**: Data API = ON, Auto expose tables = OFF, Automatic RLS = ON.

## 3. Kế hoạch & Trạng thái

### Phase 6.1: Chuẩn bị & Thiết lập ✅ ĐANG LÀM
- [x] Cài đặt Node.js v24.15.0 LTS + npm v11.12.1.
- [x] Khởi tạo project: `package.json`, `vite.config.js`, `.env`.
- [x] Cài dependencies: `vite`, `@supabase/supabase-js`.
- [x] Tạo `.gitignore` (thêm `.env`, `dist/`).
- [x] Tạo file SQL migration: `supabase/migration.sql` (7 bảng + RLS + seed + trigger).
- [ ] **⏳ CHỜ NHI**: Chạy `supabase/migration.sql` trong Supabase SQL Editor.
- [ ] **⏳ CHỜ NHI**: Tạo Storage Bucket `site-photos` (Public) trong Supabase Dashboard.

### Phase 6.2: Tạo Services (Data Layer) ✅ HOÀN THÀNH
- [x] `src/services/supabaseClient.js` — Supabase client singleton.
- [x] `src/services/authService.js` — Đăng nhập/đăng xuất qua Supabase Auth.
- [x] `src/services/siteService.js` — CRUD sites qua Supabase (thay localStorage).
- [x] `src/services/notificationService.js` — CRUD notifications qua Supabase.
- [x] `src/services/userService.js` — Quản lý profiles qua Supabase.
- [x] `src/services/formService.js` — Quản lý form fields qua Supabase.
- [x] `src/services/storageService.js` — Upload/nén ảnh lên Supabase Storage.

### Phase 6.3: Tách demo.html → Project Vite ✅ HOÀN THÀNH
- [x] Tách CSS từ demo.html → `src/styles/main.css`.
- [x] Tách SVG Map data → `src/assets/vietnam-map.js`.
- [x] Tách Views từ demo.html:
  - [ ] `src/views/LoginView.js` — Màn hình đăng nhập (dùng AuthService).
  - [ ] `src/views/DashboardView.js` — Trang chủ thống kê.
  - [ ] `src/views/SiteListView.js` — Danh sách hồ sơ + filter + export.
  - [ ] `src/views/DetailView.js` — Chi tiết hồ sơ + phê duyệt + timeline.
  - [ ] `src/views/CreateSiteView.js` — Form tạo/sửa hồ sơ.
  - [ ] `src/views/MapView.js` — Bản đồ Việt Nam SVG.
  - [ ] `src/views/UserManagementView.js` — Quản lý user (Admin).
  - [ ] `src/views/NotificationView.js` — Trang thông báo.
- [ ] Tạo `src/router.js` — Hash-based router.
- [ ] Tạo `src/app.js` — App entry point (sidebar, routing, auth check).
- [ ] Tạo `index.html` mới cho Vite (entry point).
- [x] Cập nhật tất cả Views: đổi từ sync → async/await.
- [x] Thêm loading states (spinner/skeleton) cho Views.

### Phase 6.4: Tạo Users & Test Local ✅ ĐANG LÀM
- [ ] Tạo users mẫu trên Supabase Auth (admin, mb_north, mb_south, bod_l1, project).
- [x] Seed sites mẫu (Mock data) vào database.
- [ ] Chạy `npm run dev` → test local tất cả chức năng.
- [ ] Test RBAC (phân quyền theo role).
- [x] Sửa lỗi giao diện và điều hướng modal (Mock data), Export PDF/Excel.

### Phase 6.5: Deploy lên Vercel ❌ CHƯA LÀM
- [ ] Push code lên GitHub.
- [ ] Kết nối GitHub → Vercel.
- [ ] Cấu hình Environment Variables trên Vercel.
- [ ] Deploy + test production link.

### Phase 6.6: Kiểm thử & Hoàn thiện ❌ CHƯA LÀM
- [ ] Test toàn bộ trên production.
- [ ] Fix bugs.
- [ ] Viết hướng dẫn sử dụng.

## 4. Cấu trúc file hiện tại

```
d:\AI\Site_Management\
├── .env                          ← Supabase credentials (KHÔNG COMMIT)
├── .gitignore
├── package.json                  ← Vite + Supabase deps
├── vite.config.js                ← Vite config
├── demo.html                     ← POC GỐC (giữ làm backup)
├── supabase/
│   └── migration.sql             ← SQL tạo bảng (CHỜ NHI CHẠY)
├── src/
│   ├── services/
│   │   ├── supabaseClient.js     ✅
│   │   ├── authService.js        ✅
│   │   ├── siteService.js        ✅
│   │   ├── notificationService.js ✅
│   │   ├── userService.js        ✅
│   │   ├── formService.js        ✅
│   │   └── storageService.js     ✅
│   ├── views/                    ← CẦN TÁCH TỪ demo.html
│   │   └── (chưa tạo)
│   └── styles/                   ← CẦN TÁCH TỪ demo.html
│       └── (chưa tạo)
└── docs/, work/, prompt/         ← Tài liệu giữ nguyên
```

## 5. Hướng dẫn cho phiên tiếp theo

### Nhi cần làm TRƯỚC khi tiếp tục:
1. Mở Supabase Dashboard → **SQL Editor** → paste nội dung `supabase/migration.sql` → **Run**.
2. Mở Supabase Dashboard → **Storage** → **New Bucket** → tên `site-photos` → bật **Public**.

### AI Agent cần làm:
1. Kiểm tra Nhi đã chạy SQL chưa (test bằng Supabase client).
2. Tiếp tục **Phase 6.3**: Tách `demo.html` thành modules:
   - Bắt đầu với CSS extraction → `src/styles/main.css`.
   - Sau đó tách từng View (LoginView → DashboardView → SiteListView → DetailView...).
   - Tạo router và app entry point.
   - Tạo `index.html` mới cho Vite.
3. Chuyển tất cả Views sang async (vì Supabase calls là async).
4. Test local bằng `npm run dev`.

### Lưu ý quan trọng:
- **KHÔNG xóa `demo.html`** — giữ làm backup/reference.
- **KHÔNG dùng script thay thế hàng loạt** — tách thủ công từng phần (rule #11, #12).
- **Kiểm tra UTF-8** mỗi khi tạo file mới có tiếng Việt.
- Supabase SDK calls đều là **async/await** → Views cần refactor từ `render()` sang `async render()`.
