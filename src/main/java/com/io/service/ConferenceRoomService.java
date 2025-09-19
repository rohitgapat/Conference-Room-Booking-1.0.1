package com.io.service;

import com.io.model.ConferenceRoomDTO;
import java.util.List;

public interface ConferenceRoomService {

    ConferenceRoomDTO addRoom(ConferenceRoomDTO room);

    List<ConferenceRoomDTO> getAllRooms();

    ConferenceRoomDTO getRoomById(Long id);

    ConferenceRoomDTO getRoomByName(String name);
}
