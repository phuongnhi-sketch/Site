# BUILD_PROMPT.MD - HƯỚNG DẪN KỸ THUẬT POC

Dùng để thiết lập nền tảng kỹ thuật cho Site Management Web (POC).

## 1. Tech Stack (Chốt)
- **Frontend**: React + TypeScript + TailwindCSS.
- **Backend**: Node.js (Express hoặc NestJS).
- **Database**: PostgreSQL (cần thiết kế schema theo Entity trong architecture.md).
- **Storage**: Cloud Storage (S3/GCP) hoặc Local Storage cho POC (cần cấu hình dễ chuyển đổi).
- **Authentication**: JWT, sử dụng Cookie hoặc LocalStorage để lưu session.

## 2. API Design Principles
- RESTful API.
- Phải có Middleware kiểm tra Role (MB/BOD/Project/Admin).
- Tích hợp Audit Log cho các endpoint thay đổi dữ liệu nhạy cảm.
- Upload API hỗ trợ nộp nhiều ảnh/file cùng lúc.

## 3. Database Schema Planning
- Phải tạo Migration script.
- Có dữ liệu mẫu (Seed Data) cho 4 loại user khác nhau để test phân quyền.
- Quan hệ 1-n giữa Site và Photos/Files/Comments.

## 4. UI Library
- Ưu tiên sử dụng TailwindCSS làm base.
- Các component UI (Button, Input, Modal, Table) cần chuẩn hóa theo design system.
