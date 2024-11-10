const config = require('../config/config');
const Service = require('../models/service.model');
const Review = require('../models/review.model');
const Rating = require('../models/rating.model');
const { Op } = require('sequelize');

// Add a review and update rating
exports.addReview = async (req, res) => {
    const { service_id, user_id, rating_score, comment } = req.body;

    // Validate input
    if (!service_id || !user_id || !rating_score || !comment) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if the service exists
    const service = await Service.findOne({
        where: { id: service_id }
    });

    if (!service) {
        return res.status(404).json({ message: "Service not found!" });
    }

    // Check if the user has already reviewed the service
    const review = await Review.findOne({
        where: { serviceId:service_id , userId: user_id }
    });
    if (review) {
        return res.status(400).json({ message: "You have already reviewed this service!" });
    }



    try {
        // Check if the service exists
        const service = await Service.findOne({ where: { id: service_id } });

        if (!service) {
            return res.status(404).send("Service not found!");
        }

        const serviceprovider_id = service_id;

        // Create a new review
        const review = await Review.create({
            serviceId,
            userId,
            ratingScore,
            comment
        });

        // Update the rating for the service provider
        const rating = await Rating.findOne({ where: { serviceId } });

        if (rating) {
            // If the rating exists, update it
            const newReviewCount = rating.reviewCount + 1;
            const newRatingScore = (rating.ratingScore * rating.reviewCount + rating_score) / newReviewCount;

            // Format the newRatingScore to 1 decimal place
            const formattedRatingScore = parseFloat(newRatingScore.toFixed(1));

            await Rating.update(
                { ratingscore: formattedRatingScore, reviewCount: newReviewCount },
                { where: { serviceId } }
            );
        } else {
            // If the rating doesn't exist, create it
            await Rating.create({
                serviceId,
                ratingScore: rating_score,
                reviewCount: 1
            });
        }

        res.status(201).json({
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};
