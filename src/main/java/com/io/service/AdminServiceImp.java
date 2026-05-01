package com.io.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.io.Entity.Admin;
import com.io.repository.AdminRepository;

@Service
public class AdminServiceImp {

    @Autowired
    private AdminRepository adminRepository;

    public Admin loginAdmin(String mobileNumber, String password) {
        Admin admin = adminRepository.findByMobileNumber(mobileNumber);
        if (admin == null) {
            throw new RuntimeException("Admin not found");
        }
        if (!admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return admin;
    }
}
