document.addEventListener("DOMContentLoaded", async () => {
    try {
        const serviceId = getProviderIdFromUrl(); // Replace with dynamic ID if needed

        // Function to fetch profile information
        async function loadProfile() {
            const response = await fetch(`http://localhost:3000/api/viewprofile/${serviceId}`);
            if (!response.ok) throw new Error("Failed to fetch profile data");

            const data = await response.json();
            // alert(JSON.stringify(data, null, 2)); // Show the data for debugging

            // Extract data from the response
            const { service, reviews } = data;
            const { title, location, description, workingHours, Category, Rating, availableDays } = service;
            const ratingScore = Rating ? `${Rating.ratingScore} / 5` : 'No rating';
            const categoryName = Category ? Category.name : 'Category unavailable';

            // Update Profile Header
            document.getElementById('profile-name').textContent = title || 'Service Name';
            document.getElementById('profile-location').textContent = location || 'Location unavailable';
            document.getElementById('profile-rating').textContent = ratingScore;

            // Update About Section
            document.getElementById('description').textContent = description || 'No description available';

            // Update Contact Information
            document.getElementById('contact-phone').textContent = service.phone || 'Phone not available';
            document.getElementById('contact-email').textContent = service.email || 'Email not available';
            document.getElementById('contact-hours').textContent = workingHours
                ? `${workingHours.start} - ${workingHours.end}`
                : 'Hours not available';

 // Update Services Offered with the category name
updateServices(data.service.Category.name || 'Category not available');

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
        let offset = 0;
        async function loadReviews() {
            const response = await fetch(`http://localhost:3000/api/viewProfile/${serviceId}/moreReviews?offset=${offset}`);
            if (!response.ok) throw new Error("Failed to fetch reviews");

            const reviews = await response.json();
            displayReviews(reviews);

            if (reviews.length > 0) offset += reviews.length; // Increase offset for the next batch
        }

        // Function to display reviews
        function displayReviews(reviews) {
            const reviewsList = document.getElementById('reviews-list');

            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('border-b', 'pb-4', 'mb-4', 'text-text-secondary');
                reviewDiv.innerHTML = `
                    <p><strong>${review.userName || 'Anonymous'}:</strong> ${review.comment || 'No comment provided'}</p>
                    <p>Rating: ${review.ratingScore || 'N/A'} / 5</p>
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
