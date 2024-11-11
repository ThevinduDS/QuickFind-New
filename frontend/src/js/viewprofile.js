document.addEventListener("DOMContentLoaded", async () => {
    try {
        const serviceId = getProviderIdFromUrl(); // Replace with dynamic ID if needed

        // Function to fetch profile information
        async function loadProfile() {
            const response = await fetch(`http://localhost:3000/api/viewprofile/${serviceId}`);
            if (!response.ok) throw new Error("Failed to fetch profile data");
        
            const data = await response.json();
        
            const { service, reviews } = data;
            const { title, location, description, workingHours, category, rating, availableDays } = service;
            const ratingScore = rating ? `${rating.ratingScore} / 5` : 'No rating';
            const categoryName = category ? category.name : 'Category unavailable';
        
            document.getElementById('profile-name').textContent = title || 'Service Name';
            document.getElementById('profile-location').textContent = location || 'Location unavailable';
            document.getElementById('profile-rating').textContent = ratingScore;
            document.getElementById('description').textContent = description || 'No description available';
            document.getElementById('contact-phone').textContent = service.phone || 'Phone not available';
            document.getElementById('contact-email').textContent = service.email || 'Email not available';
            document.getElementById('contact-hours').textContent = workingHours ? `${workingHours.start} - ${workingHours.end}` : 'Hours not available';
        
            updateServices(categoryName);
            displayReviews(reviews); // Display initial reviews
        }
        

        // Function to update Services Offered section
        function updateServices(category) {
            const servicesContainer = document.getElementById('services-offered');
            servicesContainer.innerHTML = ''; // Clear existing services

            // Create a new list item for the category
            const li = document.createElement('li');
            li.classList.add('flex', 'items-center', 'text-text-secondary');
            li.innerHTML = `<span class="material-icons text-primary mr-2">check_circle</span>${category}`;
            servicesContainer.appendChild(li);
        }

        // Function to load and display reviews
        let offset = 5;

        async function loadReviews() {
            try {
                const response = await fetch(`http://localhost:3000/api/viewProfile/${serviceId}/moreReviews?offset=${offset}`);
                if (!response.ok) throw new Error("Failed to fetch reviews");
        
                const newReviews = await response.json();
        
                // Avoid duplicate reviews by appending only if new reviews are present
                if (newReviews.length > 0) {
                    displayReviews(newReviews);
                    offset += newReviews.length; // Update offset for the next batch
                }
            } catch (error) {
                console.error("Error loading more reviews:", error);
            }
        }
        
        // Function to display reviews
        function displayReviews(reviews) {
            const reviewsList = document.getElementById('reviews-list');
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('border-b', 'pb-4', 'mb-4', 'text-text-secondary');
        
                // Generate star icons based on the rating score
                const ratingScore = review.ratingScore || 0;
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= ratingScore) {
                        starsHTML += `<i class="fas fa-star text-yellow-500"></i>`; // Filled star
                    } else {
                        starsHTML += `<i class="fas fa-star text-gray-300"></i>`; // Empty star
                    }
                }
        
                // Construct the review content with stars
                reviewDiv.innerHTML = `
                <p><strong>${review.userName || 'Anonymous'} </strong> ${starsHTML} </p>
                    <p> ${review.comment || 'No comment provided'}</p>
                    
                `;
        
                reviewsList.appendChild(reviewDiv);
            });
        }
        

        // Load initial profile data and reviews
        await loadProfile();
        // await loadReviews();

        // Handle "View More" button click
        document.querySelector("#view-more-button").addEventListener("click", loadReviews);

    } catch (error) {
        console.error("Error loading profile data:", error);
    }
});


function getProviderIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedId = urlParams.get('serviceId');
    return decodeURIComponent(encodedId); // Decode the provider_id parameter from URL
}

function getUserId() {

    var userData = localStorage.getItem('user');
    var userDeatails = JSON.parse(userData);
    let userId = userDeatails.id;
    return userId;
}

function addReview() {
    const pid = getProviderIdFromUrl();
    // const uid = getUserId();

    if (pid) {
        // Encode pid and uid, then construct the URL for review.html
        const encodedPid = encodeURIComponent(pid);
        // const encodedUid = encodeURIComponent(uid);
        window.location.href = `./addReview.html?providerId=${encodedPid}`;
    } else {
        console.error("Provider ID is missing");
    }
}