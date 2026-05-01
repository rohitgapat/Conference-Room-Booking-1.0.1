// Get logged in user info
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');

if (!userId) {
    window.location.href = '/login';
}

document.getElementById('userName').innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;

// Set minimum date to today
document.getElementById('bookingDate').min = new Date().toISOString().split('T')[0];

// Show notification
function showNotification(message, title = 'Notification') {
    const toast = new bootstrap.Toast(document.getElementById('notificationToast'));
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    toast.show();
}

// Load all rooms for dropdown
async function loadRooms() {
    try {
        const response = await fetch('/rooms/all');
        const rooms = await response.json();
        
        const roomSelect = document.getElementById('roomId');
        if (roomSelect) {
            roomSelect.innerHTML = '<option value="">Choose a room...</option>';
            rooms.forEach(room => {
                roomSelect.innerHTML += `<option value="${room.roomId}">${room.name} (Capacity: ${room.capacity} people, Location: ${room.location})</option>`;
            });
        }
        
        // Display rooms in grid
        const roomsContainer = document.getElementById('roomsList');
        if (roomsContainer) {
            roomsContainer.innerHTML = '';
            rooms.forEach(room => {
                roomsContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="card booking-card">
                            <div class="card-body">
                                <h5><i class="fas fa-door-open text-primary"></i> ${room.name}</h5>
                                <p><strong>Capacity:</strong> ${room.capacity} people<br>
                                   <strong>Location:</strong> ${room.location || 'Main Building'}</p>
                                <button class="btn btn-primary btn-sm w-100" onclick="quickBookRoom(${room.roomId})">
                                    <i class="fas fa-calendar-plus"></i> Book This Room
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
        showNotification('Error loading rooms', 'Error');
    }
}

// Quick book a room
function quickBookRoom(roomId) {
    showNewBooking();
    document.getElementById('roomId').value = roomId;
}

// Load user's all bookings
async function loadUserBookings() {
    try {
        const response = await fetch(`/bookings/user/${userId}`);
        const bookings = await response.json();
        
        // Update stats
        const total = bookings.length;
        const active = bookings.filter(b => b.status === 'ACTIVE').length;
        const completed = bookings.filter(b => b.status === 'COMPLETED').length;
        
        document.getElementById('totalBookings').innerText = total;
        document.getElementById('activeBookings').innerText = active;
        document.getElementById('completedBookings').innerText = completed;
        
        // Store all bookings for filtering
        window.allBookings = bookings;
        
        // Display all bookings in main table
        displayBookings(bookings, 'allBookingsList');
        
        // Display recent active bookings in dashboard
        const recentActive = bookings.filter(b => b.status === 'ACTIVE').slice(0, 5);
        displayRecentActiveBookings(recentActive);
        
        // Display active bookings in active section
        const activeBookings = bookings.filter(b => b.status === 'ACTIVE');
        displayBookings(activeBookings, 'activeBookingsList');
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNotification('Error loading your bookings', 'Error');
    }
}

// Display bookings in table
function displayBookings(bookings, tableId) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No bookings found</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const startDate = new Date(booking.startTime);
        const endDate = new Date(booking.endTime);
        const statusClass = booking.status === 'ACTIVE' ? 'ACTIVE' : 
                           booking.status === 'CANCELLED' ? 'CANCELLED' : 'COMPLETED';
        
        const isActive = booking.status === 'ACTIVE';
        const canCancel = isActive && new Date(booking.startTime) > new Date();
        
        tbody.innerHTML += `
            <tr>
                <td>${booking.id}</td>
                <td>Room ${booking.roomId}</td>
                <td>${startDate.toLocaleDateString()}</td>
                <td>${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td>${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td><span class="status-badge status-${statusClass}">${booking.status}</span></td>
                <td>
                    ${canCancel ? 
                        `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">
                            <i class="fas fa-times"></i> Cancel
                        </button>` : 
                        booking.status === 'ACTIVE' ? '<span class="text-muted">Expired</span>' : '-'
                    }
                </td>
            </tr>
        `;
    });
}

