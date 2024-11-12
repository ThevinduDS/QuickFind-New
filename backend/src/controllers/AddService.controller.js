const Service = require('../models/service.model');
const ServiceImage = require('../models/ServiceImage.model');

exports.createService = async (req, res) => {
    try {
        // Parse the `data` field if it's a nested JSON string in `req.body`
        let serviceData = req.body;

        console.log('Received request:', req.body);
        
        // If `data` is a nested JSON string in `req.body`, parse it
        if (typeof req.body.data === 'string') {
            try {
                serviceData = JSON.parse(req.body.data);
            } catch (parseError) {
                console.error('Error parsing service data:', parseError);
                return res.status(400).json({ message: 'Invalid service data format' });
            }
        }

        // Destructure fields from parsed `serviceData`
        const { title, description, price, priceType, serviceArea, workingHours, availableDays, contactNumber, contactEmail, providerId, categoryId, location } = serviceData;

        // Validate required fields
        if (!title || !description || !price || !priceType || !serviceArea || !workingHours || !availableDays || !contactNumber || !contactEmail || !providerId || !categoryId || !location) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Create the service
        let service;
        try {
            service = await Service.create({
                title,
                description,
                price,
                priceType,
                serviceArea,
                workingHours,
                availableDays,
                contactNumber,
                contactEmail,
                providerId,
                location,
                categoryId
            });
        } catch (dbError) {
            console.error('Database error creating service:', dbError);
            return res.status(500).json({ message: 'Error saving service to database' });
        }

        // Save each image path to ServiceImage model if there are any
        const imageFiles = req.files;
        if (imageFiles && imageFiles.length > 0) {
            try {
                await Promise.all(imageFiles.map(async (file) => {
                    await ServiceImage.create({
                        serviceId: service.id,
                        imageUrl: file.path
                    });
                }));
            } catch (imageError) {
                console.error('Error saving service images:', imageError);
                return res.status(500).json({ message: 'Error saving service images' });
            }
        }

        // Log before sending the response to ensure the point is reached
        console.log('Service and images saved successfully');

        // Success response
        return res.status(201).json({ message: 'Service created successfully', service });
        
    } catch (error) {
        console.error('Unexpected error creating service:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};
