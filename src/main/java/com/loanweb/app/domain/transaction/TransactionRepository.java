package com.loanweb.app.domain.transaction;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class TransactionRepository {
    private final JdbcTemplate jdbc;

    public TransactionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Transaction> TRANSACTION_ROW_MAPPER = (rs, rowNum) -> {
        Long loanId = rs.getObject("loan_id", Long.class);
        return new Transaction(
            rs.getLong("id"),
            rs.getLong("user_id"),
            loanId,
            Transaction.TransactionType.valueOf(rs.getString("transaction_type")),
            rs.getBigDecimal("amount"),
            rs.getString("description"),
            Transaction.TransactionStatus.valueOf(rs.getString("status")),
            rs.getTimestamp("transaction_date").toLocalDateTime(),
            rs.getString("reference_number")
        );
    };

    public List<Transaction> findAll() {
        return jdbc.query(
            "SELECT * FROM transactions ORDER BY transaction_date DESC",
            TRANSACTION_ROW_MAPPER
        );
    }

    public Optional<Transaction> findById(Long id) {
        List<Transaction> transactions = jdbc.query(
            "SELECT * FROM transactions WHERE id = ?",
            TRANSACTION_ROW_MAPPER,
            id
        );
        return transactions.isEmpty() ? Optional.empty() : Optional.of(transactions.get(0));
    }

    public List<Transaction> findByUserId(Long userId) {
        return jdbc.query(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC",
            TRANSACTION_ROW_MAPPER,
            userId
        );
    }

    public List<Transaction> findByLoanId(Long loanId) {
        return jdbc.query(
            "SELECT * FROM transactions WHERE loan_id = ? ORDER BY transaction_date DESC",
            TRANSACTION_ROW_MAPPER,
            loanId
        );
    }

    public int create(Long userId, Long loanId, Transaction.TransactionType type,
                     BigDecimal amount, String description, String referenceNumber) {
        return jdbc.update(
            "INSERT INTO transactions (user_id, loan_id, transaction_type, amount, description, status, reference_number) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            userId, loanId, type.name(), amount, description,
            Transaction.TransactionStatus.COMPLETED.name(), referenceNumber
        );
    }

    public int updateStatus(Long id, Transaction.TransactionStatus status) {
        return jdbc.update(
            "UPDATE transactions SET status = ? WHERE id = ?",
            status.name(), id
        );
    }

    public BigDecimal getTotalByUserIdAndType(Long userId, Transaction.TransactionType type) {
        return jdbc.queryForObject(
            "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = ? AND transaction_type = ? AND status = ?",
            BigDecimal.class,
            userId, type.name(), Transaction.TransactionStatus.COMPLETED.name()
        );
    }

    public List<Transaction> findRecentTransactions(int limit) {
        return jdbc.query(
            "SELECT * FROM transactions ORDER BY transaction_date DESC LIMIT ?",
            TRANSACTION_ROW_MAPPER,
            limit
        );
    }
}
