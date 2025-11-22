package com.loanweb.app.service;

import com.loanweb.app.entity.Notification;
import com.loanweb.app.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository repo;

    public List<Notification> getAll() { return repo.findAll(); }
    public Notification getById(Long id) { return repo.findById(id).orElse(null); }
    public Notification create(Notification notification) { return repo.save(notification); }
    public void delete(Long id) { repo.deleteById(id); }
}