// Display recent active bookings on dashboard
function displayRecentActiveBookings(bookings) {
    const tbody = document.getElementById('recentActiveBookings');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No active bookings</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const startDate = new Date(booking.startTime);
        const endDate = new Date(booking.endTime);
        
        tbody.innerHTML += `
            <tr>
                <td>Room ${booking.roomId}</td>
                <td>${startDate.toLocaleDateString()}</td>
                <td>${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td>${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td><span class="status-badge status-ACTIVE">ACTIVE</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </td>
            </tr>
        `;
    });
}

// Filter bookings
function filterBookings(status) {
    if (status === 'all') {
        displayBookings(window.allBookings, 'allBookingsList');
    } else {
        const filtered = window.allBookings.filter(b => b.status === status);
        displayBookings(filtered, 'allBookingsList');
    }
}

// Create new booking
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const roomId = parseInt(document.getElementById('roomId').value);
    const bookingDate = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!roomId || !bookingDate || !startTime || !endTime) {
        showNotification('Please fill all required fields', 'Validation Error');
        return;
    }
    
    const startDateTime = `${bookingDate}T${startTime}:00`;
    const endDateTime = `${bookingDate}T${endTime}:00`;
    
    // Validate time
    if (startDateTime >= endDateTime) {
        showNotification('End time must be after start time', 'Validation Error');
        return;
    }
    
    const bookingData = {
        userId: parseInt(userId),
        roomId: roomId,
        startTime: startDateTime,
        endTime: endDateTime
    };
    
    try {
        const response = await fetch('/bookings/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const booking = await response.json();
            showNotification('Booking created successfully!', 'Success');
            document.getElementById('bookingForm').reset();
            showActiveBookings();
            loadUserBookings();
        } else {
            const error = await response.text();
            showNotification(error || 'Booking failed - room might be already booked', 'Error');
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        showNotification('Error creating booking', 'Error');
    }
});

// Cancel booking
let bookingToCancel = null;

function cancelBooking(id) {
    bookingToCancel = id;
    new bootstrap.Modal(document.getElementById('cancelModal')).show();
}

async function confirmCancel() {
    if (bookingToCancel) {
        try {
            const response = await fetch(`/bookings/cancel/${bookingToCancel}`, {
                method: 'PUT'
            });
            
            if (response.ok) {
                showNotification('Booking cancelled successfully', 'Success');
                loadUserBookings();
                showActiveBookings();
            } else {
                showNotification('Failed to cancel booking', 'Error');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showNotification('Error cancelling booking', 'Error');
        }
        bookingToCancel = null;
    }
}

// Navigation functions
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboardSection').style.display = 'block';
    loadUserBookings();
    loadRooms();
}

function showActiveBookings() {
    hideAllSections();
    document.getElementById('activeBookingsSection').style.display = 'block';
    loadUserBookings();
}

function showCompletedBookings() {
    hideAllSections();
    document.getElementById('allBookingsSection').style.display = 'block';
    filterBookings('COMPLETED');
}

function showNewBooking() {
    hideAllSections();
    document.getElementById('newBookingSection').style.display = 'block';
    loadRooms();
}

function showAllBookings() {
    hideAllSections();
    document.getElementById('allBookingsSection').style.display = 'block';
    filterBookings('all');
}

function showAvailableRooms() {
    hideAllSections();
    document.getElementById('roomsSection').style.display = 'block';
    loadRooms();
}

function hideAllSections() {
    const sections = ['dashboardSection', 'activeBookingsSection', 'newBookingSection', 'allBookingsSection', 'roomsSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) element.style.display = 'none';
    });
    
    // Update active nav link
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '/login';
    }
}

// Initialize dashboard
showDashboard();