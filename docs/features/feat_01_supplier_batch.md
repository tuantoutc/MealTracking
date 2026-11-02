# FEATURE 01: KHAI BÁO CA ĂN & LOGISTICS (SUPPLIER BATCH)

## 1. Trạng thái Triển khai
- **Trạng thái**: `[ ] Chưa bắt đầu`
- **Mã tính năng**: `FEAT-01`
- **Người chịu trách nhiệm**: `SUPPLIER` (Nhà cung cấp / Bếp trung tâm)
- **Thời hạn nghiệp vụ**: Trước **09:00 sáng** hằng ngày
- **Chuyển trạng thái State Machine**: `[*] -> REGISTERED -> IN_TRANSIT`

---

## 2. Logic Nghiệp vụ Chi tiết (Business Logic)

### Bước 1.1: Khởi tạo Ca Giao hàng trong ngày (Daily Delivery Batch)
Nhà cung cấp đăng nhập vào hệ thống và tạo ca giao hàng mới:
1. **Thông tin nhân sự chịu trách nhiệm**:
   - `head_chef_name`: Bếp trưởng trực tiếp nấu ca hôm nay (Bắt buộc).
   - `qa_manager_name`: Người phụ trách an toàn thực phẩm / KCS ca nấu (Bắt buộc).
2. **Thông tin định lượng & Thực đơn (Menu Items)**:
   - Danh sách món ăn trong ngày: Nhóm món (Cơm, Mặn, Rau/Xào, Canh, Tráng miệng).
   - Định lượng chuẩn trên 1 suất:
     - Thịt ba chỉ kho trứng: $90\text{g}$
     - Cơm trắng: $200\text{g}$
     - Canh chua thịt băm: $150\text{ml}$
     - Chuối tráng miệng: $1$ quả
   - **Nguồn gốc nguyên liệu chính**: Tên nhà phân phối sạch, kèm số hóa đơn chứng từ (ví dụ: *Thịt lợn sạch CP - Hóa đơn số #1234, Rau an toàn HTX Vân Nội*).
3. **Logistics & Vận chuyển**:
   - `planned_quantity`: Tổng số suất bàn giao theo hợp đồng ký với trường (Số nguyên > 0).
   - `vehicle_type`: Loại xe (Xe tải thùng kín chuyên dụng / Xe bán tải / Thùng giữ nhiệt).
   - `vehicle_plate`: Biển số xe giao nhận (ví dụ: `29C-123.45`).
   - `driver_name` & `driver_phone`: Họ tên và số điện thoại của tài xế.
   - `assistant_name`: Phụ xe (nếu có).
   - `dispatch_time`: Thời điểm xe bắt đầu xuất bến khỏi bếp trung tâm.

---

## 3. Ràng buộc Hệ thống (System Constraints & Validations)
- **Validation**:
  - Không cho phép để trống: `head_chef_name`, `qa_manager_name`, `planned_quantity`, `vehicle_plate`, `driver_name`, `driver_phone`.
  - Phải có tối thiểu 2 món ăn trong thực đơn ca ăn.
  - Mỗi món ăn bắt buộc có `standard_portion_amount > 0`, `unit` (`g`, `ml`, `qua`) và `ingredient_origin`.
- **Chuyển đổi trạng thái**:
  - Khi lưu bản ghi thành công $\rightarrow$ Ca ăn ở trạng thái `REGISTERED`.
  - Khi xe nhấn "Bắt đầu xuất phát" $\rightarrow$ Cập nhật `dispatch_time = NOW()` và chuyển sang `IN_TRANSIT`.

---

## 4. API Endpoints Thiết kế
- `POST /api/v1/supplier/batches`: Khởi tạo ca ăn mới (Trạng thái `REGISTERED`).
- `PUT /api/v1/supplier/batches/{id}/dispatch`: Xác nhận xe xuất phát (Chuyển sang `IN_TRANSIT`).
- `GET /api/v1/supplier/batches/today`: Lấy danh sách ca ăn hôm nay của nhà cung cấp.

---

## 5. Checklist Hoàn thành Tính năng
- [ ] Thiết kế Entity `MealBatch` và `BatchMenuItem` trong Spring Boot.
- [ ] Viết Liquibase Migration tạo bảng tương ứng.
- [ ] Viết Service validation dữ liệu trước 09:00 sáng.
- [ ] Viết API khởi tạo batch và xuất bến `IN_TRANSIT`.
- [ ] Xây dựng màn hình khai báo ca ăn cho Nhà cung cấp trên Next.js.
- [ ] Kiểm thử luồng thành công và đánh dấu `[x]` vào bảng tổng hợp.
