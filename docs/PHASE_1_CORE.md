# PHASE 1: CORE MVP (LUỒNG VẬN HÀNH CƠ BẢN)

## 1. Mục tiêu Giai đoạn 1
Thiết lập và vận hành trơn tru luồng đi qua 6 trạng thái từ lúc Nhà cung cấp khai báo ca ăn tại bếp trung tâm cho đến khi dữ liệu được công bố minh bạch trên điện thoại của Phụ huynh học sinh.

---

## 2. Bảng Theo dõi Tiến độ Tính năng (Feature Progress Tracker)

> [!IMPORTANT]
> **Quy tắc làm việc cho AI Agent & Developers:**
> Chỉ mở đọc file chi tiết của feature đang làm việc trong thư mục `docs/features/`. Khi hoàn thành xong feature nào, cập nhật trạng thái `[x]` tại bảng dưới đây và trong file tương ứng kèm thông tin hoàn thành để tránh đọc lại gây tốn token.

| Feature ID | Tên Tính năng | File Đặc tả Logic | Trạng thái | Ghi chú hoàn thành |
| :--- | :--- | :--- | :---: | :--- |
| **FEAT-00** | Quản trị tài khoản, Phê duyệt đa vai trò & Xác thực Email | [`docs/features/feat_00_admin_account_governance.md`](file:///D:/antigravity/software/docs/features/feat_00_admin_account_governance.md) | `[x] Hoàn thành` | Đăng ký 6 vai trò, token 24h, link kích hoạt, Admin Dashboard, khóa & tích xanh |
| **FEAT-01-PARTNERS** | Quản lý Đối tác thực phẩm & Khách hàng suất ăn (Supplier Hub) | [`docs/features/feat_01_supplier_partners_and_clients.md`](file:///D:/antigravity/software/docs/features/feat_01_supplier_partners_and_clients.md) | `[x] Hoàn thành` | CRUD Đối tác 4 nhóm thực phẩm, HĐ, chuẩn ATTP/VietGAP; Khách hàng trường học, xem PDF hợp đồng điện tử |
| **FEAT-01** | Khai báo ca ăn & Logistics (Supplier Batch) | [`docs/features/feat_01_supplier_batch.md`](file:///D:/antigravity/software/docs/features/feat_01_supplier_batch.md) | `[ ] Chưa bắt đầu` | Trước 09:00 sáng |
| **FEAT-02** | Bàn giao tại cổng trường & Ký nhận (Gate Handover) | [`docs/features/feat_02_gate_handover.md`](file:///D:/antigravity/software/docs/features/feat_02_gate_handover.md) | `[ ] Chưa bắt đầu` | 09:45 - 10:30 |
| **FEAT-03** | Chia suất & Thiết lập Ảnh Tiêu chuẩn (Portion Benchmark) | [`docs/features/feat_03_portion_standard.md`](file:///D:/antigravity/software/docs/features/feat_03_portion_standard.md) | `[ ] Chưa bắt đầu` | 10:30 - 11:00 |
| **FEAT-04** | Tiếp nhận tại lớp, Tri-Photo Rule & Lưu mẫu 24h | [`docs/features/feat_04_classroom_serving.md`](file:///D:/antigravity/software/docs/features/feat_04_classroom_serving.md) | `[ ] Chưa bắt đầu` | 11:00 - 11:30 |
| **FEAT-05** | Bảng tin Phụ huynh & Đánh giá suất ăn (Parent Feed) | [`docs/features/feat_05_parent_feed.md`](file:///D:/antigravity/software/docs/features/feat_05_parent_feed.md) | `[ ] Chưa bắt đầu` | Sau 11:30 |

---

## 3. Thứ tự Triển khai (Execution Order)

1. **Bước 1 - Khởi tạo Database Phase 1**:
   - Chạy migration từ [schema.sql](file:///D:/antigravity/software/docs/schema.sql) qua Liquibase vào PostgreSQL.
2. **Bước 2 - Triển khai Backend Services & Controllers**:
   - Hoàn thành theo thứ tự từ `FEAT-01` $\rightarrow$ `FEAT-05`.
   - Mỗi feature có validation chặt chẽ và chuyển đổi trạng thái State Machine theo quy tắc một chiều.
3. **Bước 3 - Triển khai Giao diện Người dùng (Frontend Next.js)**:
   - Màn hình Nhà cung cấp (Bếp)
   - Màn hình Cán bộ tiếp nhận cổng trường
   - Màn hình Cán bộ dinh dưỡng (Chụp ảnh Benchmark)
   - Màn hình Giáo viên nhận lớp (Camera đóng Watermark + chụp 3 ảnh + form lưu mẫu)
   - Màn hình Phụ huynh xem realtime & chấm sao
4. **Bước 4 - Tích hợp Kiểm thử Luồng (End-to-End Testing)**:
   - Test ca ăn chạy từ trạng thái `REGISTERED` $\rightarrow$ `PUBLISHED_FOR_PARENTS`.
