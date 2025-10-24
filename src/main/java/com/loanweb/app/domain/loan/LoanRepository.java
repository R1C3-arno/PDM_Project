package com.loanweb.app.domain.loan;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class LoanRepository {
    private final JdbcTemplate jdbc;

    public LoanRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Loan> LOAN_ROW_MAPPER = (rs, rowNum) -> {
        var startDate = rs.getDate("start_date");
        var endDate = rs.getDate("end_date");
        return new Loan(
            rs.getLong("id"),
            rs.getLong("user_id"),
            Loan.LoanType.valueOf(rs.getString("loan_type")),
            rs.getBigDecimal("loan_amount"),
            rs.getBigDecimal("interest_rate"),
            rs.getInt("loan_term_months"),
            rs.getBigDecimal("monthly_payment"),
            rs.getBigDecimal("total_amount"),
            rs.getBigDecimal("outstanding_balance"),
            Loan.LoanStatus.valueOf(rs.getString("status")),
            rs.getString("purpose"),
            startDate != null ? startDate.toLocalDate() : null,
            endDate != null ? endDate.toLocalDate() : null,
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
        );
    };

    public List<Loan> findAll() {
        return jdbc.query("SELECT * FROM loans ORDER BY id DESC", LOAN_ROW_MAPPER);
    }

    public Optional<Loan> findById(Long id) {
        List<Loan> loans = jdbc.query(
            "SELECT * FROM loans WHERE id = ?",
            LOAN_ROW_MAPPER,
            id
        );
        return loans.isEmpty() ? Optional.empty() : Optional.of(loans.get(0));
    }

    public List<Loan> findByUserId(Long userId) {
        return jdbc.query(
            "SELECT * FROM loans WHERE user_id = ? ORDER BY id DESC",
            LOAN_ROW_MAPPER,
            userId
        );
    }

    public List<Loan> findByStatus(Loan.LoanStatus status) {
        return jdbc.query(
            "SELECT * FROM loans WHERE status = ? ORDER BY id DESC",
            LOAN_ROW_MAPPER,
            status.name()
        );
    }

    public int create(Long userId, Loan.LoanType loanType, BigDecimal loanAmount,
                     BigDecimal interestRate, Integer loanTermMonths, BigDecimal monthlyPayment,
                     BigDecimal totalAmount, String purpose) {
        return jdbc.update(
            "INSERT INTO loans (user_id, loan_type, loan_amount, interest_rate, loan_term_months, " +
            "monthly_payment, total_amount, outstanding_balance, status, purpose) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            userId, loanType.name(), loanAmount, interestRate, loanTermMonths,
            monthlyPayment, totalAmount, loanAmount, Loan.LoanStatus.PENDING.name(), purpose
        );
    }

    public int updateStatus(Long id, Loan.LoanStatus status) {
        return jdbc.update(
            "UPDATE loans SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            status.name(), id
        );
    }

    public int updateOutstandingBalance(Long id, BigDecimal outstandingBalance) {
        return jdbc.update(
            "UPDATE loans SET outstanding_balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            outstandingBalance, id
        );
    }

    public int approveLoan(Long id, LocalDate startDate, LocalDate endDate) {
        return jdbc.update(
            "UPDATE loans SET status = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            Loan.LoanStatus.ACTIVE.name(), startDate, endDate, id
        );
    }

    public long countByStatus(Loan.LoanStatus status) {
        return jdbc.queryForObject(
            "SELECT COUNT(*) FROM loans WHERE status = ?",
            Long.class,
            status.name()
        );
    }

    public BigDecimal getTotalLoanAmount() {
        return jdbc.queryForObject(
            "SELECT COALESCE(SUM(loan_amount), 0) FROM loans WHERE status IN ('ACTIVE', 'PAID_OFF')",
            BigDecimal.class
        );
    }
}
