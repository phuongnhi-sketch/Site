# MASTER_PROMPT.MD - XƯƠNG SỐNG DỰ ÁN

# PROMPT BUILD WEBSITE: Site Management Web (POC) – Gate Pipeline + Versioning

You are a **Senior Product Engineer + UX Designer + Solution Architect**.  
Build a **mobile-first responsive web application** called:

✅ **"Site Management Web - POC"**

This system manages site submissions, reviews, Q&A, survey evaluation, pipeline tracking, and final decision making.

The system replaces manual workflows (Zalo/Email/Excel) and provides a centralized database with full history.

---

# 🔥 CHANGELOG (SO VỚI PROMPT CŨ) – QUAN TRỌNG CHO ANTIGRAVITY

> Các điểm mới hoặc thay đổi so với prompt cũ, cần implement rõ ràng:

### ✅ NEW #1: Pipeline theo Gate 1–2–3
- Thay status "Under Review" bằng pipeline:
  - **Gate 1: Survey**
  - **Gate 2: Sitepack**
  - **Gate 3: Deal**
- Có thêm trạng thái **Finish** (Accept/Deny/Pending)

### ✅ NEW #2: Thêm trường Brand (bắt buộc)
- Site bắt buộc phải có **Brand**
- Brand ảnh hưởng tới quyền xem của BOD Level 2

### ✅ NEW #3: BOD có 2 level quyền
- **BOD Level 1 (Global)**: thấy tất cả site của mọi brand ở mọi trạng thái
- **BOD Level 2 (Restricted)**:
  - Nếu site chưa Finish → chỉ thấy site thuộc brand của mình
  - Nếu site đã Finish → được thấy tất cả brand

### ✅ NEW #4: Admin nhập MPSA Estimate
- Admin có thể nhập và update **MPSA estimate nhiều lần**
- Phải lưu lịch sử thay đổi MPSA

### ✅ NEW #5: Gate 3 có Versioning (Version 1 vs Version 2)
- Gate 3 (Deal) cho phép Admin tạo **Version 2**
- Version 2 autofill từ Version 1
- Site detail hiển thị mặc định version mới nhất
- Có nút xem lại Version 1 gốc

### ✅ NEW #6: Khi Finish → ẩn giá thuê với tất cả user trừ Admin
- MB/BOD/PJ không còn thấy rent/deposit/contract
- Admin vẫn thấy full

### ✅ NEW #7: Timeline hiển thị stage tại thời điểm comment
- Mỗi comment phải lưu stage/gate lúc comment được tạo
- Khi xem timeline phải hiển thị rõ comment thuộc giai đoạn nào

### ✅ UPDATED #8: Notification logic theo brand + role
- MB submit → notify BOD L1 + BOD L2 (đúng brand) + Admin

---

# 1. BUSINESS GOAL (WHY)

### Problems to solve
- MB đang submit site qua chat/email thủ công → thiếu data, mất ảnh, sai format.
- BOD phản hồi rải rác nhiều kênh → khó tracking Q&A.
- Không có database lưu lịch sử → khó đánh giá hiệu quả tìm kiếm site.
- Không có tracking pipeline theo từng giai đoạn triển khai (Survey / Sitepack / Deal).

### Goals
- Centralized system để MB submit site trực tiếp từ mobile/desktop.
- Chuẩn hóa form dữ liệu site để so sánh dễ dàng.
- Tracking pipeline rõ ràng theo **Gate 1–2–3**.
- Lưu lịch sử toàn bộ Q&A, comment, status change, MPSA update, versioning.
- Giúp BOD ra quyết định dựa trên dữ liệu + lịch sử đầy đủ.

---

# 2. USERS & ROLES (WHO)

### Roles
1. **MB (Mặt Bằng)**
   - Tạo site, nhập thông tin, upload ảnh/file
   - Save Draft, Submit site
   - Trả lời câu hỏi của BOD

2. **BOD**
   - Xem site, comment, đặt câu hỏi
   - Theo dõi pipeline từ Submitted đến Finish
   - Có 2 level quyền (Global / Restricted)

