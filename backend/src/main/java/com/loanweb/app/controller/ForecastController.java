package com.loanweb.app.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "*")
public class ForecastController {

    @PostMapping
    public Map<String, Object> calculateForecast(@RequestBody ForecastRequest req) {
        int years = 31;
        List<Integer> yearLabels = new ArrayList<>();
        List<Double> principal = new ArrayList<>();
        List<Double> interest = new ArrayList<>();
        List<Double> rent = new ArrayList<>();

        for (int i = 0; i < years; i++) {
            yearLabels.add(2022 + i);

            double yearlyPayment = req.getLoanAmount() / req.getLoanTermMonths() * 12;
            double yearlyInterest = req.getLoanAmount() * (req.getInterestRate() / 100);

            principal.add(yearlyPayment - yearlyInterest);
            interest.add(yearlyInterest);
            rent.add(1500.0 + (i * 150));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("years", yearLabels);
        result.put("principal", principal);
        result.put("interest", interest);
        result.put("rent", rent);

        return result;
    }
}

class ForecastRequest {
    private Double loanAmount;
    private Double interestRate;
    private Integer loanTermMonths;

    public Double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(Double loanAmount) { this.loanAmount = loanAmount; }
    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }
    public Integer getLoanTermMonths() { return loanTermMonths; }
    public void setLoanTermMonths(Integer loanTermMonths) { this.loanTermMonths = loanTermMonths; }
}