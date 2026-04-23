# DONE_LOG.MD - NHẬT KÝ HOÀN THÀNH

Lịch sử các công việc đã hoàn thành trong dự án Site Management.

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
