package com.io.model;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Service
public class ConferenceRoomDTO {

	private Long roomId;
	private String name;
	private int capacity;
	private String location;
}
