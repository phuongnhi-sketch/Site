# ARCHITECTURE.MD - KIẾN TRÚC HỆ THỐNG (UPDATED)

Tài liệu này mô tả chi tiết cấu trúc dữ liệu và quy trình nghiệp vụ của Site Management Web (POC) theo mô hình **Gate Pipeline & Versioning**.

## 1. Data Model (Thực thể dữ liệu)

### Users
- **Phân quyền mới**: BOD chia thành 2 level (Global vs Restricted).
- **Trường Brand**: Quyết định quyền xem của BOD Level 2.

### Sites (Thực thể trung tâm)
- **Thông tin Brand (Bắt buộc)**: Gắn liền với từng mặt bằng.
- **MPSA Estimate**: Admin có thể nhập và cập nhật nhiều lần, có lưu lịch sử.

### Site_Versions (New ⭐)
- Lưu trữ **Version 1** (Dữ liệu gốc MB submit) và **Version 2** (Dữ liệu chốt Deal tại Gate 3).
- Version 2 được Admin tạo bằng cách autofill từ Version 1.

### Timeline / Comments (Stage Context ⭐)
- Mỗi comment/sự kiện phải lưu kèm **Stage/Gate** tại thời điểm đó (Submitted, Gate 1, Gate 2, Gate 3, Finish).

## 2. Workflow Pipeline (Luồng nghiệp vụ mới)

Hệ thống quản lý theo 3 Gate chính:

1. **Submitted**: MB nộp hồ sơ. BOD nhận thông báo. Admin nhập MPSA.
2. **Gate 1 - Survey**: Team Project khảo sát thực địa. **Che thông tin tài chính** đối với Project.
3. **Gate 2 - Sitepack**: Chuẩn bị hồ sơ kỹ thuật/pháp lý.
4. **Gate 3 - Deal**: Đàm phán điều khoản. Admin có thể tạo **Version 2**.
5. **Finish**: Quyết định cuối cùng (Accept/Deny/Pending).
   - **Quy tắc che thông tin**: Sau khi Finish, chỉ Admin mới thấy thông tin tài chính (Rent/Deposit/Contract). MB/BOD/PJ bị ẩn.

## 3. Hệ thống Phân quyền nâng cao (Advanced RBAC)
- **MB**: Xem theo vùng miền (Region).
- **BOD Level 1**: Xem tất cả.
- **BOD Level 2**: 
  - Trước khi Finish: Chỉ xem site thuộc Brand của mình.
  - Sau khi Finish: Xem được tất cả Brand.
- **Project**: Chỉ xem site ở Gate 1, bị che thông tin tài chính.

## 4. Thành phần Công nghệ (Tech Stack)
- **Frontend**: Next.js + TypeScript + TailwindCSS (Khuyến nghị cho bản chính thức).
- **Backend**: Next.js API Routes hoặc Node.js.
- **Database**: PostgreSQL.

---
*Cập nhật theo Master Prompt v2.0 ngày 2026-04-23.*
