document.getElementById("offeringForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("offeringTitle", document.getElementById("offeringTitle").value);
  formData.append("offeringCategory", document.getElementById("offeringCategory").value);
  formData.append("offeringDescription", document.getElementById("offeringDescription").value);
  formData.append("offeringPrice", document.getElementById("offeringPrice").value);
  formData.append("offeringLocation", document.getElementById("offeringLocation").value);
  formData.append("serviceArea", document.getElementById("serviceArea").value);
  formData.append("contactNumber", document.getElementById("contactNumber").value);
  formData.append("contactEmail", document.getElementById("contactEmail").value);

  // Fetch API to send form data to server or handle data as needed
  fetch("/api/post-offering", {
      method: "POST",
      body: formData
  }).then(response => {
      if (response.ok) {
          alert("Offering posted successfully!");
          document.getElementById("offeringForm").reset();
      } else {
          alert("Failed to post offering.");
      }
  });
});