3. **Project (PJ)**
   - Nhận notification khi site chuyển sang Gate 1 (Survey)
   - Khảo sát site và comment feasibility (khả thi / không khả thi)
   - Không được thấy thông tin tài chính

4. **Admin**
   - Quản lý user + phân quyền
   - Cấu hình form/dropdown
   - Export dữ liệu
   - Quản lý workflow status / gate
   - Nhập & update MPSA estimate
   - Tạo Version 2 tại Gate 3 (Deal)
   - Chuyển trạng thái Finish + quyết định Accept/Deny/Pending

---

# 3. INPUT DATA (DỮ LIỆU ĐẦU VÀO)

### MB nhập
- Thông tin site (địa chỉ, diện tích, mô tả, tiềm năng…)
- Thông tin tài chính (giá thuê, deposit, điều khoản hợp đồng)
- Upload ảnh site
- Google Map link / tọa độ
- File liên quan
- **Brand (BẮT BUỘC)** ⭐ NEW

### BOD nhập
- Comment đánh giá
- Q&A yêu cầu bổ sung thông tin

### Project nhập
- Feasibility result: **Khả thi / Không khả thi**
- Comment chi tiết

### Admin nhập
- **MPSA estimate** ⭐ NEW
- Chuyển Gate status
- Quyết định Finish (Accept/Deny/Pending)
- Tạo Version 2 tại Gate 3 (Deal) ⭐ NEW

---

# 4. SECURITY & PERMISSION RULES

## 4.1 Financial data masking rules
- Project không được xem:
  - rent_price
  - deposit
  - contract_terms

## 4.2 MB Region Access Restriction
- MB chia làm 2 miền:
  - North
  - South
- MB chỉ thấy site thuộc miền của mình

## 4.3 BOD Brand Access Restriction ⭐ NEW
BOD có 2 level:

### BOD Level 1 (Global BOD)
- Nhìn thấy tất cả site của tất cả brand ở mọi trạng thái

### BOD Level 2 (Restricted BOD)
- Nếu site chưa Finish:
  - chỉ thấy site thuộc brand của mình
- Nếu site đã Finish:
  - được thấy tất cả brand

## 4.4 Finish Masking Rule ⭐ NEW
Khi site chuyển sang trạng thái **Finish**:
- MB/BOD/PJ sẽ không còn thấy các thông tin tài chính
- Chỉ Admin nhìn thấy dữ liệu tài chính

---

# 5. WORKFLOW PIPELINE (HOW IT WORKS)

## Step 0 – Login
User đăng nhập theo role: MB / BOD / PJ / Admin.

---

## Step 1 – MB tạo Site (Draft)
- MB tạo site mới, nhập form, upload ảnh/file
- Có thể Save Draft và chỉnh sửa bất kỳ lúc nào

Status: **Draft**

---

## Step 2 – MB Submit Site
Khi MB Submit:
- Site chuyển status: **Submitted**
- BOD nhận notification và có thể comment ngay
- MB không được chỉnh sửa các field chính (trừ khi Admin mở quyền)
- Admin có thể xem để chuẩn bị nhập MPSA

Status: **Submitted**

---

## Step 3 – Admin nhập MPSA ⭐ NEW
- Admin cập nhật trường **MPSA estimate**
- MPSA có thể update nhiều lần
- Mỗi lần update phải lưu lịch sử

---

## Step 4 – Gate 1: Survey (Khảo sát)
- Admin/BOD chuyển site sang Gate 1
- Project nhận notification và tiến hành khảo sát
- Project comment đánh giá khả thi / không khả thi

Trong Gate 1:
- BOD vẫn comment & hỏi
- MB vẫn trả lời
- Admin vẫn update MPSA

Status: **Gate 1 - Survey**

---

## Step 5 – Gate 2: Sitepack
- Admin/BOD chuyển site sang Gate 2
- Comment/Q&A vẫn hoạt động
- Admin vẫn update MPSA

Status: **Gate 2 - Sitepack**

---

