package com.example.demomealcheck.domain.enums;

public enum ClientType {
    TRUONG_MAM_NON("Trường Mầm non"),
    TRUONG_TIEU_HOC("Trường Tiểu học"),
    TRUONG_THCS("Trường THCS / THPT"),
    DOANH_NGHIEP("Doanh nghiệp / Văn phòng"),
    KHAC("Cơ sở khác");

    private final String description;

    ClientType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
