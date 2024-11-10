const Service  = require('../models/service.model');
const  Rating  = require('../models/rating.model');
const  Review  = require('../models/review.model');
const  User  = require('../models/user.model');
const Category  = require('../models/category.model');

exports.getProfileInfo = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;

        // Fetch the service details including category and rating information
        const service = await Service.findOne({
            where: { id: serviceId },
            include: [
                {
                    model: Rating,
                    attributes: ['ratingScore', 'reviewCount'],
                },
                {
                    model: Category,
                    attributes: ['name'],
                },
            ],
        });

        // If no service is found, return a 404 response
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Fetch the first 5 reviews with user details
        const reviews = await Review.findAll({
            where: { serviceId },
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName'],
                },
            ],
            limit: 5,
            order: [['createdAt', 'DESC']],
        });

        res.json({
            service,
            rating: service.rating,
            category: service.category,
            reviews,
        });
    } catch (error) {
        console.error("Error fetching profile information:", error);
        res.status(500).json({ message: 'Error fetching profile information' });
    }
};

// Load more reviews, 5 at a time
exports.getMoreReviews = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const offset = parseInt(req.query.offset) || 0;

        // Fetch next 5 reviews with user details
        const reviews = await Review.findAll({
            where: { serviceId },
            include: [{ model: User, attributes: ['firstName', 'lastName'] }],
            limit: 5,
            offset
        });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error loading more reviews' });
    }
};