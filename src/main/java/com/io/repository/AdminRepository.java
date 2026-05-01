package com.io.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.io.Entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByMobileNumber(String mobileNumber);
}
