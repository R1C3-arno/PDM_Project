package com.loanweb.app.controller;

import com.loanweb.app.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private StatisticsService service;

    @GetMapping("/user/{userId}")
    public Map<String, Object> getUserStatistics(@PathVariable Long userId) {
        return service.getUserStatistics(userId);
    }
}