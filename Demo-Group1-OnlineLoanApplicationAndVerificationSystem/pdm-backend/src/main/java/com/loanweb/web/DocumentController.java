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
 * REST controller for document management operations.
 * Handles document upload, retrieval, and verification.
 */
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class DocumentController {

    private final AuthorizationService authorizationService;

    // Mock storage for documents
    private static final List<Map<String, Object>> mockDocuments = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicLong nextId = new AtomicLong(1);

    static {
        // Initialize with some mock documents
        mockDocuments.add(createDocument(nextId.getAndIncrement(), 1L, "ID_PROOF", "passport.pdf", "PENDING"));
        mockDocuments.add(createDocument(nextId.getAndIncrement(), 1L, "INCOME_PROOF", "salary_slip.pdf", "VERIFIED"));
    }

    private static Map<String, Object> createDocument(Long id, Long applicationId, String type, String fileName, String status) {
        Map<String, Object> doc = new HashMap<>();
        doc.put("id", id);
        doc.put("applicationId", applicationId);
        doc.put("documentType", type);
        doc.put("fileName", fileName);
        doc.put("fileUrl", "/uploads/" + fileName);
        doc.put("fileSize", 150000L);
        doc.put("status", status);
        doc.put("uploadedAt", LocalDateTime.now().minusDays(id).toString());
        doc.put("verifiedAt", status.equals("VERIFIED") ? LocalDateTime.now().toString() : null);
        doc.put("verifiedBy", status.equals("VERIFIED") ? "Staff User" : null);
        return doc;
    }

    /**
     * Get all documents for an application
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getDocumentsByApplication(@PathVariable Long applicationId) {
        log.info("Fetching documents for application: {}", applicationId);

        List<Map<String, Object>> docs = mockDocuments.stream()
                .filter(d -> d.get("applicationId").equals(applicationId))
                .toList();

        return ResponseEntity.ok(docs);
    }

    /**
     * Get document by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        log.info("Fetching document with ID: {}", id);

        Optional<Map<String, Object>> doc = mockDocuments.stream()
                .filter(d -> d.get("id").equals(id))
                .findFirst();

        if (doc.isPresent()) {
            return ResponseEntity.ok(doc.get());
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Upload a new document
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadDocument(@RequestBody Map<String, Object> request) {
        log.info("Uploading new document");

        try {
            Map<String, Object> newDoc = new HashMap<>();
            newDoc.put("id", nextId.getAndIncrement());
            newDoc.put("applicationId", Long.valueOf(request.get("applicationId").toString()));
            newDoc.put("documentType", request.get("documentType"));
            newDoc.put("fileName", request.get("fileName"));
            newDoc.put("fileUrl", request.getOrDefault("fileUrl", "/uploads/" + request.get("fileName")));
            newDoc.put("fileSize", request.getOrDefault("fileSize", 100000L));
            newDoc.put("status", "PENDING");
            newDoc.put("uploadedAt", LocalDateTime.now().toString());
            newDoc.put("verifiedAt", null);
            newDoc.put("verifiedBy", null);

            mockDocuments.add(newDoc);
            log.info("Document uploaded with ID: {}", newDoc.get("id"));

            return ResponseEntity.status(HttpStatus.CREATED).body(newDoc);
        } catch (Exception e) {
            log.error("Failed to upload document: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to upload document"));
        }
    }

    /**
     * Update document status (staff only)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('VERIFIER', 'BANKER', 'UNDERWRITER', 'ADMIN')")
    public ResponseEntity<?> updateDocumentStatus(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User currentUser = authorizationService.getCurrentUser();
        log.info("User {} updating document {} status", currentUser.getId(), id);

        Optional<Map<String, Object>> docOpt = mockDocuments.stream()
                .filter(d -> d.get("id").equals(id))
                .findFirst();

        if (docOpt.isPresent()) {
            Map<String, Object> doc = docOpt.get();
            String newStatus = (String) request.get("status");
            doc.put("status", newStatus);

            if ("VERIFIED".equals(newStatus)) {
                doc.put("verifiedAt", LocalDateTime.now().toString());
                doc.put("verifiedBy", currentUser.getFullName());
            }

            return ResponseEntity.ok(doc);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Delete a document
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        log.info("Deleting document with ID: {}", id);

        boolean removed = mockDocuments.removeIf(d -> d.get("id").equals(id));

        if (removed) {
            return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
