package com.io;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.io*")
@EnableScheduling
public class ConferenceRoomBooking1Application {

	public static void main(String[] args) {
		SpringApplication.run(ConferenceRoomBooking1Application.class, args);
	}
}