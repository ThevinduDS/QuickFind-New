var userData = localStorage.getItem('user');
var userDeatails = JSON.parse(userData);
const userId = userDeatails.id; // user id

// Load user data on window load
window.onload = fetchUserProfile;


async function fetchUserProfile() {
    try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`);
        const data = await response.json();

        console.log('API Response:', data);

        if (data.success) {
            const user = data.data;

            // Populate user data into the profile fields
            document.querySelector('.profile-name').textContent = `${user.firstName} ${user.lastName}`;
            document.querySelector('.profile-email').textContent = user.email;
            document.querySelector('.profile-phone').textContent = user.phone;
            document.querySelector('.profile-role').textContent = user.role;
            document.querySelector('.profile-status').textContent = user.status;

            // Display the profile image if available
            const profileImage = document.querySelector('.profile-image');
            console.log('User photoURL:', user);

            if (profileImage) {
                if (user.photoURL) {
                    profileImage.src = user.photoURL;
                    profileImage.alt = `${user.firstName} ${user.lastName}'s Profile Image`;
                } else {
                    profileImage.src = "https://www.w3schools.com/w3images/avatar2.png";
                    profileImage.alt = `${user.firstName} ${user.lastName}'s Profile Image`;
                }
            } else {
                console.warn("Element with class 'profile-image' not found.");
            }
            // profileImage.src = user.photoURL || "https://www.w3schools.com/w3images/avatar2.png";
            // profileImage.alt = `${user.firstName} ${user.lastName}'s Profile Image`;

            // Check if the form element exists before adding the event listener
            // const profileForm = document.querySelector("#profileForm");
            // if (profileForm) {
            //     profileForm.addEventListener("submit", async function (event) {
            //         event.preventDefault(); // Prevent the default form submission

            //         const formData = new FormData(); // Use FormData to handle files and text data

            //         // Add each selected image file to the FormData object
            //         const imageFiles = document.querySelector("#profileImage").files;
            //         for (let i = 0; i < imageFiles.length; i++) {
            //             formData.append("profileForm", imageFiles[i]);
            //         }

            //         try {
            //             const response = await fetch('http://localhost:3000/api/editProfile/create', {
            //                 method: 'POST',
            //                 body: formData // Pass FormData directly
            //             });

            //             if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            //             const result = await response.json(); // Parse the JSON response
            //             console.log(result); // Log the result for debugging

            //             if (result.success) {
            //                 alert("Images uploaded successfully!");
            //             } else {
            //                 alert("Failed to upload images.");
            //             }
            //         } catch (error) {
            //             console.error('Submission error:', error); // Log any errors
            //         }
            //     });
            // } else {
            //     console.warn("Form element with id 'profileForm' not found.");
            // }
        } else {
            console.error('User data could not be retrieved.');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

