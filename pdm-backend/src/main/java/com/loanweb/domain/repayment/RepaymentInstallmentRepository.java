package com.loanweb.domain.repayment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for RepaymentInstallment entities.
 */
@Repository
public interface RepaymentInstallmentRepository extends JpaRepository<RepaymentInstallment, Long> {

    /**
     * Find all installments for a schedule.
     */
    List<RepaymentInstallment> findByScheduleIdOrderByInstallmentNumber(Long scheduleId);

    /**
     * Find all overdue installments.
     */
    @Query("SELECT ri FROM RepaymentInstallment ri WHERE ri.status = 'OVERDUE'")
    List<RepaymentInstallment> findAllOverdue();

    /**
     * Find installments due before a date that are not paid.
     */
    @Query("SELECT ri FROM RepaymentInstallment ri WHERE ri.dueDate < :date AND ri.status NOT IN ('PAID')")
    List<RepaymentInstallment> findOverdueBeforeDate(@Param("date") LocalDate date);

    /**
     * Find installments by status.
     */
    List<RepaymentInstallment> findByStatus(InstallmentStatus status);

    /**
     * Find pending installments due within a date range.
     */
    @Query("SELECT ri FROM RepaymentInstallment ri WHERE ri.dueDate BETWEEN :startDate AND :endDate AND ri.status = 'PENDING'")
    List<RepaymentInstallment> findUpcomingDue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Count overdue installments.
     */
    @Query("SELECT COUNT(ri) FROM RepaymentInstallment ri WHERE ri.status = 'OVERDUE'")
    long countOverdue();
}
