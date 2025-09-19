package com.io.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.io.Entity.User;
import com.io.model.UserDTO;
import com.io.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    // Convert Entity -> DTO
    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getPhone(), null);
    }

    // Convert DTO -> Entity
    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        return user;
    }

    public UserDTO createUser(UserDTO dto) {
        User user = convertToEntity(dto);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public UserDTO getUserByPhone(String phone) {
        User user = userRepository.findByPhone(phone);
        return user != null ? convertToDTO(user) : null;
    }

    public UserDTO loginUser(String phone, String password) {
        User user = userRepository.findByPhone(phone);

        if (user == null) {
            throw new RuntimeException("User not found with phone: " + phone);
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return convertToDTO(user);
    }
}
