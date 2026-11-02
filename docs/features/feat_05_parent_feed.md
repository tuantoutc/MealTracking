# FEAT-05: Công Khai Thời Gian Thực & Phụ Huynh Giám Sát (Parent Transparency Feed)

## 1. Thông Tin Chung
- **Mã tính năng:** `FEAT-05`
- **Khung giờ thực hiện:** Sau 11:30 (Thời gian thực - Real-time)
- **Tác nhân thực hiện:** Phụ huynh học sinh (`PARENT`) & Ban Giám Hiệu (`ADMIN`, `PRINCIPAL`)
- **Trạng thái chuyển dịch:** `CLASS_SERVED` ➔ `PUBLISHED_FOR_PARENTS`
- **Bảng dữ liệu tác động:** `parent_feedbacks`, `meal_batches`, `benchmark_portions`, `classroom_meal_photos`, `batch_menu_items`

---

## 2. Mô Tả Nghiệp Vụ

### 2.1. Kích hoạt công khai dữ liệu (Data Publishing)
Sau khi các lớp hoàn thành việc nộp ảnh khay cơm và kiểm tra lưu mẫu 24h, hệ thống tự động (hoặc Ban Giám Hiệu duyệt một chạm) kích hoạt chuyển trạng thái ca ăn sang **`PUBLISHED_FOR_PARENTS`**.
- Hệ thống đẩy thông báo (Push Notification/Zalo ZNS/In-App) đến điện thoại của toàn bộ phụ huynh có con ăn bán trú: *"Bữa trưa hôm nay của bé [Tên học sinh] tại lớp [Tên lớp] đã sẵn sàng. Mời phụ huynh xem hình ảnh và thực đơn thực tế!"*

---

### 2.2. Giao Diện So Sánh Trực Quan Đối Chứng (Side-by-Side Comparison)
Khi phụ huynh mở ứng dụng di động hoặc web portal:
1. **Bên Trái - Khay Cơm Chuẩn (Benchmark Ground Truth):**
   - ẢNH SUẤT ĂN TIÊU CHUẨN do chuyên viên dinh dưỡng/bếp trưởng chụp lúc 10:30.
   - Thể hiện tiêu chuẩn cam kết: màu sắc, độ đầy đặn, các món ăn.
2. **Bên Phải - Khay Cơm Thực Tế Tại Lớp Của Con (Tri-Photo Live Feed):**
   - Bộ 03 ẢNH THỰC TẾ chụp tại lớp học của con mình (do cô giáo chủ nhiệm chụp lúc 11:15).
   - Có dấu Watermark rõ ràng: `[Tên Trường - Tên Lớp] - [Giờ chụp thực tế: HH:mm:ss] - [Ca ăn]`.
   - Phụ huynh có thể phóng to (zoom), vuốt chuyển đổi giữa 3 khay để quan sát chi tiết.
3. **Thanh Thông Tin Minh Bạch Toàn Trình:**
   - **Thực đơn & Định lượng cam kết:** Bảng chi tiết từng món ăn (ví dụ: *Thịt kho trứng: 90g, Cơm trắng: 200g, Canh chua: 150ml...*).
   - **Giờ bắt đầu ăn thực tế:** Ghi nhận chính xác (ví dụ: *11:18 AM*).
   - **Nguồn gốc thực phẩm & Logistics:** Đơn vị cung cấp, Bếp trưởng chịu trách nhiệm, KCS, Biển số xe giao nhận, Nhiệt độ khi nhận tại cổng trường ($> 60^\circ\text{C}$).

---

### 2.3. Đánh Giá & Góp Ý Đa Chiều (Feedback & Rating Loop)
Mỗi phụ huynh của lớp có quyền để lại đánh giá cho ca ăn của con:
1. **Chấm điểm sao:** Từ 1 đến 5 sao ($\star \star \star \star \star$).
2. **Chọn nhanh bộ Tag nhận xét (Quick Tags):**
   - *Tích cực:* `Khay cơm đầy đặn`, `Đồ ăn nóng sốt`, `Rau xanh tươi ngon`, `Con ăn hết suất`.
   - *Góp ý:* `Cơm hơi khô`, `Canh hơi vơi`, `Thức ăn hơi nguội`, `Món mặn hơi mặn`, `Ít rau`.
3. **Ý kiến góp ý chi tiết:** Nhập bình luận phản hồi văn bản.
4. **Kênh tiếp nhận trực tiếp:** Phản hồi được chuyển ngay lập tức tới:
   - Ban Giám Hiệu nhà trường.
   - Ban đại diện Cha mẹ học sinh.
   - Đơn vị cung ứng suất ăn (để rà soát cải thiện chất lượng ngay hôm sau).

---

## 3. API Endpoints

