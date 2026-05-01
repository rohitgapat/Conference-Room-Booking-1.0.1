// Check if admin is logged in
if (!localStorage.getItem('adminId')) {
    window.location.href = '/login';
}

// Load dashboard statistics
async function loadStats() {
    try {
        const roomsRes = await fetch('/rooms/all');
        const rooms = await roomsRes.json();
        document.getElementById('totalRooms').innerText = rooms.length;
        
        const usersRes = await fetch('/users/all');
        const users = await usersRes.json();
        document.getElementById('totalUsers').innerText = users.length;
        
        const bookingsRes = await fetch('/bookings/all');
        const bookings = await bookingsRes.json();
        document.getElementById('totalBookings').innerText = bookings.length;
        document.getElementById('activeBookings').innerText = bookings.filter(b => b.status === 'ACTIVE').length;
    } catch (error) {
        console.error('Error loading stats:', error);
        showAlert('Error loading statistics', 'danger');
    }
}

// Show all bookings
async function showAllBookings() {
    hideAllSections();
    document.getElementById('allBookingsSection').style.display = 'block';
    
    try {
        const response = await fetch('/bookings/all');
        const bookings = await response.json();
        const tbody = document.getElementById('allBookingsList');
        tbody.innerHTML = '';
        
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found</td></tr>';
            return;
        }
        
        bookings.forEach(booking => {
            const startTime = new Date(booking.startTime);
            const endTime = new Date(booking.endTime);
            const statusClass = booking.status === 'ACTIVE' ? 'success' : 
                               booking.status === 'CANCELLED' ? 'danger' : 'secondary';
            
            tbody.innerHTML += `
                <tr>
                    <td>${booking.id}</td>
                    <td>User ${booking.userId}</td>
                    <td>Room ${booking.roomId}</td>
                    <td>${startTime.toLocaleString()}</td>
                    <td>${endTime.toLocaleString()}</td>
                    <td><span class="badge bg-${statusClass}">${booking.status}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
        showAlert('Error loading bookings', 'danger');
    }
}

// Show all rooms
async function showRooms() {
    hideAllSections();
    document.getElementById('roomsSection').style.display = 'block';
    
    try {
        const response = await fetch('/rooms/all');
        const rooms = await response.json();
        const container = document.getElementById('roomsList');
        container.innerHTML = '';
        
        if (rooms.length === 0) {
            container.innerHTML = '<div class="col-12"><div class="alert alert-info">No rooms available</div></div>';
            return;
        }
        
        rooms.forEach(room => {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-door-open text-primary"></i> ${room.name}
                            </h5>
                            <p class="card-text">
                                <strong>Capacity:</strong> ${room.capacity} people<br>
                                <strong>Location:</strong> ${room.location || 'Main Building'}<br>
                                <strong>Room ID:</strong> ${room.roomId}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        showAlert('Error loading rooms', 'danger');
    }
}

// Show all users
async function showUsers() {
    hideAllSections();
    document.getElementById('usersSection').style.display = 'block';
    
    try {
        const response = await fetch('/users/all');
        const users = await response.json();
        const tbody = document.getElementById('usersList');
        tbody.innerHTML = '';
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No users found</td></tr>';
            return;
        }
        
        users.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td><i class="fas fa-user-circle"></i> ${user.name}</td>
                    <td><i class="fas fa-phone"></i> ${user.phone}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('Error loading users', 'danger');
    }
}

// Show add room form
function showAddRoom() {
    hideAllSections();
    document.getElementById('addRoomSection').style.display = 'block';
}

// Add new room form submission
document.getElementById('addRoomForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const roomData = {
        name: document.getElementById('roomName').value,
        capacity: parseInt(document.getElementById('capacity').value),
        location: document.getElementById('location').value
    };
    
    try {
        const response = await fetch('/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData)
        });
        
        if (response.ok) {
            const newRoom = await response.json();
            showAlert('Room added successfully!', 'success');
            document.getElementById('addRoomForm').reset();
            showRooms(); // Refresh rooms list
        } else {
            const error = await response.text();
            showAlert('Error adding room: ' + error, 'danger');
        }
    } catch (error) {
        console.error('Error adding room:', error);
        showAlert('Error adding room', 'danger');
    }
});

// Show dashboard
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboardSection').style.display = 'block';
    loadStats();
}

// Helper function to hide all sections
function hideAllSections() {
    const sections = ['dashboardSection', 'allBookingsSection', 'roomsSection', 'usersSection', 'addRoomSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Show alert messages
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = '/login';
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    showDashboard();
});