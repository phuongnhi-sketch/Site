# MEMORY.MD - BỘ NHỚ DÀI HẠN (UPDATED v2.0)

Tài liệu này lưu trữ các thông tin cốt lõi, tầm nhìn và các quyết định quan trọng của dự án Site Management Web (POC) - Phiên bản **Gate Pipeline & Versioning**.

## 1. Vision & Goals (Tầm nhìn & Mục tiêu)
- **Tầm nhìn**: Nền tảng quản lý mặt bằng thông minh, minh bạch hóa mọi giai đoạn từ tìm kiếm đến chốt Deal.
- **Mục tiêu chiến lược**:
    - Chuẩn hóa quy trình phê duyệt qua **3 Gate chính (Survey, Sitepack, Deal)**.
    - Duy trì tính nhất quán dữ liệu giữa hồ sơ gốc và hồ sơ đàm phán qua cơ chế **Versioning (V1/V2)**.
    - Kiểm soát chặt chẽ thông tin tài chính nhạy cảm theo vai trò và trạng thái hồ sơ.

## 2. User Roles & Permission Logic (New ⭐)
- **MB**: Chia theo vùng miền (North/South).
- **BOD Level 1 (Global)**: Xem toàn bộ hệ thống.
- **BOD Level 2 (Restricted)**: Chỉ xem site thuộc Brand quản lý trước khi Finish. Sau khi Finish được xem tất cả.
- **Project**: Khảo sát tại Gate 1, bị ẩn thông tin tài chính.
- **Admin**: Quản lý MPSA, tạo Version 2, và có quyền xem thông tin tài chính sau khi Finish.

## 3. Tech Stack (Khuyến nghị)
- **Frontend**: Next.js (SPA/SSR) + TailwindCSS.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL.

## 4. Nhật ký quyết định (Decision Log)
- [2026-04-22]: Khởi tạo Framework Mode A.
- [2026-04-23]: **Nâng cấp lên v2.0**: Chuyển đổi sang mô hình Gate Pipeline (1-2-3).
- [2026-04-23]: Bổ sung tính năng **Versioning** cho Gate 3 (Deal stage).
- [2026-04-23]: Áp dụng quy tắc **Brand-based visibility** cho BOD Level 2.
- [2026-04-23]: Thống nhất lưu **Stage Context** cho mọi comment trong Timeline.
- [2026-04-23]: Thiết lập quy tắc **Finish Masking**: Ẩn giá thuê với MB/BOD/PJ sau khi hồ sơ kết thúc.
