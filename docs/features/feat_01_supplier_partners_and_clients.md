# ĐẶC TẢ TÍNH NĂNG: QUẢN LÝ ĐỐI TÁC CUNG ỨNG & KHÁCH HÀNG SUẤT ĂN (SUPPLIER HUB)

- **Mã tính năng:** `FEAT-01-PARTNERS`
- **Vai trò thụ hưởng:** `ROLE_SUPPLIER` (Nhà cung cấp / Bếp trung tâm)
- **Tình trạng:** `ĐÃ HOÀN THÀNH` [x]

---

## 1. Mục Tiêu Nghiệp Vụ
Cung cấp cho Nhà cung cấp (Bếp trung tâm) một trung tâm điều hành toàn diện để:
1. **Quản lý chuỗi cung ứng thực phẩm (Tab Đối Tác):** Lưu trữ, kiểm soát tính pháp lý và nguồn gốc của các cơ sở cung ứng Rau củ quả, Thịt tươi sống/thủy hải sản, Gạo & đồ khô, Nhu yếu phẩm/gia vị đạt chuẩn VietGAP, HACCP, ISO 22000, VSATTP.
2. **Quản lý khách hàng sử dụng dịch vụ (Tab Khách Hàng):** Quản lý hợp đồng cung ứng suất ăn bán trú với các trường mầm non, tiểu học, trung học cơ sở và doanh nghiệp; kiểm soát số lượng suất cam kết/ngày, đơn giá mỗi suất, thời hạn hợp đồng và bản mềm PDF hợp đồng có giá trị pháp lý.

---

## 2. Mô Hình Cơ Sở Dữ Liệu

### 2.1. Bảng `supplier_food_partners` (Đối tác cung ứng thực phẩm)
- `id`: BIGSERIAL (Khóa chính)
- `supplier_id`: BIGINT (Khóa ngoại liên kết `users.id`)
- `name`: VARCHAR(200) (Tên đơn vị, HTX, Công ty đối tác)
- `category`: VARCHAR(50) (`RAU_CU`, `THIT_CA`, `DO_KHO`, `GIA_VI_NHU_YEU_PHAM`, `KHAC`)
- `representative`: VARCHAR(100) (Người đại diện)
- `phone`: VARCHAR(30) (SĐT liên hệ)
- `email`: VARCHAR(100) (Email)
- `address`: TEXT (Địa chỉ cơ sở/nông trại)
- `supplied_products`: TEXT (Danh mục mặt hàng khai báo cung cấp)
- `contract_number`: VARCHAR(100) (Số/Mã hợp đồng làm việc)
- `contract_start_date`: DATE (Ngày bắt đầu hợp đồng)
- `contract_end_date`: DATE (Thời hạn/Ngày hết hạn hợp đồng)
- `certifications`: TEXT (Giấy tờ đạt chuẩn: VietGAP, HACCP, VSATTP...)
- `certificate_files`: TEXT (Link hoặc file đính kèm chứng nhận)
- `status`: VARCHAR(30) (`ACTIVE`, `SUSPENDED`, `TERMINATED`)
- `notes`: TEXT (Điều kiện giao nhận, kiểm dịch)

### 2.2. Bảng `supplier_clients` (Khách hàng sử dụng dịch vụ suất ăn)
- `id`: BIGSERIAL (Khóa chính)
- `supplier_id`: BIGINT (Khóa ngoại liên kết `users.id`)
- `name`: VARCHAR(200) (Tên trường học/công ty)
- `client_type`: VARCHAR(50) (`TRUONG_MAM_NON`, `TRUONG_TIEU_HOC`, `TRUONG_THCS`, `DOANH_NGHIEP`, `KHAC`)
- `address`: TEXT (Địa chỉ giao nhận suất ăn)
- `representative_name`: VARCHAR(100) (Họ tên người đại diện)
- `representative_title`: VARCHAR(100) (Chức vụ: Hiệu trưởng, Trưởng ban bán trú...)
- `phone`: VARCHAR(30) (SĐT liên hệ)
- `email`: VARCHAR(100) (Email)
- `contract_number`: VARCHAR(100) (Mã số hợp đồng cung cấp suất ăn)
- `daily_servings`: INT (Số lượng suất cam kết phục vụ mỗi ngày)
- `price_per_serving`: DOUBLE PRECISION (Đơn giá mỗi suất ăn VNĐ)
- `contract_start_date`: DATE (Ngày bắt đầu)
- `contract_end_date`: DATE (Ngày kết thúc)
- `contract_pdf_url`: TEXT (Bản mềm PDF hợp đồng)
- `status`: VARCHAR(30) (`ACTIVE`, `PAUSED`, `EXPIRED`)
- `notes`: TEXT (Yêu cầu vận hành, nhiệt độ cổng ≥ 65°C)

---

## 3. Danh Sách Endpoint RESTful API

| Method | Endpoint | Mô tả | Quyền truy cập |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/supplier/summary` | Thống kê tổng số đối tác, khách hàng, tổng suất ăn/ngày | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `GET` | `/api/v1/supplier/partners` | Danh sách đối tác (hỗ trợ lọc category, status, search) | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `GET` | `/api/v1/supplier/partners/{id}` | Xem chi tiết 1 đối tác thực phẩm | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `POST` | `/api/v1/supplier/partners` | Tạo mới đối tác thực phẩm | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `PUT` | `/api/v1/supplier/partners/{id}` | Cập nhật thông tin đối tác | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `DELETE` | `/api/v1/supplier/partners/{id}` | Xóa đối tác khỏi danh sách | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `GET` | `/api/v1/supplier/clients` | Danh sách khách hàng (hỗ trợ lọc clientType, status, search) | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `GET` | `/api/v1/supplier/clients/{id}` | Xem chi tiết 1 khách hàng | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `POST` | `/api/v1/supplier/clients` | Thêm mới khách hàng | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `PUT` | `/api/v1/supplier/clients/{id}` | Cập nhật khách hàng | `ROLE_SUPPLIER`, `ROLE_ADMIN` |
| `DELETE` | `/api/v1/supplier/clients/{id}` | Xóa khách hàng khỏi danh sách | `ROLE_SUPPLIER`, `ROLE_ADMIN` |

---

## 4. Giao Diện Người Dùng (`/supplier`)
1. **Thống kê 4 thẻ chỉ số nhanh:** Tổng đối tác, Số khách hàng, Tổng suất cam kết/ngày, Đạt chuẩn ATTP.
2. **Tab Đối Tác:** Lọc theo 5 phân loại (Rau củ, Thịt cá, Đồ khô, Gia vị, Khác), lọc trạng thái, tìm kiếm, CRUD đầy đủ.
3. **Tab Khách Hàng:** Lọc theo 5 nhóm trường học & doanh nghiệp, lọc trạng thái, tìm kiếm, CRUD đầy đủ.
4. **Trình xem Bản mềm PDF Hợp đồng (`ContractPdfModal`):** Mô phỏng văn bản hợp đồng kinh tế chính thức của Việt Nam có Quốc hiệu, tiêu ngữ, thông tin Bên A, Bên B, 5 điều khoản chặt chẽ, chữ ký và dấu chứng thực số `ĐÃ KÝ ĐIỆN TỬ`, hỗ trợ In ấn và Tải tệp.
5. **Huy hiệu Tích xanh chuẩn Facebook:** Hiển thị nổi bật tại tiêu đề; tự động ẩn nút "Xin tích xanh" khi tài khoản đã được cấp tích xanh.
