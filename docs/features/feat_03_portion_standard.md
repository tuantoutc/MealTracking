# FEAT-03: Chia Suất & Suất Mẫu Đối Chứng (Benchmark Portioning)

## 1. Thông Tin Chung
- **Mã tính năng:** `FEAT-03`
- **Khung giờ thực hiện:** 10:30 – 11:00
- **Tác nhân thực hiện:** Cán bộ giám sát bếp / Chuyên viên dinh dưỡng trường (`NUTRITIONIST`, `KITCHEN_STAFF`)
- **Trạng thái chuyển dịch:** `RECEIVED_AT_GATE` ➔ `PORTIONED_STANDARDIZED`
- **Bảng dữ liệu tác động:** `benchmark_portions`, `meal_batches`

---

## 2. Mô Tả Nghiệp Vụ

Tùy theo hợp đồng và cơ sở vật chất của nhà trường, quy trình chia suất vận hành theo 1 trong 2 mô hình:
- **Mô hình A (Central Kitchen Pre-pack):** Đã chia khay sẵn và dán màng nhiệt/nắp đậy từ bếp trung tâm của nhà cung cấp. Chuyên viên kiểm tra độ kín, nhiệt độ giữ ấm và số lượng khay cho từng khối/lớp.
- **Mô hình B (On-site Portioning):** Thức ăn vận chuyển bằng thùng cách nhiệt GN pan đến bếp trường rồi nhân viên chia ra từng khay ăn của học sinh tại chỗ. Chuyên viên dinh dưỡng giám sát việc cân chia định lượng từng món theo đúng cam kết định lượng (g/ml).

### Trọng tâm cốt lõi: ẢNH SUẤT ĂN TIÊU CHUẨN (Benchmark Portion Photo)
- Cán bộ giám sát chọn ngẫu nhiên một khay ăn hoàn thiện chuẩn mực nhất của ca ăn để chụp **01 ẢNH SUẤT ĂN TIÊU CHUẨN**.
- Suất ăn tiêu chuẩn phải thể hiện rõ:
  - Màu sắc tươi ngon, hấp dẫn, độ chín tới.
  - Độ đầy đặn đúng định lượng (đầy ô cơm, canh, món mặn, món xào, tráng miệng).
  - Vị trí bài trí ngăn nắp trên khay định hình chuyên dụng.
- **Vai trò:** Bức ảnh này là **VẬT CHỨNG ĐỐI CHỨNG (Ground Truth)** được lưu giữ vào hệ thống, dùng để đặt cạnh so sánh trực quan với ảnh khay ăn thực tế tại các lớp học khi phụ huynh truy cập app giám sát.

---

## 3. Quy Tắc Logic & Kiểm Soát (Validation Rules)

1. **Kiểm tra trạng thái ca ăn:**
   - Chỉ được phép tạo Benchmark khi ca ăn có trạng thái `RECEIVED_AT_GATE`.
2. **Quy chuẩn chụp ảnh Benchmark:**
   - Yêu cầu ảnh chụp góc trên xuống (Top-down 90° hoặc nghiêng 45° thấy trọn vẹn bề mặt khay).
   - Độ phân giải tối thiểu 1080p, định dạng JPG/PNG/WebP.
   - Kích thước tệp $\le$ 10MB.
   - Tự động sinh `photo_hash` (SHA-256) khi lưu ảnh.
3. **Phân bổ số lượng cho từng lớp:**
   - Cán bộ dinh dưỡng xác nhận và chốt danh sách số lượng khay/suất phân phối tới từng mã phòng học (phục vụ đối soát ở Bước 4).
4. **Kích hoạt chuyển trạng thái:**
   - Khi chuyên viên xác nhận "Hoàn tất kiểm tra chia suất & Benchmark", hệ thống cập nhật `meal_batches.status = 'PORTIONED_STANDARDIZED'`.

---

## 4. API Endpoints

### 4.1. Lấy thông tin ca ăn chờ chia suất
```http
GET /api/v1/batches/{batchId}/portioning-info
Authorization: Bearer <TOKEN_NUTRITIONIST>
```

### 4.2. Tải lên ảnh suất ăn tiêu chuẩn Benchmark
```http
POST /api/v1/batches/{batchId}/benchmark
Authorization: Bearer <TOKEN_NUTRITIONIST>
Content-Type: multipart/form-data
```
**Payload Multipart Form:**
- `photo`: File ảnh khay chuẩn
- `portionModel`: `MODEL_A_PREPACK` hoặc `MODEL_B_ONSITE`
- `notes`: Ghi chú cảm quan của chuyên viên dinh dưỡng (độ đậm đà, màu sắc, nhiệt độ)

**Response (201 Created):**
```json
{
  "code": 201,
  "message": "Benchmark portion recorded successfully",
  "data": {
    "benchmarkId": "8f8b3d68-0775-4d78-b1ce-0b7d722bfcb9",
    "batchId": "a90b4bf9-9942-4fcf-bca9-59eb82bb617e",
    "photoUrl": "https://storage.mealcheck.edu.vn/benchmarks/2026/10/28/bm_a90b.jpg",
    "photoHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "nextStatus": "PORTIONED_STANDARDIZED"
  }
}
```

---

## 5. Checklist Tiến Độ Tính Năng (Feature Checklist)

- [ ] **Database & Entity**
  - [ ] Migration bảng `benchmark_portions` và quan hệ khóa ngoại với `meal_batches`.
  - [ ] Ràng buộc kiểm tra `meal_batches.status` đúng tiến trình.
- [ ] **Backend Service**
  - [ ] Logic upload lưu trữ ảnh cloud/local và tính toán SHA-256 hash.
  - [ ] Chuyển trạng thái `meal_batches` sang `PORTIONED_STANDARDIZED`.
  - [ ] Phân quyền bảo mật: Chỉ user có role `NUTRITIONIST` hoặc `ADMIN` được thực hiện.
- [ ] **Frontend UI**
  - [ ] Màn hình chọn mô hình chia suất (A hoặc B).
  - [ ] Khung chụp hoặc chọn ảnh suất ăn tiêu chuẩn có hướng dẫn đóng khung khay trực quan.
  - [ ] Hiển thị bản xem trước (Preview) cùng mô tả cảm quan trước khi bấm "Lưu suất chuẩn".
- [ ] **Kiểm Thử (Testing)**
  - [ ] Chặn không cho tạo Benchmark nếu ca chưa qua bước `RECEIVED_AT_GATE`.
  - [ ] Xác thực tính toàn vẹn của mã SHA-256 hash ảnh.
