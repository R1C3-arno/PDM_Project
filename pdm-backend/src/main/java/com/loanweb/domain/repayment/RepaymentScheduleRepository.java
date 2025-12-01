package com.loanweb.domain.repayment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for RepaymentSchedule entities.
 */
@Repository
public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, Long> {

    /**
     * Find all schedules for a specific borrower.
     */
    List<RepaymentSchedule> findByBorrowerId(Long borrowerId);

    /**
     * Find schedule by application ID.
     */
    Optional<RepaymentSchedule> findByApplicationId(Long applicationId);

    /**
     * Find all active schedules.
     */
    List<RepaymentSchedule> findByStatus(RepaymentStatus status);

    /**
     * Find schedules by borrower email.
     */
    @Query("SELECT rs FROM RepaymentSchedule rs WHERE rs.borrower.email = :email")
    List<RepaymentSchedule> findByBorrowerEmail(@Param("email") String email);

    /**
     * Count schedules by status.
     */
    long countByStatus(RepaymentStatus status);
}
