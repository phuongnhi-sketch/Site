# DONE_LOG.MD - NHẬT KÝ HOÀN THÀNH

Lịch sử các công việc đã hoàn thành trong dự án Site Management.

## [2026-05-06] - Phase 6: Triển khai Supabase + Vercel (Bắt đầu)
- **Task**: Chuyển đổi POC sang web thật với Supabase + Vercel.
- **Kết quả**:
    - Phân tích 3 phương án triển khai → Nhi chọn **Phương án A (Supabase + Vercel)**.
    - Cài đặt **Node.js v24.15.0** trên máy Nhi.
    - Khởi tạo project: `package.json`, `vite.config.js`, `.env`.
    - Tạo **7 service modules** thay thế localStorage bằng Supabase SDK:
        - `supabaseClient.js`, `authService.js`, `siteService.js`
        - `notificationService.js`, `userService.js`, `formService.js`, `storageService.js`
    - Tạo **migration.sql** (7 bảng + RLS policies + seed data + auto-profile trigger).
    - Tạo Supabase project: `https://gvwmjtyctvstrovmxuni.supabase.co`.
- **Pending**: Nhi cần chạy SQL migration + tạo Storage bucket trên Supabase Dashboard.
- **Tiếp theo**: Phase 6.3 — Tách `demo.html` thành project Vite (CSS + Views + Router).

## [2026-04-23] - Nâng cấp v2.0 (Gate Pipeline & Versioning)
- **Task**: Triển khai đặc tả mới vào Master POC (`demo.html`).
- **Kết quả**: 
    - Đã nâng cấp `demo.html` lên bản **v2.0**.
    - Hệ thống trạng thái mới: **Submitted / Survey / Sitepack / Deal / Complete**.
    - Bổ sung trường **Brand** (Bắt buộc) và phân quyền **BOD Level 2** (Chặn theo brand).
    - Tính năng **Versioning (V1/V2)** và **MPSA History** đã hoạt động.
    - Timeline hiển thị nhãn giai đoạn (Stage context).
    - Bảo mật: Tự động ẩn thông tin tài chính nhạy cảm sau khi trạng thái là **Complete**.
- **Ghi chú**: Đã cập nhật toàn bộ tài liệu dự án trong `docs/` và `prompt/`.

## [2026-04-22] - Khởi tạo Framework & POC v1.8
- **Task**: Khởi tạo cấu trúc dự án và hoàn thiện bản POC v1.8.
- **Kết quả**: Đã tạo đầy đủ thư mục `docs`, `prompt`, `work`. Bản POC v1.8 hỗ trợ RBAC, nén ảnh và form động.