## Step 6 – Gate 3: Deal (Versioning)
- Admin/BOD chuyển site sang Gate 3
- Comment/Q&A vẫn hoạt động
- Tại Gate 3 có feature đặc biệt:

### Version 2 Feature ⭐ NEW
- Admin có thể tạo **Version 2**
- Khi tạo Version 2:
  - hệ thống autofill toàn bộ dữ liệu từ Version 1
  - Admin chỉnh sửa và save
- Sau đó site có:
  - Version 1: dữ liệu gốc MB submit
  - Version 2: dữ liệu update cuối cùng (Deal stage)

### Display Rule
- Trang site detail hiển thị mặc định version mới nhất
- Nếu không có Version 2 thì hiển thị Version 1
- Có nút **View Version 1** để xem dữ liệu gốc

Status: **Gate 3 - Deal**

---

## Step 7 – Finish (Accept / Deny / Pending)
- Admin chuyển site sang trạng thái **Finish**
- Finish gồm:
  - Accept
  - Deny
  - Pending

Khi chuyển sang Finish:
- MB/BOD/PJ không còn nhìn thấy thông tin tài chính
- Chỉ Admin thấy giá thuê và các field nhạy cảm

Status: **Finish**

---

# 6. COMMENT / Q&A TIMELINE (VERY IMPORTANT)

Timeline bắt buộc lưu:

Mỗi comment/Q&A phải có:
- user comment
- timestamp
- content
- tag user (optional)
- question status: Open / Answered / Closed (nếu là Q&A)
- **Stage/Gate tại thời điểm comment** ⭐ NEW

### UI requirement ⭐ NEW
Khi user mở phần comment:
- phải thấy rõ comment đó thuộc giai đoạn nào:
  - Submitted
  - Gate 1 - Survey
  - Gate 2 - Sitepack
  - Gate 3 - Deal
  - Finish

---

# 7. OUTPUT REQUIREMENTS

## Site List Output
- Danh sách site theo trạng thái:
  - Draft
  - Submitted
  - Gate 1 - Survey
  - Gate 2 - Sitepack
  - Gate 3 - Deal
  - Finish (Accept/Deny/Pending)

## Site Detail Output
- Hiển thị đầy đủ:
  - thông tin form
  - hình ảnh gallery
  - file attachments
  - map link
  - timeline review + Q&A
  - MPSA estimate (nếu có)
  - final decision (nếu finish)

## Version Output ⭐ NEW
- Nếu có Version 2:
  - default hiển thị Version 2
  - có nút xem lại Version 1 gốc

## Map Output
- Map hiển thị pins theo tọa độ
- Filter theo gate/status

---

# 8. SUCCESS CRITERIA

Web thành công khi:
- 100% site được submit qua hệ thống
- MB submit nhanh trên mobile
- BOD review và phản hồi trực tiếp trên hệ thống
- Mọi site có lịch sử đầy đủ: ai tạo, ai phản hồi, Q&A, MPSA history, quyết định cuối
- Timeline thể hiện rõ bối cảnh theo stage/gate giúp review nhanh
- Versioning giúp track dữ liệu gốc và dữ liệu deal cuối cùng
- Không mất ảnh nhờ upload trực tiếp

---

# 9. FEATURE LIST (MUST BUILD)

## 9.1 User & Role Management
- Admin tạo user (email/password)
- Role:
  - MB
  - Project
  - BOD Level 1
  - BOD Level 2
  - Admin
- Lưu audit log cho mọi action

⭐ NEW: BOD Level 1 vs Level 2 permission logic

---

## 9.2 Site Submission Form (MB)
Form sections:
- Basic info
- Location + map link + coordinates
- Financial info
- Description / notes
- Upload images
- Upload files
- **Brand (required)** ⭐ NEW

Validation:
- required fields must be filled before submit

---

## 9.3 Site Status Workflow (Pipeline Gate)
Site statuses:
- Draft
- Submitted
- Gate 1 - Survey
- Gate 2 - Sitepack
- Gate 3 - Deal
- Finish

Finish requires final decision:
- Accept / Deny / Pending

