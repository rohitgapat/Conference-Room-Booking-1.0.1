const API_BASE = "http://localhost:8080";

// Show selected page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// ===================== Auth Functions =====================

// Register User
async function registerUser() {
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password })
    });

    if (response.ok) {
        alert("Registration Successful!");
        showPage('loginSection');
    } else {
        alert("Registration Failed!");
    }
}

// Login User
async function loginUser() {
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
    });

    if (response.ok) {
        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        document.getElementById("userName").textContent = user.name;
        showPage('dashboardSection');
    } else {
        alert("Login Failed!");
    }
}

// Logout
// Logout
function logoutUser() {
    clearDashboardMessages();   // ✅ Clear all messages & inputs
    localStorage.removeItem("user");
    showPage('loginSection');
}


// Auto-login check
// Auto-login check
window.onload = () => {
    const user = localStorage.getItem("user");
    if (user) {
        document.getElementById("userName").textContent = JSON.parse(user).name;
        clearDashboardMessages();   // ✅ Clear old messages before showing dashboard
        showPage('dashboardSection');
    } else {
        showPage('loginSection');
    }
};


function clearDashboardMessages() {
    // Clear result display areas
    document.getElementById("roomsList").innerHTML = "";
    document.getElementById("roomDetails").innerHTML = "";
    document.getElementById("bookingResult").innerHTML = "";
    document.getElementById("cancelResult").innerHTML = "";
    document.getElementById("activeBookings").innerHTML = "";

    // Clear error/success messages
    const msgElements = document.querySelectorAll("#dashboardSection p, #dashboardSection div");
    msgElements.forEach(el => {
        if (el.id === "roomsList" || el.id === "roomDetails" ||
            el.id === "bookingResult" || el.id === "cancelResult" ||
            el.id === "activeBookings") {
            // keep as blank (already cleared above)
        }
    });

    // Also clear inputs
    document.getElementById("roomIdInput").value = "";
    document.getElementById("bookingRoomId").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("cancelBookingId").value = "";
    document.getElementById("activeRoomId").value = "";
}

// ===================== Dashboard Functions =====================

// Toggle rooms list
let roomsVisible = false;
async function toggleRooms() {
    const list = document.getElementById("roomsList");
    if (roomsVisible) {
        list.style.display = "none";
        roomsVisible = false;
        return;
    }
    await getAllRooms();
    list.style.display = "block";
    roomsVisible = true;
}

// Get all rooms
async function getAllRooms() {
    const res = await fetch(`${API_BASE}/rooms/all`);
    const list = document.getElementById("roomsList");
    if (res.ok) {
        const rooms = await res.json();
        list.innerHTML = ""; // Clear old list
        if (rooms.length === 0) {
            list.innerHTML = "<p>No rooms available!</p>";
        } else {
            list.innerHTML = rooms.map(r => `<p>ID: ${r.id || r.roomId}, Name: ${r.name}, Capacity: ${r.capacity}</p>`).join("");
        }
    } else {
        list.innerHTML = "Failed to fetch rooms!";
    }
}

// Get room by ID
async function getRoomById() {
    const id = document.getElementById("roomIdInput").value;
    const res = await fetch(`${API_BASE}/rooms/${id}`);
    if (res.ok) {
        const room = await res.json();
        document.getElementById("roomDetails").innerHTML =
            `<p>ID: ${room.id || room.roomId}, Name: ${room.name}, Capacity: ${room.capacity}</p>`;
    } else {
        document.getElementById("roomDetails").innerHTML = `No room found for ID ${id}`;
    }
}

// Create booking
async function createBooking() {
    const user = JSON.parse(localStorage.getItem("user"));
    const roomId = document.getElementById("bookingRoomId").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const res = await fetch(`${API_BASE}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, roomId, startTime, endTime })
    });

    if (res.ok) {
        const booking = await res.json();
        document.getElementById("bookingResult").innerText =
            `Booking Created! ID: ${booking.id}, Room: ${booking.roomId}`;
    } else {
        document.getElementById("bookingResult").innerText = "Booking Failed!";
    }
}

// Cancel booking
async function cancelBooking() {
    const id = document.getElementById("cancelBookingId").value;
    const res = await fetch(`${API_BASE}/bookings/cancel/${id}`, { method: "PUT" });

    if (res.ok) {
        const booking = await res.json();
        document.getElementById("cancelResult").innerText =
            `Booking Cancelled! ID: ${booking.id}`;
    } else {
        document.getElementById("cancelResult").innerText = "Cancellation Failed!";
    }
}

// Get active bookings
async function getActiveBookings() {
    const roomId = document.getElementById("activeRoomId").value;
    const res = await fetch(`${API_BASE}/bookings/rooms/${roomId}/active-bookings`);
    const list = document.getElementById("activeBookings");
    if (res.ok) {
        const data = await res.json();
        list.innerHTML = "";
        if (!data.activeBookings || data.activeBookings.length === 0) {
            list.innerHTML = "<p>No active bookings!</p>";
        } else {
            list.innerHTML = data.activeBookings.map(b =>
                `<p>Booking ID: ${b.id}, Start: ${b.startTime}, End: ${b.endTime}</p>`
            ).join("");
        }
    } else {
        list.innerText = "Error fetching active bookings!";
    }
}
