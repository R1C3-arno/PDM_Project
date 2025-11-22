package com.loanweb.app.controller;

import com.loanweb.app.entity.AnalyticsEvent;
import com.loanweb.app.service.AnalyticsEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsEventController {
    @Autowired
    private AnalyticsEventService service;

    @GetMapping
    public List<AnalyticsEvent> getAll() { return service.getAll(); }

    @PostMapping
    public AnalyticsEvent create(@RequestBody AnalyticsEvent event) { return service.create(event); }
}