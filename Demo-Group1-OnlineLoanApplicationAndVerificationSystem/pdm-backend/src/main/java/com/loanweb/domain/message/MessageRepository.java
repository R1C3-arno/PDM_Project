package com.loanweb.domain.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Find all messages sent by a specific user
     */
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId ORDER BY m.createdAt DESC")
    List<Message> findBySenderId(@Param("senderId") Long senderId);

    /**
     * Find all messages received by a specific user
     */
    @Query("SELECT m FROM Message m WHERE m.recipient.id = :recipientId ORDER BY m.createdAt DESC")
    List<Message> findByRecipientId(@Param("recipientId") Long recipientId);

    /**
     * Find unread messages for a specific user
     */
    @Query("SELECT m FROM Message m WHERE m.recipient.id = :recipientId AND m.readStatus = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadByRecipientId(@Param("recipientId") Long recipientId);

    /**
     * Count unread messages for a specific user
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient.id = :recipientId AND m.readStatus = false")
    Long countUnreadByRecipientId(@Param("recipientId") Long recipientId);

    /**
     * Find messages between two users
     */
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :userId1 AND m.recipient.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.recipient.id = :userId1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversationBetween(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
