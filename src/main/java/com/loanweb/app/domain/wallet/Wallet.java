package com.loanweb.app.domain.wallet;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record Wallet(
    Long id,
    Long userId,
    BigDecimal balance,
    BigDecimal availableCredit,
    BigDecimal totalBorrowed,
    BigDecimal totalRepaid,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
