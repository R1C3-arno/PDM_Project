package com.loanweb.app.controller;

import com.loanweb.app.entity.Notification;
import com.loanweb.app.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService service;

    @GetMapping
    public List<Notification> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Notification create(@RequestBody Notification notification) { return service.create(notification); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}