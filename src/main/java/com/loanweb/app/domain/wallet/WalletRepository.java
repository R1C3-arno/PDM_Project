package com.loanweb.app.domain.wallet;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class WalletRepository {
    private final JdbcTemplate jdbc;

    public WalletRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Wallet> WALLET_ROW_MAPPER = (rs, rowNum) -> new Wallet(
        rs.getLong("id"),
        rs.getLong("user_id"),
        rs.getBigDecimal("balance"),
        rs.getBigDecimal("available_credit"),
        rs.getBigDecimal("total_borrowed"),
        rs.getBigDecimal("total_repaid"),
        rs.getTimestamp("created_at").toLocalDateTime(),
        rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public Optional<Wallet> findByUserId(Long userId) {
        List<Wallet> wallets = jdbc.query(
            "SELECT * FROM wallets WHERE user_id = ?",
            WALLET_ROW_MAPPER,
            userId
        );
        return wallets.isEmpty() ? Optional.empty() : Optional.of(wallets.get(0));
    }

    public int create(Long userId, BigDecimal availableCredit) {
        return jdbc.update(
            "INSERT INTO wallets (user_id, balance, available_credit, total_borrowed, total_repaid) " +
            "VALUES (?, 0, ?, 0, 0)",
            userId, availableCredit
        );
    }

    public int updateBalance(Long userId, BigDecimal balance) {
        return jdbc.update(
            "UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            balance, userId
        );
    }

    public int updateBorrowedAndRepaid(Long userId, BigDecimal totalBorrowed, BigDecimal totalRepaid) {
        return jdbc.update(
            "UPDATE wallets SET total_borrowed = ?, total_repaid = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            totalBorrowed, totalRepaid, userId
        );
    }
}
