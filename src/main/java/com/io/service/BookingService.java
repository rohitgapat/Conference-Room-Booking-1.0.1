package com.io.service;

import com.io.model.BookingDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface BookingService {

    BookingDTO createBooking(Long userId, Long roomId, LocalDateTime start, LocalDateTime end);

    BookingDTO cancelBooking(Long bookingId);

    List<BookingDTO> getAllBookings();

    List<BookingDTO> getBookingsByUser(Long userId);

	List<Map<String, Object>> getUpcomingActiveBookingsByRoomId(Long roomId);
}
