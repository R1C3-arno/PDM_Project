package com.loanweb.app.controller;

import com.loanweb.app.entity.SupportTicket;
import com.loanweb.app.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/support-tickets")
@CrossOrigin(origins = "*")
public class SupportTicketController {
    @Autowired
    private SupportTicketService service;

    @GetMapping
    public List<SupportTicket> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SupportTicket getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/user/{userId}")
    public List<SupportTicket> getUserTickets(@PathVariable Long userId) {
        return service.getUserTickets(userId);
    }

    @PostMapping
    public SupportTicket create(@RequestBody SupportTicket ticket) {
        return service.create(ticket);
    }

    @PutMapping("/{id}")
    public SupportTicket update(@PathVariable Long id, @RequestBody SupportTicket ticket) {
        return service.update(id, ticket);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}