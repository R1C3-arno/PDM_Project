package com.loanweb.app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
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

        double monthlyPayment = (req.getLoanAmount() * (req.getInterestRate() / 100 / 12) *
                Math.pow(1 + req.getInterestRate() / 100 / 12, req.getLoanTermMonths())) /
                (Math.pow(1 + req.getInterestRate() / 100 / 12, req.getLoanTermMonths()) - 1);

        double remainingBalance = req.getLoanAmount();

        for (int i = 0; i < years; i++) {
            yearLabels.add(2022 + i);

            double yearlyPrincipal = 0;
            double yearlyInterest = 0;

            for (int month = 0; month < 12 && remainingBalance > 0; month++) {
                double interestPayment = remainingBalance * (req.getInterestRate() / 100 / 12);
                double principalPayment = monthlyPayment - interestPayment;

                yearlyPrincipal += principalPayment;
                yearlyInterest += interestPayment;
                remainingBalance -= principalPayment;
            }

            principal.add(yearlyPrincipal);
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