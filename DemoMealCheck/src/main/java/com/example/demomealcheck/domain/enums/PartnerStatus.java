package com.example.demomealcheck.domain.enums;

public enum PartnerStatus {
    ACTIVE("Đang hợp tác"),
    SUSPENDED("Tạm ngưng"),
    TERMINATED("Đã thanh lý");

    private final String description;

    PartnerStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
