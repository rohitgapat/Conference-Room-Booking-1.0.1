package com.io.repository;

import com.io.Entity.Booking;
import com.io.Entity.ConferenceRoom;
import com.io.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	@Query("""
		       SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
		       FROM Booking b
		       WHERE b.room = :room
		         AND b.status = 'ACTIVE'
		         AND b.endTime > CURRENT_TIMESTAMP
		         AND (b.startTime < :end AND b.endTime > :start)
		       """)
		boolean existsActiveConflict(@Param("room") ConferenceRoom room,
		                             @Param("start") LocalDateTime start,
		                             @Param("end") LocalDateTime end);
	@Query("SELECT b FROM Booking b WHERE b.status = 'ACTIVE' AND b.endTime < :now")
    List<Booking> findExpiredBookings(LocalDateTime now);


    List<Booking> findByUser(User user);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByRoom(ConferenceRoom room);
    List<Booking> findByRoom_RoomIdAndStatus(Long roomId, String status);

}
