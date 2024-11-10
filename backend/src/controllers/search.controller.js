// controllers/control.js
const Service = require('../models/service.model');
const Category = require('../models/category.model');
const { Op } = require('sequelize');

exports.searchServices = async (req, res) => {
    try {
        const { q } = req.query;
        
        // Define the search criteria for title, location, and associated category name
        const searchCriteria = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${q}%` } },
                { location: { [Op.iLike]: `%${q}%` } },
                {
                    '$Category.name$': { [Op.iLike]: `%${q}%` }
                }
            ]
        };

        // Perform search with associated category and retrieve category name
        const services = await Service.findAll({
            where: searchCriteria,
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],  // Retrieve category ID and name
                    required: true, // Ensures the service has a matching category
                    where: { id: { [Op.col]: 'Service.categoryId' } } // Compare categoryId in Service with id in Category
                }
            ]
        });

        // Return results with service and matching category
        res.json(services);
    } catch (error) {
        console.error('Error searching services:', error);
        res.status(500).json({ error: 'An error occurred while searching for services.' });
    }
};

// controllers/control.js
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findOne({
            where: { id },
            include: [
                {
                    model: Category,
                    attributes: ['name']
                }
            ]
        });
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        console.error('Error fetching service by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the service.' });
    }
};

