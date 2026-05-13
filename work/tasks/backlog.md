# BACKLOG.MD - DANH SÁCH TÍNH NĂNG CHỜ LÀM (UPDATED)

Danh sách các task cần thực hiện để hoàn thành Site Management Web (POC) - v2.0 Gate Pipeline.

## Phase 1: Nền tảng & Xác thực (Foundation & Auth)
- [ ] Thiết kế Database Schema chi tiết (PostgreSQL) - *Cần cập nhật cho Versioning*.
- [ ] Setup dự án Frontend (React/Next.js) và Backend.
- [ ] Xây dựng tính năng Đăng nhập & Phân quyền (RBAC) - *Thêm BOD Level 1/2*.
- [ ] API quản lý User (Dành cho Admin).

## Phase 2: Quản lý Mặt bằng (Site Management)
- [x] Chức năng Tạo hồ sơ mặt bằng (Form nhập liệu + Map).
- [ ] Bổ sung trường **Brand** (Bắt buộc) vào form tạo site.
- [x] Tính năng Lưu bản nháp (Save Draft) & Nộp hồ sơ (Submit).
- [x] Upload nhiều hình ảnh/file đính kèm (có nén ảnh).
- [x] Chế độ xem danh sách (Site List) với bộ lọc vùng miền và trạng thái.

## Phase 3: Workflow & Q&A
- [x] Trang chi tiết hồ sơ (Site Detail).
- [x] Hệ thống Timeline trao đổi (Q&A/Comment thread).
- [ ] Cập nhật Timeline: Hiển thị **Stage/Gate** tại thời điểm comment.
- [ ] Implement **Gate Pipeline (1-Survey, 2-Sitepack, 3-Deal)**.
- [x] Cơ chế ra quyết định cuối cùng (Final Decision).

## Phase 4: Bảo mật & Nâng cao
- [x] Logic che thông tin tài chính cho Project Team.
- [ ] Logic che thông tin tài chính cho tất cả (trừ Admin) khi trạng thái là **Finish**.
- [ ] Hệ thống thông báo (Notifications) theo Brand + Role.
- [x] Trang Admin cấu hình hệ thống.
- [ ] Xuất báo cáo (Export Excel/PDF) hỗ trợ 2 Version.
- [ ] Trang Map View (Hiển thị các vị trí trên bản đồ).

## Phase 5: Pipeline & Versioning (NEW ⭐)
- [ ] Tính năng **MPSA Estimate** (Admin nhập & xem lịch sử).
- [ ] Tính năng **Versioning** tại Gate 3 (Tạo Version 2 từ Version 1).
- [ ] UI: Switcher giữa Version 1 và Version 2 trong trang chi tiết.
- [ ] Phân quyền BOD Level 2 (Chặn theo Brand trước khi Finish).
- [ ] **Tích hợp Zalo Notification**: Gửi thông báo trực tiếp qua Zalo cho các bên liên quan.

---
*Ghi chú: Ưu tiên thực hiện theo thứ tự các Phase để đảm báo tính liên mạch.*
