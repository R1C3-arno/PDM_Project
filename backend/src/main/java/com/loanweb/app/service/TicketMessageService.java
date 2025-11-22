package com.loanweb.app.service;

import com.loanweb.app.entity.TicketMessage;
import com.loanweb.app.repository.TicketMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketMessageService {
    @Autowired
    private TicketMessageRepository repo;

    public List<TicketMessage> getAll() { return repo.findAll(); }
    public TicketMessage getById(Long id) { return repo.findById(id).orElse(null); }
    public TicketMessage create(TicketMessage message) { return repo.save(message); }
    public void delete(Long id) { repo.deleteById(id); }
}