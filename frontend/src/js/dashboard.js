// frontend/src/js/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    // Load initial dashboard data
    loadDashboardData();
    // Set up navigation
    setupNavigation();
    // Set up event listeners
    setupEventListeners();
});

// User Data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('providerName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('providerRole').textContent = user.role;
    }
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    const sectionTitle = document.getElementById('sectionTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            // Update active section
            sections.forEach(section => section.classList.add('hidden'));
            document.getElementById(sectionId).classList.remove('hidden');
            
            // Update section title
            sectionTitle.textContent = link.querySelector('span').textContent;
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('bg-primary-light'));
            link.classList.add('bg-primary-light');
        });
    });
}

// Dashboard Data
async function loadDashboardData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/provider/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data);
            loadRecentActivity();
            loadServices();
            loadBookings();
            loadReviews();
            loadEarnings();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Service Management
function showAddServiceModal() {
    document.getElementById('addServiceModal').classList.remove('hidden');
}

function hideAddServiceModal() {
    document.getElementById('addServiceModal').classList.add('hidden');
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Get form data
    const serviceData = {
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        category: document.getElementById('serviceCategory').value,
        price: document.getElementById('servicePrice').value,
        priceType: document.getElementById('servicePriceType').value,
        serviceArea: document.getElementById('serviceArea').value,
        workingHours: {
            start: document.getElementById('workingHoursStart').value,
            end: document.getElementById('workingHoursEnd').value
        },
        availableDays: Array.from(document.querySelectorAll('input[name="availableDays"]:checked'))
            .map(cb => cb.value)
    };

    // Append service data
    formData.append('data', JSON.stringify(serviceData));

    // Append images
    const imageFiles = document.getElementById('serviceImages').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }

    try {
        const response = await fetch('http://localhost:3000/api/provider/services', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            // alert('Service added successfully!');
            Swal.fire({
                title: "Service added successfully!",
                // text: "That thing is still around?",
                icon: "success"
              });
            hideAddServiceModal();
            loadServices();
        } else {
            const error = await response.json();
            // alert(error.message || 'Error adding service');
            Swal.fire({
                title: "Error adding service",
                text: error.message,
                icon: "warning"
              });
        }
    } catch (error) {
        console.error('Error adding service:', error);
        // alert('Error adding service. Please try again.');
        Swal.fire({
            title: "Error adding service. Please try again.",
            // text: "That thing is still around?",
            icon: "question"
          });
    }
}

// Event Listeners
function setupEventListeners() {
    // Add Service Form
    document.getElementById('addServiceForm').addEventListener('submit', handleServiceSubmit);
    
    // Profile Form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    
    // Logout
    document.querySelector('button[onclick="logout()"]').addEventListener('click', handleLogout);
}

// Utility Functions
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    } else {
        loadDashboardData();
    }
});