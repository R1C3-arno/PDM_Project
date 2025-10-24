package com.loanweb.app.domain.user;

import java.time.LocalDateTime;

public record User(
    Long id,
    String email,
    String password,
    String fullName,
    String phone,
    String address,
    UserRole role,
    UserStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public enum UserRole {
        USER, ADMIN
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
