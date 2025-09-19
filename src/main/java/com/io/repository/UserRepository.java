package com.io.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.io.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByPhone(String phone);
    User findByPhoneAndPassword(String phone, String password);
}
