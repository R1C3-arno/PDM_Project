package com.loanweb.domain.repayment;

/**
 * Status of an individual installment.
 */
public enum InstallmentStatus {
    PENDING,     // Not yet due
    DUE,         // Payment due
    PAID,        // Payment received
    OVERDUE,     // Past due date, not paid
    PARTIALLY_PAID  // Partial payment received
}
