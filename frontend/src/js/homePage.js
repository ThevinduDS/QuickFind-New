// public/js/homePage.js
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:3000/api/homepage/early-providers');
        const providers = await response.json();

        const providersContainer = document.querySelector("#featured-providers .grid");

        providers.forEach(provider => {
            const providerCard = document.createElement("div");
            providerCard.classList.add("bg-white", "p-6", "rounded-lg", "shadow-md", "hover:shadow-lg", "transition", "duration-300");

            providerCard.innerHTML = `
          <div class="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <!-- Image section -->
            <img src="../../../backend/${provider.images}" alt="${provider.title}" class="w-full h-48 lg:h-64 object-cover rounded-t-lg lg:rounded-lg mb-4 lg:mb-0 lg:mr-6">
            
            <!-- Content section -->
            <div class="flex flex-col justify-between flex-1 p-4">
                <div>
                    <h4 class="font-bold text-primary mb-2 text-lg">${provider.title}</h4>
                    <div class="text-yellow-400 mb-2">
                        ${'★'.repeat(Math.floor(provider.rating))}${'☆'.repeat(5 - Math.floor(provider.rating))}
                        <span class="text-gray-500">(${provider.reviews} reviews)</span>
                    </div>
                    <p class="text-gray-600 mb-2">
                        <i class="fas fa-map-marker-alt mr-2"></i>${provider.location}
                    </p>
                    <p class="text-sm text-gray-600 mb-4">${provider.description}</p>
                    <p class="text-primary font-semibold mb-4">Price: ${provider.price} LKR</p>
                </div>
                
                <!-- Buttons section -->
                <div class="flex justify-between items-center mt-4">
                    <a href="#" class="text-primary hover:text-primary-light transition duration-300">View Profile</a>
                    <button class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-300" onclick="addFavourite('${provider.id}')">Add to Favourite</button>
                </div>
            </div>
        </div>
        `;
            providersContainer.appendChild(providerCard);
        });
    } catch (error) {
        console.error("Error fetching early providers:", error);
    }
});
