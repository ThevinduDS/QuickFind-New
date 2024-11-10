document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('#ratingStars i');
    const ratingDisplay = document.getElementById('ratingValue');
    const reviewForm = document.getElementById('reviewForm');
    let selectedRating = 0;

    // Handle star rating click events
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-value');

            // Update the visual appearance of the stars
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.remove('text-gray-300');
                    s.classList.add('text-yellow-500'); // Change to filled color
                } else {
                    s.classList.remove('text-yellow-500');
                    s.classList.add('text-gray-300'); // Change to unfilled color
                }
            });

            // Display the current rating value
            ratingDisplay.textContent = selectedRating;
        });
    });

    // Handle form submission
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const serviceProvider = document.getElementById('serviceProvider').value;
        const reviewText = document.getElementById('reviewText').value;

        var userData = localStorage.getItem('user');
        var userDeatails = JSON.parse(userData);
        let userId = userDeatails.id; // user id

        if (selectedRating > 5){
            alert("Rating must be between 1 and 5");
            return;
        }

        // Validation: Ensure all required fields are filled
        if (!serviceProvider || selectedRating === 0 || !reviewText) {
            alert('Please fill in all fields, including the rating.');
            return;
        }

        // Form data to send to the server
        const reviewData = {
            serviceProvider,
            rating: selectedRating,
            reviewText,
            userId
        };

        try {
            // Send POST request to the server
            const response = await fetch('http://localhost:3000/api/review/addreview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            const result = await response.json();
            console.log('Review submitted successfully:', result);

            // Optionally, clear the form after submission
            reviewForm.reset();
            selectedRating = 0;
            ratingDisplay.textContent = '0';
            stars.forEach(star => star.classList.remove('text-yellow-500'));
            stars.forEach(star => star.classList.add('text-gray-300'));

            alert('Thank you for your review!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        }
    });
});


   




