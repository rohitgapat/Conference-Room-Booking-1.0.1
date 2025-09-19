package com.io.service;

import com.io.Entity.ConferenceRoom;
import com.io.model.ConferenceRoomDTO;
import com.io.repository.ConferenceRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConferenceRoomServiceImp implements ConferenceRoomService {

    @Autowired
    private ConferenceRoomRepository conferenceRoomRepository;

    private ConferenceRoomDTO toDTO(ConferenceRoom room) {
        return new ConferenceRoomDTO(room.getRoomId(), room.getName(), room.getCapacity(), room.getLocation());
    }

    private ConferenceRoom toEntity(ConferenceRoomDTO dto) {
        return ConferenceRoom.builder()
                .roomId(dto.getRoomId())
                .name(dto.getName())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .build();
    }

    @Override
    public ConferenceRoomDTO addRoom(ConferenceRoomDTO dto) {
        ConferenceRoom room = toEntity(dto);
        return toDTO(conferenceRoomRepository.save(room));
    }

    @Override
    public List<ConferenceRoomDTO> getAllRooms() {
        return conferenceRoomRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConferenceRoomDTO getRoomById(Long id) {
        return conferenceRoomRepository.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    public ConferenceRoomDTO getRoomByName(String name) {
        return toDTO(conferenceRoomRepository.findByName(name));
    }
}
