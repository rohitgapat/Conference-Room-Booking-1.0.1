package com.io.Controller;

import com.io.model.ConferenceRoomDTO;
import com.io.service.ConferenceRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class ConferenceRoomController {

    @Autowired
    private ConferenceRoomService roomService;

    @PostMapping
    public ConferenceRoomDTO addRoom(@RequestBody ConferenceRoomDTO room) {
        return roomService.addRoom(room);
    }

    @GetMapping("/all")
    public List<ConferenceRoomDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public ConferenceRoomDTO getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }
}
