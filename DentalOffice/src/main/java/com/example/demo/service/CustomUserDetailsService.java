package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.DentalOfficeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private DentalOfficeRepo dentalOfficeRepo;

    @Autowired
    public CustomUserDetailsService(DentalOfficeRepo dentalOfficeRepo) {
        this.dentalOfficeRepo = dentalOfficeRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = null;
        try {
            user = dentalOfficeRepo.findByUsername(username);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (user == null) {
            throw new UsernameNotFoundException(String.format("No user found with username '%s'.", username));
        } else {
            return user;
        }
    }

}
