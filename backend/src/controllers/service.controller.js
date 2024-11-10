// service.controller.js
const Service = require('../models/service.model');

exports.getServicesByCategory = async (req, res) => {
    const categoryId = req.query.category;
    if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
    }
    
    try {
        // Assuming your service model is set up to find services by category ID
        const services = await Service.findAll({
            where: { categoryId: categoryId }
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};
