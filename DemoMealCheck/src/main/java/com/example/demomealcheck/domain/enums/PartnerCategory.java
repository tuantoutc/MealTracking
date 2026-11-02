package com.example.demomealcheck.domain.enums;

public enum PartnerCategory {
    RAU_CU("Rau củ quả sạch"),
    THIT_CA("Thịt tươi & Thủy hải sản"),
    DO_KHO("Gạo, đồ khô & Ngũ cốc"),
    GIA_VI_NHU_YEU_PHAM("Gia vị & Nhu yếu phẩm"),
    KHAC("Nhóm thực phẩm khác");

    private final String description;

    PartnerCategory(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
