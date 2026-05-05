# PROGRESS.MD - TIẾN ĐỘ DỰ ÁN (v2.3 MAP DASHBOARD)

Tài liệu theo dõi trạng thái và tiến độ tổng thể của dự án Site Management Web (POC).

## 1. Trạng thái hiện tại
- **Phase**: 5 - Gate Pipeline & Map Dashboard
- **Status**: **Đã hoàn thành nâng cấp Map Dashboard (Vietnam SVG + RBAC + Statistics).**
- **Cột mốc**: Hệ thống v2.3 với bản đồ Việt Nam tương tác, phân quyền theo vùng miền và thống kê pipeline theo region.

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
1. Tối ưu hóa hiệu năng và nén ảnh nâng cao.
2. Quản lý người dùng thực tế (User Management). Đã hoàn thành, hủy bỏ AI.

## 6. Yêu cầu Phase Backend (Future Requirements)
*Các tính năng này đã được ghi nhận và sẽ triển khai khi xây dựng Backend thực tế:*
- **Auto Email Notifications**: Tích hợp gửi email thông báo tự động (Nodemailer / SendGrid / Amazon SES) tới địa chỉ email của User khi có Noti mới.
## 7. Nhật ký Khắc phục lỗi (Incident Log)
- **2026-05-05: Lỗi Encoding Tiếng Việt & Emoji (Mangled Characters)**
    - **Vấn đề**: Do thao tác lưu file hoặc chạy script tự động không đồng nhất định dạng, các ký tự tiếng Việt và Emoji trong `demo.html` bị biến thành mã rác (ví dụ: `ðŸ`, `ï¸`).
    - **Hậu quả**: Làm hỏng giao diện Dashboard, các nút bấm icon và các tiêu đề tiếng Việt.
    - **Khắc phục**: Đã thực hiện quét toàn bộ file ở cấp độ byte (Hex code) và thay thế thủ công các dòng lỗi bằng nội dung UTF-8 chuẩn.
    - **Phòng ngừa**: Đã thêm quy tắc **#11** và **#12** vào `rule.md`. AI Agent tương lai tuyệt đối không dùng script thay thế chuỗi bừa bãi và phải luôn kiểm tra tính toàn vẹn của UTF-8 trước khi lưu.
