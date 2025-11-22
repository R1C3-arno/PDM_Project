package com.loanweb.app.service;

import com.loanweb.app.entity.User;
import com.loanweb.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    public List<User> getAll() { return repo.findAll(); }
    public User getById(Long id) { return repo.findById(id).orElse(null); }
    public User create(User user) { return repo.save(user); }
    public User update(Long id, User user) {
        user.setId(id);
        return repo.save(user);
    }
    public void delete(Long id) { repo.deleteById(id); }
}