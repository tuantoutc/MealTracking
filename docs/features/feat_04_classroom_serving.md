# FEAT-04: Nhận Tại Lớp, Giám Sát Tri-Photo & Lưu Mẫu 24H (Classroom Serving & Compliance)

## 1. Thông Tin Chung
- **Mã tính năng:** `FEAT-04`
- **Khung giờ thực hiện:** 11:00 – 11:30
- **Tác nhân thực hiện:** Giáo viên chủ nhiệm lớp (`TEACHER`) & Cán bộ y tế/bếp lưu mẫu (`HEALTH_STAFF`, `NUTRITIONIST`)
- **Trạng thái chuyển dịch:** `PORTIONED_STANDARDIZED` ➔ `CLASS_SERVED`
- **Bảng dữ liệu tác động:** `class_servings`, `classroom_meal_photos`, `food_samples_24h`, `meal_batches`

---

## 2. Mô Tả Nghiệp Vụ

### 2.1. Xác nhận giao nhận khay ăn tại lớp
Giáo viên chủ nhiệm mở ứng dụng di động/web tại phòng học để đối chiếu sĩ số lớp:
- **Tổng số học sinh lớp (`total_students_in_class`):** Sĩ số danh sách lớp.
- **Số học sinh ăn bán trú thực tế (`boarding_students_count`):** Số học sinh có mặt dùng bữa hôm nay.
- **Số suất nhận thực tế (`received_portions`):** Số lượng khay cơm nhận từ bộ phận chia suất.
- **Giờ bắt đầu ăn thực tế (`eating_start_time`):** Ghi nhận chính xác thời khắc học sinh bắt đầu ngồi vào bàn ăn.

---

### 2.2. Quy Tắc Bắt Buộc: Tri-Photo Compliance (3 Ảnh Khay Cơm Ngẫu Nhiên)
Để đảm bảo tính khách quan và trung thực, cô giáo không thể tải ảnh tùy tiện trong thư viện máy mà phải kích hoạt camera trực tiếp:
1. **Chụp ĐỦ 03 ẢNH của 3 khay cơm thuộc 3 học sinh khác nhau** trong lớp trước giờ bắt đầu ăn.
2. **Đóng dấu Watermark tự động bằng Canvas (Client-side, không thể tắt/sửa):**
   ```text
   [Tên Trường - Tên Lớp] - [Giờ chụp thực tế: HH:mm:ss DD/MM/YYYY] - [Ca ăn: Trưa]
   ```
   *Ví dụ:* `[TH Chu Văn An - Lớp 3A2] - [11:15:22 28/10/2026] - [Bữa Trưa]`
3. **Chống gian lận bằng kiểm tra băm SHA-256 (Anti-Fraud Duplicate Hash Check):**
   - Hệ thống tính hash SHA-256 cho từng ảnh ngay khi upload.
   - Nếu phát hiện 2 hoặc 3 ảnh có cùng hash (cố tình tải 1 ảnh 3 lần), hệ thống lập tức từ chối và cảnh báo đỏ: *"Phát hiện ảnh trùng lặp. Vui lòng chụp khay cơm của 3 học sinh riêng biệt!"*
4. **Kiểm soát nút bấm hoàn tất:** Nút **"Xác Nhận & Gửi Báo Cáo"** bị **DISABLED (Vô hiệu hóa)** cho đến khi cả 3 ảnh được tải lên và xác thực tính hợp lệ thành công.

---

### 2.3. Quy Định Lưu Mẫu Thức Ăn 24H (Bắt Buộc Theo Quy Định Bộ Y Tế)
Cán bộ y tế/dinh dưỡng thực hiện song song việc lưu mẫu thực phẩm của toàn bộ ca ăn:
- Mỗi món ăn được chia vào hũ thủy tinh/inox vô trùng riêng biệt với khối lượng chuẩn theo quy định:
  - Thức ăn đặc/mặn: $\ge 100g$.
  - Thức ăn lỏng/canh: $\ge 150ml$.
- Dán tem niêm phong ghi rõ: Giờ lưu, ngày lưu, tên món, người lưu.
- Nhập thông tin lên hệ thống:
  - **Mã niêm phong (`seal_code`):** Mã vạch hoặc số seri trên tem niêm phong.
  - **Vị trí lưu (`storage_location`):** Ví dụ *"Tủ lưu mẫu y tế số 01 - Ngăn 2"*.
  - **Nhiệt độ tủ lưu (`storage_temperature_celsius`):** Bắt buộc duy trì trong dải an toàn từ **$2^\circ\text{C}$ đến $8^\circ\text{C}$**.
  - **Chữ ký điện tử/Xác nhận của người lưu mẫu (`sampler_signature`):** Lưu vết người chịu trách nhiệm trước pháp luật.
  - **Ảnh chụp hũ lưu mẫu đã dán tem niêm phong.**

