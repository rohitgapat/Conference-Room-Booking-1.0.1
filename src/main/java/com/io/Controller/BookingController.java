package com.io.Controller;

import com.io.model.BookingDTO;
import com.io.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingRequest) {
        BookingDTO booking = bookingService.createBooking(
                bookingRequest.getUserId(),
                bookingRequest.getRoomId(),
                bookingRequest.getStartTime(),
                bookingRequest.getEndTime()
        );
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id) {
        BookingDTO booking = bookingService.cancelBooking(id);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/rooms/{roomId}/active-bookings")
    public ResponseEntity<?> getUpcomingActiveBookings(@PathVariable Long roomId) {
        List<Map<String, Object>> upcomingBookings =
                bookingService.getUpcomingActiveBookingsByRoomId(roomId);

        return ResponseEntity.ok(
            Map.of("roomId", roomId, "activeBookings", upcomingBookings)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingDTO>> getAll() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
}
