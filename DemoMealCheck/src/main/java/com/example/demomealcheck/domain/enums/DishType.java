package com.example.demomealcheck.domain.enums;

import lombok.Getter;

@Getter
public enum DishType {
    COM("Cơm", "g"),
    CANH("Món canh", "ml"),
    KHO("Món kho", "g"),
    XAO("Món xào", "g"),
    RAN("Món rán", "g"),
    TRANG_MIENG("Đồ tráng miệng", "g"),
    BUN("Bún", "ml"),
    MIEN("Miến", "ml"),
    PHO("Phở", "ml"),
    CHAO("Cháo", "ml"),
    KHAC("Khác", "g");

    private final String displayName;
    private final String defaultUnit;

    DishType(String displayName, String defaultUnit) {
        this.displayName = displayName;
        this.defaultUnit = defaultUnit;
    }
}