---

## 3. Quy Trình Chuyển Trạng Thái

- Mỗi lớp gửi báo cáo thành công sẽ lưu một bản ghi vào `class_servings`.
- Khi các lớp trọng điểm hoàn tất gửi báo cáo và biên bản lưu mẫu 24h đã được tạo thành công, ca ăn chuyển sang trạng thái **`CLASS_SERVED`**.

---

## 4. API Endpoints

### 4.1. Lấy thông tin lớp và ca ăn để giáo viên chuẩn bị nhận
```http
GET /api/v1/classes/{classId}/batches/active
Authorization: Bearer <TOKEN_TEACHER>
```

### 4.2. Gửi báo cáo nhận suất ăn lớp học & 3 ảnh kèm Watermark
```http
POST /api/v1/classes/{classId}/servings
Authorization: Bearer <TOKEN_TEACHER>
Content-Type: multipart/form-data
```
**Payload Form Data:**
- `batchId`: UUID ca ăn
- `totalStudentsInClass`: 35
- `boardingStudentsCount`: 34
- `receivedPortions`: 34
- `eatingStartTime`: `2026-10-28T11:15:00`
- `notes`: "Các con ăn ngon miệng, cơm nóng sốt"
- `photo1`: File ảnh khay 1 (đã có watermark)
- `photo2`: File ảnh khay 2 (đã có watermark)
- `photo3`: File ảnh khay 3 (đã có watermark)

**Response (201 Created):**
```json
{
  "code": 201,
  "message": "Class serving report submitted successfully with 3 verified photos",
  "data": {
    "servingId": "c4d79b91-884b-4a52-b883-fa4c0b621e20",
    "photoHashes": [
      "d28a38a74b4fa12f7142fa92c68f2f2...",
      "f0b1828c8deac092b321a5b8214f4e7...",
      "1a967f402c38217bbba942ff903b123..."
    ],
    "status": "RECORDED"
  }
}
```

### 4.3. Đăng ký biên bản lưu mẫu thức ăn 24h
```http
POST /api/v1/batches/{batchId}/food-samples
Authorization: Bearer <TOKEN_HEALTH_STAFF>
Content-Type: multipart/form-data
```
**Payload Form Data:**
- `sealCode`: "SEAL-20261028-091"
- `storageLocation`: "Tủ bảo quản mẫu Y tế số 1 - Tầng 1"
- `storageTemperatureCelsius`: 4.5
- `samplerName`: "Y tá Nguyễn Thu Hà"
- `samplerSignature`: "NguyenThuHa_Verified_2026"
- `samplePhoto`: File ảnh hũ niêm phong

---

## 5. Checklist Tiến Độ Tính Năng (Feature Checklist)

- [ ] **Database & Migrations**
  - [ ] Migration bảng `class_servings`, `classroom_meal_photos` và `food_samples_24h`.
  - [ ] Ràng buộc kiểm tra nhiệt độ tủ lưu: `2.0 <= storage_temperature_celsius <= 8.0`.
  - [ ] Ràng buộc unique hoặc validation code chặn duplicate `photo_hash` trong cùng 1 lần nộp `serving_id`.
- [ ] **Backend Service & Validation**
  - [ ] Kiểm tra tối thiểu 3 tệp ảnh trong request của cô giáo.
  - [ ] Tính toán SHA-256 hash của từng tệp ảnh và đảm bảo 3 hash hoàn toàn khác nhau.
  - [ ] API ghi nhận biên bản lưu mẫu thực phẩm 24h theo chuẩn Bộ Y tế.
  - [ ] Chuyển trạng thái `meal_batches` sang `CLASS_SERVED`.
- [ ] **Frontend Teacher PWA & Watermark Camera**
  - [ ] Component Camera chụp ảnh bằng WebRTC HTML5 Canvas.
  - [ ] Lớp vẽ phủ Watermark cứng (Tên trường, lớp, thời gian thực tế, ca ăn).
  - [ ] Giao diện hiển thị 3 ô ảnh `Slot 1 - Học sinh A`, `Slot 2 - Học sinh B`, `Slot 3 - Học sinh C`.
  - [ ] Disable nút bấm gửi báo cáo nếu chưa chụp đủ 3 ảnh hoặc có ảnh bị trùng lặp.
- [ ] **Kiểm Thử (Testing)**
  - [ ] Test thử nghiệm tải cùng 1 file ảnh vào cả 3 slot -> Hệ thống phải chặn và báo lỗi rõ ràng.
  - [ ] Test nhập nhiệt độ tủ mẫu ngoài dải 2 - 8°C (ví dụ 10°C hoặc -1°C) -> Hệ thống từ chối lưu biên bản.
