package com.loanweb.app.controller;

import com.loanweb.app.entity.User;
import com.loanweb.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping
    public List<User> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/{id}/profile")
    public User getProfile(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/{id}/stats")
    public Map<String, Object> getStats(@PathVariable Long id) { return service.getUserStats(id); }

    @GetMapping("/user/profile")
    public User getUserProfile(@RequestParam(defaultValue = "1") Long userId) {
        return service.getById(userId);
    }

    @GetMapping("/user/stats")
    public Map<String, Object> getUserStats(@RequestParam(defaultValue = "1") Long userId) {
        return service.getUserStats(userId);
    }

    @PostMapping
    public User create(@RequestBody User user) { return service.create(user); }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) { return service.update(id, user); }

    @PutMapping("/{id}/password")
    public Map<String, Object> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwords) {
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");

        boolean success = service.changePassword(id, oldPassword, newPassword);

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "Password changed successfully" : "Incorrect old password");

        return response;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        service.delete(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Account deleted successfully");

        return response;
    }
}