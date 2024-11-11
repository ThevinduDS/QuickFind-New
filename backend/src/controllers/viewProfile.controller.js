const Service  = require('../models/service.model');
const  Rating  = require('../models/rating.model');
const  Review  = require('../models/review.model');
const  User  = require('../models/user.model');
const Category  = require('../models/category.model');

exports.getProfileInfo = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;

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

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

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
            service: {
                ...service.toJSON(),
                category: service.Category, // Directly attach category to simplify front-end access
                rating: service.Rating      // Directly attach rating similarly
            },
            reviews: reviews.map(review => ({
                ...review.toJSON(),
                userName: `${review.User.firstName} ${review.User.lastName}`
            }))
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
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        // Format the reviews with the user's full name
        const formattedReviews = reviews.map(review => ({
            userName: `${review.User.firstName} ${review.User.lastName}`,
            comment: review.comment,
            ratingScore: review.ratingScore,
        }));

        res.json(formattedReviews);
    } catch (error) {
        console.error("Error loading more reviews:", error);
        res.status(500).json({ message: 'Error loading more reviews' });
    }
};
