package com.loanweb.app.domain.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record Transaction(
    Long id,
    Long userId,
    Long loanId,
    TransactionType transactionType,
    BigDecimal amount,
    String description,
    TransactionStatus status,
    LocalDateTime transactionDate,
    String referenceNumber
) {
    public enum TransactionType {
        LOAN_DISBURSEMENT,
        PAYMENT,
        DEPOSIT,
        WITHDRAWAL,
        FEE,
        REFUND
    }

    public enum TransactionStatus {
        PENDING,
        COMPLETED,
        FAILED,
        CANCELLED
    }
}
