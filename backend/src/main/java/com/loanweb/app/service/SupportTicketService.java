package com.loanweb.app.service;

import com.loanweb.app.entity.SupportTicket;
import com.loanweb.app.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupportTicketService {
    @Autowired
    private SupportTicketRepository repo;

    public List<SupportTicket> getAll() { return repo.findAll(); }
    public SupportTicket getById(Long id) { return repo.findById(id).orElse(null); }
    public SupportTicket create(SupportTicket ticket) { return repo.save(ticket); }
    public SupportTicket update(Long id, SupportTicket ticket) {
        ticket.setId(id);
        return repo.save(ticket);
    }
    public void delete(Long id) { repo.deleteById(id); }
}