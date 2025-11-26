package com.loanweb.app.controller;

import com.loanweb.app.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/charts")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private StatsService service;

    @GetMapping("/trends")
    public Map<String, Object> getTrends(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "6") int months) {
        return service.getTrends(userId, months);
    }

    @GetMapping("/distribution")
    public Map<String, Object> getDistribution(@RequestParam Long userId) {
        return service.getDistribution(userId);
    }

    @GetMapping("/monthly")
    public Map<String, Object> getMonthly(@RequestParam Long userId) {
        return service.getMonthly(userId);
    }
}