---

## 9.4 Admin MPSA Management ⭐ NEW
- Admin nhập MPSA estimate
- MPSA update nhiều lần
- Lưu lịch sử update theo timestamp

---

## 9.5 Review & Feedback (BOD)
- BOD comment
- BOD đặt câu hỏi
- Optional scoring
- Theo dõi pipeline

---

## 9.6 Survey Review (Project)
Khi site ở Gate 1:
- Project nhận notification
- Project xem site nhưng ẩn financial data
- Project comment feasibility

---

## 9.7 Q&A / Comment Thread
- Thread dạng chat
- Reply comment
- Tag user
- Question status:
  - Open / Answered / Closed
- Mỗi comment hiển thị:
  - user
  - time
  - **stage/gate lúc comment** ⭐ NEW

---

## 9.8 Notification System (UPDATED)
Notification triggers:

- MB submit site → notify:
  - BOD Level 1
  - BOD Level 2 (đúng brand)
  - Admin
- BOD hỏi → notify MB + Admin
- MB trả lời → notify BOD + Admin
- Site chuyển Gate 1 → notify Project
- Project comment → notify MB + BOD + Admin
- Site Finish → notify MB + BOD + Admin

Notifications:
- In-app notification bell
- Optional email

---

## 9.9 Site List / Search / Filter
Filter by:
- status/gate
- region
- brand
- created_by
- date range

Search:
- site name
- address

Sort:
- created date
- updated date
- status

Views:
- My Draft
- Submitted Waiting Review
- Finished Sites

---

## 9.10 Site Detail Page
Must show:
- Site information (based on selected version)
- Image gallery
- File list
- Map
- Timeline
- MPSA estimate
- Decision status

Must show:
- audit log of updates

⭐ NEW: Version switcher (Version 1 / Version 2)

---

## 9.11 Map View
- Show sites as pins
- Click pin show summary card
- Filter by gate/status/time

---

## 9.12 Export / Reporting (Optional)
- Export site list Excel/PDF
- Export site detail including images
- Two export versions:
  - First Submission Version (Version 1)
  - Final Version (Version 2 if exists)

Export option:
- Include Q&A history checkbox

---

## 9.13 Admin Config (Optional)
- Manage template question list
- Manage dropdown list:
  - region
  - brand
  - site type
- Manage workflow status rules

---

# 10. DATABASE MODEL REQUIREMENTS (UPDATED)

Design database schema with these entities:

## Users
- id
- name
- email
- password_hash
- role (MB / Project / BOD_L1 / BOD_L2 / Admin)
- region (North/South/All)
- brand (nullable for BOD_L2)
- is_active
- created_at

## Sites
- id
- site_code (auto generate)
- site_name
- address
- region (North/South)
- brand (required) ⭐ NEW
- google_map_link
- latitude
- longitude

### Financial fields (sensitive)
- rent_price
- deposit
- contract_terms

### Status fields
- status (Draft/Submitted/GATE1/GATE2/GATE3/FINISH)
- gate_name (Survey/Sitepack/Deal or NULL)
- finish_result (Accept/Deny/Pending/NULL)

### Ownership
- created_by (MB user id)
- created_at
- updated_at
- submitted_at
- finished_at

## Site_Versions ⭐ NEW
To support Version 1 and Version 2:

- id
- site_id
- version_number (1 or 2)
- created_by (admin id)
- created_at
- data_json (snapshot full site form fields)

Rule:
- Version 1 auto created at Submit
- Version 2 can only be created by Admin at Gate 3

## MPSA_History ⭐ NEW
- id
- site_id
- mpsa_value
- updated_by (admin id)
- updated_at
- note (optional)

## Photos
- id
- site_id
- url
- uploaded_by
- uploaded_at

## Files
- id
- site_id
- url
- file_name
- uploaded_by
- uploaded_at

## Timeline_Events
- id
- site_id
- user_id
- role
- event_type (COMMENT/QUESTION/ANSWER/STATUS_CHANGE/MPSA_UPDATE/VERSION_CREATED/FINISH_DECISION)
- content
- question_status (Open/Answered/Closed/NULL)
- related_question_id (nullable)
- stage_at_time ⭐ NEW (Submitted/Survey/Sitepack/Deal/Finish)
- created_at

