package com.loanweb.dto.message;

import com.loanweb.domain.message.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

    private Long id;
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private Long recipientId;
    private String recipientName;
    private String recipientEmail;
    private String subject;
    private String body;
    private Boolean readStatus;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    /**
     * Convert Message entity to MessageDTO
     */
    public static MessageDTO fromEntity(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .senderEmail(message.getSender().getEmail())
                .recipientId(message.getRecipient().getId())
                .recipientName(message.getRecipient().getFullName())
                .recipientEmail(message.getRecipient().getEmail())
                .subject(message.getSubject())
                .body(message.getBody())
                .readStatus(message.getReadStatus())
                .createdAt(message.getCreatedAt())
                .readAt(message.getReadAt())
                .build();
    }
}
