package com.loanweb.web;

import com.loanweb.domain.user.User;
import com.loanweb.service.AuthorizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * REST controller for loan contract management.
 * Handles contract generation, viewing, and signing.
 */
@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class ContractController {

    private final AuthorizationService authorizationService;

    // Mock storage for contracts
    private static final List<Map<String, Object>> mockContracts = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with a mock contract
        mockContracts.add(createContract(nextId.getAndIncrement(), 1L, 1L, "PENDING_SIGNATURE"));
    }

    private static Map<String, Object> createContract(Long id, Long applicationId, Long offerId, String status) {
        Map<String, Object> contract = new HashMap<>();
        contract.put("id", id);
        contract.put("applicationId", applicationId);
        contract.put("offerId", offerId);
        contract.put("contractNumber", "CTR-" + String.format("%06d", id));
        contract.put("status", status);
        contract.put("principalAmount", 5000.0);
        contract.put("interestRate", 12.0);
        contract.put("termMonths", 12);
        contract.put("monthlyPayment", 444.24);
        contract.put("totalPayable", 5330.88);
        contract.put("processingFee", 500.0);
        contract.put("startDate", LocalDateTime.now().plusDays(7).toString());
        contract.put("endDate", LocalDateTime.now().plusDays(7).plusMonths(12).toString());
        contract.put("terms", generateContractTerms());
        contract.put("createdAt", LocalDateTime.now().toString());
        contract.put("signedAt", null);
        contract.put("borrowerSignature", null);
        return contract;
    }

    private static String generateContractTerms() {
        return """
            LOAN AGREEMENT TERMS AND CONDITIONS

            1. LOAN TERMS
            The Borrower agrees to repay the loan amount plus interest according to the repayment schedule.

            2. INTEREST RATE
            Interest is calculated on a reducing balance basis at the agreed annual percentage rate.

            3. REPAYMENT
            Monthly payments are due on the same day each month. Late payments may incur additional fees.

            4. PREPAYMENT
            The Borrower may prepay the loan in full or in part without penalty.

            5. DEFAULT
            Failure to make payments as agreed may result in collection actions and credit reporting.

            6. GOVERNING LAW
            This agreement is governed by the laws of the applicable jurisdiction.
            """;
    }

    /**
     * Get contract by application ID
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getContractByApplication(@PathVariable Long applicationId) {
        log.info("Fetching contract for application: {}", applicationId);

        Optional<Map<String, Object>> contract = mockContracts.stream()
                .filter(c -> c.get("applicationId").equals(applicationId))
                .findFirst();

        if (contract.isPresent()) {
            return ResponseEntity.ok(contract.get());
        }

        // Return empty/not found if no contract exists yet
        return ResponseEntity.notFound().build();
    }

    /**
     * Get contract by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getContractById(@PathVariable Long id) {
        log.info("Fetching contract with ID: {}", id);

        Optional<Map<String, Object>> contract = mockContracts.stream()
                .filter(c -> c.get("id").equals(id))
                .findFirst();

        if (contract.isPresent()) {
            return ResponseEntity.ok(contract.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Generate a new contract (staff only)
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> generateContract(@RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} generating contract", currentUser.getId());

        try {
            Long applicationId = Long.valueOf(request.get("applicationId").toString());
            Long offerId = Long.valueOf(request.get("offerId").toString());

            Map<String, Object> newContract = new HashMap<>();
            Long id = nextId.getAndIncrement();
            newContract.put("id", id);
            newContract.put("applicationId", applicationId);
            newContract.put("offerId", offerId);
            newContract.put("contractNumber", "CTR-" + String.format("%06d", id));
            newContract.put("status", "PENDING_SIGNATURE");
            newContract.put("principalAmount", request.getOrDefault("principalAmount", 5000.0));
            newContract.put("interestRate", request.getOrDefault("interestRate", 12.0));
            newContract.put("termMonths", request.getOrDefault("termMonths", 12));
            newContract.put("monthlyPayment", request.getOrDefault("monthlyPayment", 444.24));
            newContract.put("totalPayable", request.getOrDefault("totalPayable", 5330.88));
            newContract.put("processingFee", request.getOrDefault("processingFee", 500.0));
            newContract.put("startDate", LocalDateTime.now().plusDays(7).toString());
            newContract.put("endDate", LocalDateTime.now().plusDays(7).plusMonths(12).toString());
            newContract.put("terms", generateContractTerms());
            newContract.put("createdAt", LocalDateTime.now().toString());
            newContract.put("createdBy", currentUser.getFullName());

            mockContracts.add(newContract);
            log.info("Contract generated with ID: {}", id);

            return ResponseEntity.status(HttpStatus.CREATED).body(newContract);
        } catch (Exception e) {
            log.error("Failed to generate contract: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to generate contract"));
        }
    }

    /**
     * Sign contract
     */
    @PostMapping("/{id}/sign")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> signContract(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} signing contract {}", currentUser.getId(), id);

        Optional<Map<String, Object>> contractOpt = mockContracts.stream()
                .filter(c -> c.get("id").equals(id))
                .findFirst();

        if (contractOpt.isPresent()) {
            Map<String, Object> contract = contractOpt.get();
            contract.put("status", "SIGNED");
            contract.put("signedAt", LocalDateTime.now().toString());
            contract.put("borrowerSignature", request.getOrDefault("signature", "Digital Signature"));
            contract.put("signedBy", currentUser.getFullName());

            return ResponseEntity.ok(Map.of(
                    "message", "Contract signed successfully",
                    "contract", contract
            ));
        }

        return ResponseEntity.notFound().build();
    }
}
