package com.io.service;

import java.util.List;

import com.io.model.UserDTO;

public interface UserService {

	 UserDTO createUser(UserDTO user);
	 List<UserDTO> getAllUsers();
	 UserDTO getUserById(Long id);
	 UserDTO getUserByPhone(String phone);
	 UserDTO loginUser(String phone, String password);

}
