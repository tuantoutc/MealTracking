package com.example.demomealcheck.dto.request;

import com.example.demomealcheck.domain.enums.PartnerCategory;
import com.example.demomealcheck.domain.enums.PartnerStatus;
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
public class FoodPartnerRequest {

    @NotBlank(message = "Tên đơn vị đối tác không được để trống")
    private String name;

    @NotNull(message = "Vui lòng chọn danh mục phân loại thực phẩm")
    private PartnerCategory category;

    private String representative;

    private String phone;

    private String email;

    @NotBlank(message = "Địa chỉ cơ sở/nông trại không được để trống")
    private String address;

    @NotBlank(message = "Vui lòng khai báo danh mục sản phẩm cung cấp")
    private String suppliedProducts;

    private String contractNumber;

    private LocalDate contractStartDate;

    private LocalDate contractEndDate;

    private String certifications;

    private String certificateFiles;

    private PartnerStatus status;

    private String notes;
}
