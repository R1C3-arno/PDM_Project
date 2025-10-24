package com.loanweb.app.domain.user;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<User> USER_ROW_MAPPER = (rs, rowNum) -> new User(
        rs.getLong("id"),
        rs.getString("email"),
        rs.getString("password"),
        rs.getString("full_name"),
        rs.getString("phone"),
        rs.getString("address"),
        User.UserRole.valueOf(rs.getString("role")),
        User.UserStatus.valueOf(rs.getString("status")),
        rs.getTimestamp("created_at").toLocalDateTime(),
        rs.getTimestamp("updated_at").toLocalDateTime()
    );

    public List<User> findAll() {
        return jdbc.query("SELECT * FROM users ORDER BY id DESC", USER_ROW_MAPPER);
    }

    public Optional<User> findById(Long id) {
        List<User> users = jdbc.query(
            "SELECT * FROM users WHERE id = ?",
            USER_ROW_MAPPER,
            id
        );
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    public Optional<User> findByEmail(String email) {
        List<User> users = jdbc.query(
            "SELECT * FROM users WHERE email = ?",
            USER_ROW_MAPPER,
            email
        );
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    public int create(String email, String password, String fullName, String phone, String address, User.UserRole role) {
        return jdbc.update(
            "INSERT INTO users (email, password, full_name, phone, address, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            email, password, fullName, phone, address, role.name(), User.UserStatus.ACTIVE.name()
        );
    }

    public int update(Long id, String fullName, String phone, String address) {
        return jdbc.update(
            "UPDATE users SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            fullName, phone, address, id
        );
    }

    public int updateStatus(Long id, User.UserStatus status) {
        return jdbc.update(
            "UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            status.name(), id
        );
    }

    public int delete(Long id) {
        return jdbc.update("DELETE FROM users WHERE id = ?", id);
    }

    public long count() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM users", Long.class);
    }
}