## Notifications
- id
- user_id
- site_id
- type
- message
- is_read
- created_at

## Audit_Log (recommended)
- id
- user_id
- action
- entity_type
- entity_id
- old_value_json
- new_value_json
- timestamp

---

# 11. API REQUIREMENTS (MINIMUM)

## Auth
- POST /auth/login
- GET /auth/me
- POST /auth/logout

## Sites
- POST /sites (create draft)
- PUT /sites/{id} (edit draft)
- POST /sites/{id}/submit
- GET /sites (filter/pagination)
- GET /sites/{id}

## Gate / Status control
- POST /sites/{id}/gate (Admin/BOD)
- POST /sites/{id}/finish (Admin only)

## MPSA ⭐ NEW
- POST /sites/{id}/mpsa (Admin update)
- GET /sites/{id}/mpsa/history

## Versioning ⭐ NEW
- POST /sites/{id}/version2 (Admin only, only in Gate 3)
- GET /sites/{id}/versions
- GET /sites/{id}/version/{version_number}

## Upload
- POST /sites/{id}/photos
- POST /sites/{id}/files

## Timeline / Q&A
- GET /sites/{id}/timeline
- POST /sites/{id}/comment
- POST /sites/{id}/question
- POST /sites/{id}/answer
- POST /sites/{id}/question/{qid}/close

## Notifications
- GET /notifications
- POST /notifications/{id}/read

## Admin
- CRUD /users
- CRUD /configs/dropdowns
- CRUD /configs/questions
- Export endpoints

---

# 12. UI/UX REQUIREMENTS

### Design
- Minimal modern enterprise UI
- Mobile-first
- Table view desktop, card view mobile

### Required Pages
1. Login Page
2. Dashboard (summary counts by gate/status)
3. Site List Page
4. Create/Edit Site Form (Draft)
5. Site Detail Page (with version switch)
6. Timeline/Q&A section with stage labels
7. Map View Page
8. Admin Panel (User + MPSA + Gate + Version 2)

---

# 13. TEST SCENARIOS (MUST PASS)

1. MB tạo Draft → edit → save → reopen OK
2. MB Submit → site chuyển Submitted → BOD/Admin nhận notification
3. Admin update MPSA nhiều lần → lịch sử update được lưu
4. Admin/BOD chuyển Gate 1 → PJ nhận notification
5. PJ mở site Gate 1 → không thấy financial fields
6. PJ comment feasibility → MB/BOD/Admin thấy trong timeline
7. Chuyển Gate 3 → Admin tạo Version 2 → autofill đúng dữ liệu
8. Site detail hiển thị Version 2 mặc định, có nút xem Version 1
9. Admin Finish Accept/Deny/Pending
10. Khi Finish → MB/BOD/PJ bị hide financial fields
11. MB North không thấy site South
12. BOD Level 2 chỉ thấy đúng brand trước Finish, sau Finish thấy tất cả

---

# 14. DELIVERABLE REQUIREMENTS

Deliver a working POC including:
- Frontend + backend + database
- RBAC + brand/region security logic
- Gate pipeline
- Timeline with stage label
- MPSA history
- Versioning (Gate 3)
- Notification system
- Map view
- Admin panel

Must include setup guide:
- env vars
- migration scripts
- seed data
- default admin account

---

# 15. TECH STACK RECOMMENDATION

Preferred stack:
- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: Next.js API routes OR Node.js (NestJS)
- Database: PostgreSQL
- Storage: S3/GCP bucket
- Auth: JWT or secure cookie session
- Map: Google Maps API

---

# FINAL NOTE
This is a POC but must be structured cleanly to scale into production.
Prioritize:
- Security masking (Project + Finish rule)
- Gate pipeline tracking
- MPSA update history
- Version 1 vs Version 2 at Gate 3
- Timeline with stage context
- Mobile usability
