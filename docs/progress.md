# PROGRESS.MD - TIẾN ĐỘ DỰ ÁN (v3.0 SUPABASE + VERCEL)

Tài liệu theo dõi trạng thái và tiến độ tổng thể của dự án Site Management Web (POC).

## 1. Trạng thái hiện tại
- **Phase**: 6 - Triển khai Supabase + Vercel (Web thật)
- **Status**: **Đang lên kế hoạch triển khai lên web có database thật.**
- **Cột mốc**: Chuyển đổi từ POC (localStorage) sang Supabase (PostgreSQL + Auth + Storage) và deploy lên Vercel.

## 2. Các mốc quan trọng (Milestones)
- [x] Thiết lập Framework Mode A (2026-04-22).
- [x] Hoàn thiện Master POC demo.html v1.8 (2026-04-22).
- [x] Nâng cấp Master Prompt lên v2.0 (Gate Pipeline & Versioning) (2026-04-23).
- [x] **Cập nhật demo.html hỗ trợ Pipeline (Survey / Sitepack / Deal / Complete)** (2026-04-23).
- [x] **Triển khai v2.5: Trạng thái Rejected, Nâng cấp Xuất báo cáo & Tối ưu UI** (2026-05-04).
- [x] **Định dạng tiền tệ và căn lề PDF chuyên nghiệp** (2026-05-04).
- [x] **Đồng bộ nhãn phân quyền (BOD, Project) & Lời chào cá nhân hóa** (2026-05-04).
- [x] **Triển khai Lightbox Gallery: Xem ảnh ngay trên trang & chuyển ảnh linh hoạt** (2026-05-05).
- [x] **Nâng cấp Map Dashboard: SVG Việt Nam tương tác, thống kê NORTH/SOUTH, RBAC theo vùng miền** (2026-05-05).
- [x] **Phase 6: Triển khai Supabase + Vercel** — Web thật có database, auth, link truy cập (2026-05-06 →).
- [x] **Đồng bộ UI/UX Parity (Sidebar, Dashboard, Font size)** — Đạt trạng thái hiển thị 1:1 với demo.html (2026-05-07).

## 3. Danh sách đã hoàn thành (v2.0)
- [x] Hệ thống Status mới: Submitted / Survey / Sitepack / Deal / Complete.
- [x] Phân quyền BOD Level 1 (Global) & BOD Level 2 (Brand-restricted).
- [x] Tính năng Version 2 (Snapshot dữ liệu Deal) tại Gate 3.
- [x] MPSA Estimate History cho Admin.
- [x] Timeline gán nhãn Stage (Giai đoạn) cho từng comment.
- [x] Quy tắc bảo mật: Ẩn giá thuê/cọc đối với Project và sau khi Finish.

- [x] Triển khai Phase 4 mở rộng: Map View nâng cao (2026-04-23).
- [x] Triển khai Hệ thống thông báo (Notifications) theo Brand + Role (2026-04-23).
- [x] Triển khai Xuất báo cáo (Export Report) đa phiên bản (2026-04-23).

## 5. Việc tiếp theo (Next Priorities)
1. **[✅ XONG] Phase 6.1**: Cài Node.js, khởi tạo project, tạo SQL migration.
2. **[✅ XONG] Phase 6.2**: Viết 7 service modules (Supabase).
3. **[✅ XONG] Phase 6.1b**: Chạy SQL trên Supabase + tạo Storage bucket (Nhi đã làm 07/05).
4. **[✅ XONG] Phase 6.3**: Tách `demo.html` thành project Vite (CSS + Views + Router).
5. **[✅ XONG] Phase 6.4**: Test local & Đồng bộ giao diện (UI/UX Parity).
6. **[✅ XONG] Phase 6.5**: Deploy lên Vercel.
7. **[✅ XONG] Phase 6.6**: Tích hợp UI tạo User tự động lên Supabase Auth ngay trong Vercel.
8. **[✅ XONG] Phase 6.7**: Sửa lỗi đăng nhập User mới, Gộp Username vào Email, và Fix lỗi Xuất PDF chi tiết.
9. **Phase 6.8**: Tích hợp & Kết nối hệ thống Thông báo (Notifications).
10. **Phase 6.9**: Kiểm thử, Đóng gói và Bàn giao dự án.

## 6. Yêu cầu Phase Backend (Future Requirements)
*Các tính năng này đã được ghi nhận và sẽ triển khai khi xây dựng Backend thực tế:*
- **Auto Email Notifications**: Tích hợp gửi email thông báo tự động (Nodemailer / SendGrid / Amazon SES) tới địa chỉ email của User khi có Noti mới.
## 7. Nhật ký Khắc phục lỗi (Incident Log)
- **2026-05-07: Lỗi Build Vercel & Sync Giao diện v3.2.1**
    - **Vấn đề**: Bản cập nhật v3.2.0 bị lỗi build trên Vercel do sai đường dẫn import Supabase và tồn tại file rác. Ngoài ra, giao diện Dashboard bị Việt hóa không đúng ý người dùng.
    - **Hậu quả**: Web không cập nhật bản mới, nút In PDF hoạt động không ổn định.
    - **Khắc phục**: 
        - Hoàn trả Dashboard về tiếng Anh (Draft, Submitted...).
        - Xóa bỏ Bar Chart theo yêu cầu.
        - Tối ưu PDF Engine: Mở cửa sổ ngay lập tức và đợi ảnh decode xong mới in.
        - Sửa lỗi import path và xóa thư mục `src/js/services` dư thừa.

- **2026-05-08: Fix Danh sách Site trống & Chuyển đổi Supabase Auth (v3.3.0) ✅**
    - **Vấn đề**: Danh sách Site trống do RLS chặn `anon` và sai lệch schema code/DB. Quá trình tạo user bằng SQL bị vướng Trigger cũ và Foreign Key.
    - **Giải pháp dứt điểm**:
        - ✅ Chuyển toàn bộ hệ thống sang **Supabase Auth** (Production-safe).
        - ✅ Đồng bộ tên cột: `thumb` -> `thumb_url`, `site_mpsa_history` -> `mpsa_history`.
        - ✅ Đổi domain xác thực nội bộ thành `@system.com` để tránh xung đột dữ liệu cũ.
        - ✅ Cập nhật `LoginView`: Chỉ hiển thị các Quick Demo buttons có trong database thật.
        - ✅ Dùng API Script khởi tạo tự động toàn bộ tài khoản an toàn không cần chạy SQL tay.
    - **Kết quả**: App hoạt động bảo mật. Đăng nhập thành công trên Vercel. Danh sách Site đã có thể truy xuất bình thường qua `authenticated` session.
    - **Bàn giao**: Đã deploy thành công lên Vercel. Ghi chú quản lý Auth lưu tại `docs/auth_guide.md`.

## 8. Hướng dẫn Đăng nhập Demo (Credentials)

> [!IMPORTANT]
> **Mật khẩu mới**: `123456` (Do Supabase yêu cầu tối thiểu 6 ký tự). Đuôi email nội bộ đã đổi thành `@system.com`.

| Tài khoản | Username | Password | Email |
|-----------|----------|----------|-------|
| Admin | admin | 123456 | admin@system.com |
| MB Bắc | ngoc | 123456 | ngoc@system.com |
| BOD | nam | 123456 | nam@system.com |
| BOD TPC | tpc | 123456 | tpc@system.com |
| Project | project | 123456 | project@system.com |
| BOD SW | su | 123456 | su@system.com |

*Lưu ý: Chị chỉ cần nhập Username (vd: admin) hoặc chọn nút Quick Demo để đăng nhập.*