### 3.1. Lấy dữ liệu công khai bữa ăn theo lớp của con
```http
GET /api/v1/parent/meal-feed?studentId={studentId}&date=2026-10-28
Authorization: Bearer <TOKEN_PARENT>
```
**Response (200 OK):**
```json
{
  "code": 200,
  "message": "Meal feed retrieved successfully",
  "data": {
    "batchId": "a90b4bf9-9942-4fcf-bca9-59eb82bb617e",
    "batchName": "Bữa Trưa Bán Trú 28/10/2026",
    "status": "PUBLISHED_FOR_PARENTS",
    "eatingStartTime": "2026-10-28T11:18:00",
    "supplier": {
      "companyName": "Công ty Cổ phần Thực phẩm Học đường Minh Đức",
      "headChef": "Nguyễn Văn Hùng",
      "qaManager": "Trần Thị Lan",
      "deliveryTemperature": 68.5
    },
    "menuItems": [
      { "dishName": "Thịt ba chỉ kho trứng cút", "portionWeight": "90", "unit": "g" },
      { "dishName": "Cơm trắng gạo ST25", "portionWeight": "200", "unit": "g" },
      { "dishName": "Canh cải xoong nấu thịt nạc", "portionWeight": "150", "unit": "ml" },
      { "dishName": "Bắp cải xào tỏi", "portionWeight": "70", "unit": "g" },
      { "dishName": "Chuối tiêu", "portionWeight": "1", "unit": "quả" }
    ],
    "benchmarkPhoto": {
      "photoUrl": "https://storage.mealcheck.edu.vn/benchmarks/bm_20261028.jpg",
      "recordedAt": "2026-10-28T10:45:00"
    },
    "classroomPhotos": [
      {
        "photoUrl": "https://storage.mealcheck.edu.vn/classroom/3A2_tray1.jpg",
        "watermarkText": "[TH Chu Văn An - Lớp 3A2] - [11:15:22 28/10/2026] - [Bữa Trưa]",
        "slot": 1
      },
      {
        "photoUrl": "https://storage.mealcheck.edu.vn/classroom/3A2_tray2.jpg",
        "watermarkText": "[TH Chu Văn An - Lớp 3A2] - [11:16:01 28/10/2026] - [Bữa Trưa]",
        "slot": 2
      },
      {
        "photoUrl": "https://storage.mealcheck.edu.vn/classroom/3A2_tray3.jpg",
        "watermarkText": "[TH Chu Văn An - Lớp 3A2] - [11:16:40 28/10/2026] - [Bữa Trưa]",
        "slot": 3
      }
    ],
    "hasGivenFeedback": false
  }
}
```

### 3.2. Phụ huynh gửi đánh giá & phản hồi
```http
POST /api/v1/parent/feedback
Authorization: Bearer <TOKEN_PARENT>
Content-Type: application/json
```
**Payload:**
```json
{
  "batchId": "a90b4bf9-9942-4fcf-bca9-59eb82bb617e",
  "classId": "3b2e5971-884b-4a52-b883-fa4c0b621e20",
  "studentId": "std_00192",
  "ratingStars": 5,
  "feedbackTags": ["Khay cơm đầy đặn", "Đồ ăn nóng sốt", "Món rau tươi ngon"],
  "comments": "Hôm nay bé ăn rất ngon miệng và khen canh ngọt. Cảm ơn nhà trường và các cô!"
}
```

---

## 4. Checklist Tiến Độ Tính Năng (Feature Checklist)

- [ ] **Database & Migrations**
  - [ ] Migration bảng `parent_feedbacks` với các ràng buộc 1 - 5 sao và lưu mảng tags.
  - [ ] Đảm bảo mỗi phụ huynh/học sinh chỉ đánh giá 1 lần cho 1 ca ăn (Unique constraint trên `[batch_id, student_id]`).
- [ ] **Backend Service & Notification**
  - [ ] Chuyển trạng thái ca ăn sang `PUBLISHED_FOR_PARENTS`.
  - [ ] API lấy dữ liệu chi tiết so sánh Benchmark vs 3 ảnh lớp học.
  - [ ] API lưu nhận xét và tính toán điểm đánh giá trung bình thời gian thực cho BGH xem.
- [ ] **Frontend Parent UI**
  - [ ] Layout Side-by-Side: Khay mẫu (Chuẩn) song song với Slider 3 khay thực tế tại lớp.
  - [ ] Modal phóng to ảnh và xem chi tiết dấu Watermark.
  - [ ] Widget chọn số sao (1-5) và chọn nhanh các tag phản hồi dạng Badge bấm chọn/bỏ chọn.
  - [ ] Báo cáo tổng hợp đánh giá trực quan trên Dashboard của Ban Giám Hiệu.
- [ ] **Kiểm Thử (Testing)**
  - [ ] Test quyền truy cập: Phụ huynh lớp nào chỉ được xem ảnh và thực đơn của lớp con mình.
  - [ ] Kiểm thử gửi phản hồi trùng lặp (chặn spam review).
