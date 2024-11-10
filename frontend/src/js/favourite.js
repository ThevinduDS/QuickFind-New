const userId = '123e4567-e89b-12d3-a456-426614174000';

document.addEventListener('DOMContentLoaded', fetchFavourite);

async function fetchFavourite() {
    try {
        const response = await fetch(`http://localhost:3000/api/favourite/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const favourite = await response.json();
        console.log('Fetched favourites:', favourite);
        renderFavourite(favourite);
    } catch (error) {
        console.error('Failed to fetch favourite:', error);
        alert('No Items Found');
    }
}

function renderFavourite(favourite) {
    const container = document.getElementById('favoritesContainer');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    container.innerHTML = '';

    if (!favourite || favourite.length === 0) {
        noFavoritesMessage.classList.remove('hidden');
        return;
    } else {
        noFavoritesMessage.classList.add('hidden');
    }
    favourite.forEach(fav => {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition', 'duration-300');
    
        // Assuming `fav` contains the service and its rating details
        const rating = fav.Service.Rating || { ratingScore: 0, reviewCount: 0 }; // Fallback in case there are no ratings
        const category = fav.Service.Category.name || 'No category available'; // Fallback for category
    
        // Create a string for the star rating
        const stars = '★'.repeat(Math.round(rating.ratingScore)) + '☆'.repeat(5 - Math.round(rating.ratingScore));
    
        card.innerHTML = `
            <h3 class="font-bold text-primary text-xl mb-2">${fav.Service.title}</h3>
            <p class="text-text-secondary mb-2"><i class="fas fa-toolbox mr-2"></i> ${category}</p>
            <div class="text-yellow-400 mb-4">${stars} <span class="text-text-secondary">(${rating.reviewCount} reviews)</span></div>
            <div class="flex justify-between">
                <button class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition duration-300" onclick="window.location.href='booking.html?userId=${fav.userId}&serviceId=${fav.serviceId}'">Book Now</button>
                <button class="text-primary hover:text-primary-light transition duration-300"><i class="fas fa-heart" onclick="removeFavourite('${fav.id}')"></i></button>
            </div>
        `;
    
        container.appendChild(card);
    });
    
    
}

// async function addFavourite(id) {
//     try {
//         const response = await fetch('http://localhost:3000/api/favourite/add', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ id , userId , serviceId })
//         });
//         if (!response.ok) throw new Error((await response.json()).message || 'Failed to add favourite');
//         const newFavourite = await response.json();
//         console.log('Added favourite:', newFavourite);
//         fetchFavourite();
//     } catch (error) {
//         console.error('Failed to add favourite:', error);
//     }
// }

async function removeFavourite(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/favourite/remove/${id}`, {  // Correct the URL by directly inserting the id
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })  // Send only userId in the body
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        console.log('Removed favourite:', result);
        alert("Successfully removed from Favourite!");
        
        fetchFavourite();  // Refresh the favourites list
    } catch (error) {
        console.error('Failed to remove favourite:', error);
        alert('Failed to remove favorite. Please try again later.');
    }
}

 