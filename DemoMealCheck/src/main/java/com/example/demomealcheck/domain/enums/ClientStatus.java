package com.example.demomealcheck.domain.enums;

public enum ClientStatus {
    ACTIVE("Đang thực hiện"),
    PAUSED("Tạm dừng"),
    EXPIRED("Đã kết thúc");

    private final String description;

    ClientStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
