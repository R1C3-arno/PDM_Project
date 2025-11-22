package com.loanweb.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Double balance;
    private Double availableCredit;
    private Double totalBorrowed;
    private Double totalRepaid;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
    public Double getAvailableCredit() { return availableCredit; }
    public void setAvailableCredit(Double availableCredit) { this.availableCredit = availableCredit; }
    public Double getTotalBorrowed() { return totalBorrowed; }
    public void setTotalBorrowed(Double totalBorrowed) { this.totalBorrowed = totalBorrowed; }
    public Double getTotalRepaid() { return totalRepaid; }
    public void setTotalRepaid(Double totalRepaid) { this.totalRepaid = totalRepaid; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}