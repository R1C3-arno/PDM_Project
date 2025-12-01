package com.loanweb.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST controller for loan product endpoints.
 * Currently returns mock data - full implementation pending.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    // Mock products data
    private static final List<Map<String, Object>> mockProducts = Arrays.asList(
            createProduct(1, "Personal Loan", 1000.0, 50000.0, 6, 60, 8.5, "General purpose personal loan"),
            createProduct(2, "Home Improvement", 5000.0, 100000.0, 12, 120, 7.5, "Loan for home renovation and improvement"),
            createProduct(3, "Education Loan", 2000.0, 75000.0, 12, 84, 6.5, "Student and education financing"),
            createProduct(4, "Business Loan", 10000.0, 250000.0, 12, 60, 9.0, "Small business financing"),
            createProduct(5, "Auto Loan", 5000.0, 80000.0, 12, 72, 7.0, "Vehicle financing")
    );

    private static Map<String, Object> createProduct(int id, String name, double minAmount, double maxAmount,
                                                      int minTerm, int maxTerm, double interestRate, String description) {
        Map<String, Object> product = new HashMap<>();
        product.put("id", id);
        product.put("name", name);
        product.put("minAmount", minAmount);
        product.put("maxAmount", maxAmount);
        product.put("minTermMonths", minTerm);
        product.put("maxTermMonths", maxTerm);
        product.put("interestRate", interestRate);
        product.put("description", description);
        product.put("isActive", true);
        return product;
    }

    /**
     * Get all products
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        logger.info("Fetching all products");
        return ResponseEntity.ok(mockProducts);
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        logger.info("Fetching product with ID: {}", id);
        Optional<Map<String, Object>> product = mockProducts.stream()
                .filter(p -> p.get("id").equals(id))
                .findFirst();

        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }
        return ResponseEntity.notFound().build();
    }
}
