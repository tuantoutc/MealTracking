package com.example.demomealcheck.dto.request;

import com.example.demomealcheck.domain.enums.ClientStatus;
import com.example.demomealcheck.domain.enums.ClientType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierClientRequest {

    @NotBlank(message = "Tên khách hàng/trường học/công ty không được để trống")
    private String name;

    @NotNull(message = "Vui lòng chọn loại hình khách hàng")
    private ClientType clientType;

    @NotBlank(message = "Địa chỉ nhận suất ăn không được để trống")
    private String address;

    @NotBlank(message = "Họ tên người đại diện làm việc không được để trống")
    private String representativeName;

    private String representativeTitle;

    @NotBlank(message = "Số điện thoại liên hệ không được để trống")
    private String phone;

    private String email;

    @NotBlank(message = "Mã/Số hợp đồng không được để trống")
    private String contractNumber;

    @Min(value = 0, message = "Số suất ăn không hợp lệ")
    private Integer dailyServings;

    @Min(value = 0, message = "Đơn giá suất ăn không hợp lệ")
    private Double pricePerServing;

    @NotNull(message = "Ngày bắt đầu hợp đồng không được để trống")
    private LocalDate contractStartDate;

    @NotNull(message = "Ngày kết thúc hợp đồng không được để trống")
    private LocalDate contractEndDate;

    private String contractPdfUrl;

    private ClientStatus status;

    private String notes;
}
