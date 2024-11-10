document.querySelector("#offeringForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  var userData = localStorage.getItem('user');
var userDeatails = JSON.parse(userData);
const userId = userDeatails.id; // user id

  const formData = new FormData(); // Use FormData to handle files and text data

  formData.append("offeringTitle", document.querySelector("#offeringTitle")?.value || "");
  formData.append("offeringCategory", document.querySelector("#offeringCategory")?.value || "");
  formData.append("offeringDescription", document.querySelector("#offeringDescription")?.value || "");
  formData.append("offeringPrice", document.querySelector("#offeringPrice")?.value || "");
  formData.append("offeringLocation", document.querySelector("#offeringLocation")?.value || "");
  formData.append("serviceArea", document.querySelector("#serviceArea")?.value || "");
  formData.append("listingFee", document.querySelector("#listingFee")?.value || "");
  formData.append("availability", JSON.stringify(Array.from(document.querySelectorAll("input[name='availability']:checked")).map(option => option.value)));
  formData.append("providerId", userId)

  // Add each selected image file to the FormData object
  const imageFiles = document.querySelector("#offeringImages").files;
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append("offeringImages", imageFiles[i]);
  }

  try {
    const response = await fetch('http://localhost:3000/api/offering/create', {
      method: 'POST',
      body: formData // Pass FormData directly
    });

    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    
    const result = await response.json(); // Parse the JSON response
    console.log(result); // Log the result for debugging
  } catch (error) {
    console.error('Submission error:', error); // Log any errors
  }
});
