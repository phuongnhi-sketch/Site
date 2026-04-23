# FLOW.MD - QUY TRÌNH LÀM VIỆC CHUẨN

Tài liệu này định nghĩa các bước mà AI Agent phải thực hiện để đảm bảo tính nhất quán và hiệu quả.

## 1. Quy trình xử lý task hàng ngày
Mỗi khi nhận một brief hoặc yêu cầu mới, AI phải thực hiện:
1. **Read Minimal Context**: Đọc `context_index.md`, `progress.md`, `active_task.md`.
2. **Understand Brief**: Tóm tắt lại yêu cầu để đảm bảo hiểu đúng ý Nhi.
3. **Define Scope & Assumption**: Xác định phạm vi và các giả định.
4. **Skill Check**: Kiểm tra xem có đủ kỹ năng thực hiện không, nếu thiếu thì kích hoạt Researcher.
5. **Plan**: Lập kế hoạch thực hiện (sử dụng implementation_plan.md nếu task phức tạp).
6. **Execute**: Thực thi code hoặc tài liệu.
7. **Review**: Tự kiểm tra lại kết quả.
8. **Update Project Docs**: Cập nhật memory, progress, architecture nếu có thay đổi.
9. **Next Step**: Đề xuất bước tiếp theo cho Nhi.

## 2. Quy trình bàn giao (Handover)
Khi kết thúc một phiên làm việc hoặc chuyển sang task mới:
- Cập nhật `done_log.md`.
- Cập nhật `handover_prompt.md` để phiên làm việc sau hiểu ngay trạng thái hiện tại.
- Thông báo cho Nhi về những gì đã hoàn thành.

## 3. Quy trình cập nhật hệ thống (UpdateProject)
Sử dụng khi có thay đổi lớn ảnh hưởng đến cấu trúc hoặc logic cốt lõi:
- Chạy lệnh logic `.\UpdateProject`.
- AI tự rà soát và cập nhật: `memory.md`, `progress.md`, `architecture.md`, `rule.md`, `context_index.md`.
