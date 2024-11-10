const User = require('../models/user.model');
const Category = require('../models/category.model');
const Service = require('../models/service.model');
const Sequelize = require('sequelize');

const createOffering = async (req, res) => {
  try {
      const {
          offeringTitle,
          offeringCategory,
          offeringDescription,
          offeringPrice,
          offeringLocation,
          serviceArea,
          availability,
          listingFee
      } = req.body;

      const providerId = "5c8119f4-459e-4fea-ab3c-72ece7ad8984"; // Static provider ID for testing (UUID)

      // Ensure offeringCategory is an integer
      if (isNaN(offeringCategory)) {
          return res.status(400).json({ error: 'Invalid category ID format. It should be an integer.' });
      }

      // Check if provider exists by providerId
      const provider = await User.findByPk(providerId);
      if (!provider) {
          return res.status(404).json({ error: 'Provider not found.' });
      }

      // Check if category exists and fetch its details by offeringCategory (integer)
      const category = await Category.findByPk(parseInt(offeringCategory));
      if (!category) {
          return res.status(404).json({ error: 'Category not found.' });
      }

      // Process uploaded files, if available
      const uploadedImages = req.files ? req.files.map(file => file.path) : [];

      // Parse availability array from JSON string (if it's stringified in the request)
      let parsedAvailability;
      try {
          parsedAvailability = typeof availability === "string" ? JSON.parse(availability) : availability;
      } catch (error) {
          return res.status(400).json({ error: 'Invalid availability format.' });
      }

      // Create new service with correct categoryId and providerId
      const newService = await Service.create({
          title: offeringTitle,
          description: offeringDescription,
          categoryId: parseInt(offeringCategory), // Correctly assign the category ID
          price: parseFloat(offeringPrice),
          location: offeringLocation,
          serviceArea: parseInt(serviceArea),
          providerId, // Correctly assign the provider ID
          images: uploadedImages, // Save paths of uploaded images
          availability: parsedAvailability
      });

      // Include the category name in the response
      res.status(201).json({
          ...newService.toJSON(),
          categoryName: category.name
      });
  } catch (error) {
      console.error('Error creating offering:', error);
      res.status(500).json({ error: 'An error occurred while creating the offering.' });
  }
};

module.exports = {
  createOffering
};
