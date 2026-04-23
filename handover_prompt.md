# HANDOVER_PROMPT.MD - BÀN GIAO PHIÊN (v2.0 GATE PIPELINE)

Chào em (AI mới), đây là nội dung bàn giao quan trọng sau khi Nhi nâng cấp đặc tả hệ thống lên **v2.0**.

## 1. Tổng quan thay đổi (Major Upgrade)
Dự án vừa trải qua một đợt nâng cấp Master Prompt với các tính năng then chốt:
- **Gate Pipeline**: Quy trình 3 bước (Survey -> Sitepack -> Deal).
- **Versioning**: Hỗ trợ Version 1 (Gốc) và Version 2 (Deal) tại Gate 3.
- **MPSA History**: Lưu vết các lần Admin ước tính MPSA.
- **Phân quyền BOD L2**: Chặn xem theo Brand trước khi Finish.
- **Finish Masking**: Ẩn data tài chính sau khi chốt hồ sơ.

## 2. Trạng thái hiện tại
- **Tài liệu**: Đã cập nhật 100% (`master_prompt.md`, `architecture.md`, `database_schema.md`, `memory.md`, `progress.md`, `rule.md`).
- **Codebase**: `demo.html` đang ở bản **v1.8**. Task tiếp theo là nâng cấp file này lên **v2.0** để khớp với đặc tả mới.

## 3. Việc em cần làm ngay
1. Đọc `work/tasks/active_task.md` để nắm kế hoạch nâng cấp `demo.html`.
2. Bắt đầu sửa đổi `demo.html`:
    - Thay đổi hệ thống Status cũ sang bộ Gate 1-2-3.
    - Bổ sung trường Brand vào Form và Site List.
    - Xây dựng UI cho Version Switcher và MPSA History.
    - Implement logic che thông tin tài chính sau khi Finish.

## 4. Chỉ thị quan trọng
- Luôn gọi Project Owner là **Nhi** và xưng **em**.
- Tuân thủ quy tắc "No Regression": Không làm hỏng các tính năng nén ảnh và form động đang chạy tốt.
- Mỗi comment mới trong Timeline phải lưu kèm Stage hiện tại.

## 5. Tài liệu tham khảo
- [master_prompt.md](file:///d:/AI/Site_Management/prompt/master_prompt.md) (Nguồn tri thức mới nhất)
- [architecture.md](file:///d:/AI/Site_Management/docs/architecture.md) (Sơ đồ luồng mới)
- [active_task.md](file:///d:/AI/Site_Management/work/tasks/active_task.md) (Việc đang làm)

---
*Chúc em hoàn thành tốt nhiệm vụ hỗ trợ Nhi!*
