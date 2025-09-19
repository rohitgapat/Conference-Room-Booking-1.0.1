package com.io.service;

import com.io.Entity.Booking;
import com.io.Entity.ConferenceRoom;
import com.io.Entity.User;

import com.io.model.BookingDTO;

import com.io.repository.BookingRepository;
import com.io.repository.ConferenceRoomRepository;
import com.io.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingServiceImp implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ConferenceRoomRepository conferenceRoomRepository;

    @Autowired
    private UserRepository userRepository;
    @Scheduled(fixedRate = 60000)
    public void updateExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expired = bookingRepository.findExpiredBookings(now);

        if (!expired.isEmpty()) {
            for (Booking booking : expired) {
                booking.setStatus("COMPLETED"); // change from ACTIVE to COMPLETED
            }
            bookingRepository.saveAll(expired);
            System.out.println("Updated " + expired.size() + " expired bookings to COMPLETED.");
        }
    }

    @Override
    public BookingDTO createBooking(Long userId, Long roomId, LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null || !start.isBefore(end)) {
            throw new RuntimeException("Invalid time range: start must be before end.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ConferenceRoom room = conferenceRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        boolean conflict = bookingRepository.existsActiveConflict(room, start, end);
        if (conflict) {
            throw new RuntimeException("Room is not available for the selected time.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setStatus("ACTIVE");

        Booking saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }
    
    public List<Map<String, Object>> getUpcomingActiveBookingsByRoomId(Long roomId) {
        LocalDateTime now = LocalDateTime.now();

        List<Booking> activeBookings = bookingRepository
            .findByRoom_RoomIdAndStatus(roomId, "ACTIVE");

        return activeBookings.stream()
                .filter(b -> b.getEndTime().isAfter(now)) // only current or future
                .sorted(Comparator.comparing(Booking::getStartTime)) // earliest first
                .map(b -> {
                    Map<String, Object> bookingInfo = new HashMap<>();
                    bookingInfo.put("roomId", b.getRoom().getRoomId());
                    bookingInfo.put("startTime", b.getStartTime());
                    bookingInfo.put("endTime", b.getEndTime());
                    bookingInfo.put("status", b.getStatus());
                    return bookingInfo;
                })
                .collect(Collectors.toList());
    }

    @Override
    public BookingDTO cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            booking.setStatus("CANCELLED");
            booking = bookingRepository.save(booking);
        }

        return convertToDTO(booking);
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // helper method
    private BookingDTO convertToDTO(Booking booking) {
        return new BookingDTO(
                booking.getId(),
                booking.getUser().getId(),
                booking.getRoom().getRoomId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus()
        );
    }
}
