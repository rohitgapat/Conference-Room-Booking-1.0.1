package com.io.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.io.Entity.Admin;
import com.io.service.AdminServiceImp;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminServiceImp adminServiceImp;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestParam String mobileNumber,
                                        @RequestParam String password) {
        try {
            Admin admin = adminServiceImp.loginAdmin(mobileNumber, password);
            return ResponseEntity.ok(admin); //return valid admin as JSON
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}