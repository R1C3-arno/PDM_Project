package com.loanweb.app.service;

import com.loanweb.app.entity.AnalyticsEvent;
import com.loanweb.app.repository.AnalyticsEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnalyticsEventService {
    @Autowired
    private AnalyticsEventRepository repo;

    public List<AnalyticsEvent> getAll() { return repo.findAll(); }
    public AnalyticsEvent create(AnalyticsEvent event) { return repo.save(event); }
}