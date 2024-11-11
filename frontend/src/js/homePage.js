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
            <img src="../backend/${provider.images}" alt="${provider.title}" class="w-full h-48 lg:h-64 object-cover rounded-t-lg lg:rounded-lg mb-4 lg:mb-0 lg:mr-6">
            
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
                    <a href="./viewProfile.html?serviceId=${encodeURIComponent(provider.id)}" class="text-primary hover:text-primary-light transition duration-300">View Profile</a>
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


document.addEventListener('DOMContentLoaded', function () {
    
    const navLinks = document.getElementById('nav-links');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')) || {};

    if (token) {
        // If logged in, show profile link with the profile picture
        const profileLink = document.createElement('a');
        profileLink.href = "/profile";
        profileLink.className = "flex items-center space-x-2 hover:text-primary-light transition duration-300";
        
        const profileImage = document.createElement('img');
        profileImage.src = user.profileImageUrl || "path/to/default-image.jpg";  // Replace with actual image URL or default
        profileImage.alt = "Profile Picture";
        profileImage.className = "w-8 h-8 rounded-full border";

        const profileText = document.createElement('span');
        profileText.textContent = "Profile";
        
        profileLink.appendChild(profileImage);
        profileLink.appendChild(profileText);
        navLinks.appendChild(profileLink);
    } else {
        // If not logged in, show Login and Signup links
        const loginLink = document.createElement('a');
        loginLink.href = "/signin";
        loginLink.className = "hover:text-primary-light transition duration-300";
        loginLink.textContent = "Login";

        const signupLink = document.createElement('a');
        signupLink.href = "/signup";
        signupLink.className = "hover:text-primary-light transition duration-300";
        signupLink.textContent = "Sign Up";

        navLinks.appendChild(loginLink);
        navLinks.appendChild(signupLink);
    }
});
