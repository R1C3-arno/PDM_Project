package com.loanweb.app.service;

import com.loanweb.app.entity.Notification;
import com.loanweb.app.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository repo;

    public List<Notification> getAll() {
        return repo.findAll();
    }

    public Notification getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Notification> getUserNotifications(Long userId, Boolean isRead) {
        var stream = repo.findAll().stream()
                .filter(n -> n.getUserId().equals(userId));

        if (isRead != null) {
            stream = stream.filter(n -> isRead.equals(n.getIsRead()));
        }

        return stream
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Notification create(Notification notification) {
        return repo.save(notification);
    }

    public Notification markAsRead(Long id) {
        Notification notification = repo.findById(id).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            return repo.save(notification);
        }
        return null;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}