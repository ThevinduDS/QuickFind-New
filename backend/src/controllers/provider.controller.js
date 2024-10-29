// backend/src/controllers/provider.controller.js
const Service = require('../models/service.model');
const { validateService } = require('../validators/service.validator');
const { uploadImage } = require('../utils/imageUpload');

exports.createService = async (req, res) => {
    try {
        const providerId = req.user.id;
        const serviceData = req.body;
        
        // Validate service data
        const { error } = validateService(serviceData);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Handle image uploads if any
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = await Promise.all(req.files.map(file => uploadImage(file)));
        }

        // Create service
        const service = await Service.create({
            ...serviceData,
            providerId,
            images: imageUrls,
            status: 'pending' // All services need admin approval
        });

        res.status(201).json({
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Error creating service' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;
        const updateData = req.body;

        // Validate service data
        const { error } = validateService(updateData);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Find service
        const service = await Service.findOne({
            where: { id, providerId }
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Handle image updates if any
        if (req.files && req.files.length > 0) {
            const newImageUrls = await Promise.all(req.files.map(file => uploadImage(file)));
            updateData.images = [...service.images, ...newImageUrls];
        }

        // Update service
        await service.update(updateData);

        res.json({
            message: 'Service updated successfully',
            service
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error updating service' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await Service.findOne({
            where: { id, providerId }
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await service.destroy();

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Error deleting service' });
    }
};

exports.getServiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.user.id;

        const service = await Service.findOne({
            where: { id, providerId },
            include: [
                {
                    model: Review,
                    attributes: ['rating', 'comment', 'createdAt']
                }
            ]
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error('Error getting service details:', error);
        res.status(500).json({ message: 'Error getting service details' });
    }
};