const Category = require('../models/category.model');
const Service = require('../models/service.model');

// Fetch categories with a limit of 4
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ limit: 4 });
        if (!categories || categories.length === 0) {
            return res.status(404).json({ error: 'No categories found' });
        }
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Fetch services by category ID
exports.getServicesByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const services = await Service.findAll({
            where: { categoryId: categoryId },
        });

        if (!services || services.length === 0) {
            return res.status(404).json({ error: 'No services found for this category' });
        }

        console.log(services);

        res.json(services);
    } catch (error) {
        console.error('Error fetching services by category:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};
