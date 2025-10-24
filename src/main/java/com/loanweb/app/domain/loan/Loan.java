package com.loanweb.app.domain.loan;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record Loan(
    Long id,
    Long userId,
    LoanType loanType,
    BigDecimal loanAmount,
    BigDecimal interestRate,
    Integer loanTermMonths,
    BigDecimal monthlyPayment,
    BigDecimal totalAmount,
    BigDecimal outstandingBalance,
    LoanStatus status,
    String purpose,
    LocalDate startDate,
    LocalDate endDate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public enum LoanType {
        PERSONAL, AUTO, BUSINESS, MORTGAGE, STUDENT
    }

    public enum LoanStatus {
        PENDING, APPROVED, ACTIVE, PAID_OFF, REJECTED, DEFAULTED
    }
}
