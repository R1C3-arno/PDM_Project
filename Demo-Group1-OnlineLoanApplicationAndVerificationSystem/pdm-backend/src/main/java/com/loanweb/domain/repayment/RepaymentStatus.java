package com.loanweb.domain.repayment;

/**
 * Status of a repayment schedule.
 */
public enum RepaymentStatus {
    ACTIVE,      // Loan is being repaid
    COMPLETED,   // All installments paid
    DEFAULTED,   // Borrower defaulted
    CANCELLED    // Schedule cancelled
}
