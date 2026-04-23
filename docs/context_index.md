# CONTEXT_INDEX.MD - CHỈ MỤC CONTEXT

Tài liệu này giúp AI định tuyến nhanh thông tin cần đọc, tối ưu hóa token.

## 1. Bản đồ Tài liệu (Mapping)

### Tầng 1: Context Tối thiểu (Always Read)
- `docs/context_index.md`: Bản đồ này.
- `work/tasks/active_task.md`: Task hiện tại.
- `docs/progress.md`: Tiến độ tổng thể.

### Tầng 2: Chiến lược dự án (Strategic)
- `docs/memory.md`: Tầm nhìn, tech stack.
- `docs/rule.md`: Các quy định làm việc.
- `docs/architecture.md`: Cấu trúc hệ thống.

### Tầng 3: Chỉ thị (Prompt)
- `prompt/master_prompt.md`: Vision và business logic.
- `prompt/daily_prompt.md`: Cách làm việc hàng ngày.
- `prompt/handover_prompt.md`: Bàn giao phiên.

### Tầng 4: Chi tiết thực thi (Detail)
- `work/tasks/backlog.md`: Danh sách task chờ.
- `work/tasks/done_log.md`: Nhật ký hoàn thành.

## 2. Thứ tự đọc ưu tiên theo Lệnh (Command)
- `.\status`: progress.md -> active_task.md
- `.\newtask`: progress.md -> memory.md -> active_task.md
- `.\build`: rule.md -> architecture.md -> active_task.md -> (code files)
- `.\UpdateProject`: memory.md -> architecture.md -> progress.md -> rule.md

## 3. Lưu ý cho AI mới
Trước khi bắt đầu bất kỳ việc gì, hãy đọc file này trước để biết nên nạp context nào vào bộ nhớ. Không đọc lan man toàn bộ repo.
