package com.loanweb.app.controller;

import com.loanweb.app.entity.TicketMessage;
import com.loanweb.app.service.TicketMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ticket-messages")
@CrossOrigin(origins = "*")
public class TicketMessageController {
    @Autowired
    private TicketMessageService service;

    @GetMapping
    public List<TicketMessage> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public TicketMessage getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/ticket/{ticketId}")
    public List<TicketMessage> getTicketMessages(@PathVariable Long ticketId) {
        return service.getTicketMessages(ticketId);
    }

    @PostMapping
    public TicketMessage create(@RequestBody TicketMessage message) {
        return service.create(message);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}