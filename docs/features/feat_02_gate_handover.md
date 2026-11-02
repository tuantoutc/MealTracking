# FEATURE 02: BÀN GIAO CỔNG TRƯỜNG & KÝ BIÊN BẢN (GATE HANDOVER)

## 1. Trạng thái Triển khai
- **Trạng thái**: `[ ] Chưa bắt đầu`
- **Mã tính năng**: `FEAT-02`
- **Người chịu trách nhiệm**: `GATE_INSPECTOR` (Đại diện trường: Thường trực bán trú / Nhân viên y tế / Ban thanh tra) phối hợp cùng Tài xế NCC
- **Thời hạn nghiệp vụ**: **09:45 - 10:30 sáng**
- **Chuyển trạng thái State Machine**: `IN_TRANSIT -> RECEIVED_AT_GATE`

---

## 2. Logic Nghiệp vụ Chi tiết (Business Logic)

### Bước 2.1: Tiếp nhận và Đối chiếu Thực tế
1. Cán bộ tiếp nhận mở ứng dụng trên điện thoại/máy tính bảng:
   - Hệ thống hiển thị ca ăn đang ở trạng thái `IN_TRANSIT` kèm thông tin xe giao đến.
   - Đối chiếu danh tính thực tế: Biển số xe, họ tên tài xế, ảnh giấy tờ/thông tin liên hệ.
2. Kiểm tra chất lượng cảm quan ban đầu:
   - **Tình trạng niêm phong**: Thùng bảo ôn/khay thức ăn còn nguyên tem niêm phong, không bị rách, xê dịch.
   - **Nhiệt độ thức ăn**: Đo nhiệt độ tại chỗ khi mở thùng. Bắt buộc thức ăn còn nóng **$> 60^\circ\text{C}$**. Nếu $\le 60^\circ\text{C}$, hệ thống kích hoạt cảnh báo nguy cơ vi khuẩn phát triển.

### Bước 2.2: Kiểm đếm Suất ăn & Ký Biên bản Điện tử (Handover Record)
1. **Ghi nhận số lượng thực nhận**:
   - Nhập `actual_quantity_received`.
   - Hệ thống tự động tính độ lệch:
     $$\Delta = \text{actual\_quantity\_received} - \text{planned\_quantity}$$
2. **Xử lý thiếu suất ăn ($\Delta < 0$)**:
   - Nếu $\Delta < 0$: Hệ thống lập tức hiển thị cảnh báo đỏ **"THIẾU SUẤT ĂN"**.
   - Bắt buộc tài xế/nhà cung cấp phải nhập phương án xử lý cấp bù (ví dụ: *Xe dự phòng đang mang thêm 15 suất đến trước 11:00*).
   - Nếu không có cam kết cấp bù hợp lệ, hệ thống gửi thông báo đẩy (Push Notification) đến Ban giám hiệu trường.
3. **Ký xác nhận điện tử 2 chiều**:
   - Hai bên xác nhận qua mã **OTP** 6 số gửi về số điện thoại tài xế hoặc nhập mã PIN xác thực tại chỗ giữa Tài xế và Cán bộ trường.
   - Biên bản bàn giao điện tử được tạo lập kèm timestamp chính xác.

---

## 3. Ràng buộc Hệ thống (System Constraints & Validations)
- Chỉ ca ăn ở trạng thái `IN_TRANSIT` mới được phép tiếp nhận tại cổng trường.
- `temperature_celsius` bắt buộc là số thực (ví dụ: $68.5^\circ\text{C}$). Nếu $< 60^\circ\text{C}$, trường cảnh báo bắt buộc điền lý do xử lý.
- Biên bản chỉ hợp lệ khi mã OTP/PIN ký nhận thành công.
- Sau khi ký xong, ca ăn tự động đổi trạng thái sang `RECEIVED_AT_GATE`.

---

## 4. API Endpoints Thiết kế
- `GET /api/v1/gate/incoming-batches`: Xem danh sách ca giao hàng đang đến trường hôm nay.
- `POST /api/v1/gate/handovers/verify-otp`: Gửi hoặc xác thực mã OTP ký biên bản bàn giao.
- `POST /api/v1/gate/handovers`: Tạo biên bản thực nhận và chuyển trạng thái sang `RECEIVED_AT_GATE`.

---

## 5. Checklist Hoàn thành Tính năng
- [ ] Thiết kế Entity `GateHandover` trong Spring Boot.
- [ ] Viết logic tự động tính $\Delta$ và kiểm tra ngưỡng nhiệt độ an toàn $> 60^\circ\text{C}$.
- [ ] Xây dựng service sinh và xác thực mã OTP/PIN bàn giao điện tử.
- [ ] Xây dựng giao diện mobile-first cho Cán bộ tiếp nhận tại cổng trường.
- [ ] Kiểm thử luồng bàn giao đủ / thiếu suất và đánh dấu `[x]` vào bảng tổng hợp.
