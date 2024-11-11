const config = require('../config/config');
const Service = require('../models/service.model');
const Review = require('../models/review.model');
const Rating = require('../models/rating.model');
const { Op } = require('sequelize');

exports.addReview = async (req, res) => {
    const { service_id, user_id, rating_score, comment } = req.body;

    if (!service_id || !user_id || !rating_score || !comment) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        const service = await Service.findOne({ where: { id: service_id } });
        if (!service) return res.status(404).json({ message: "Service not found!" });

        // const existingReview = await Review.findOne({
        //     where: { serviceId: service_id, userId: user_id }
        // });
        // if (existingReview) {
        //     return res.status(400).json({ message: "You have already reviewed this service!" });
        // }

        const review = await Review.create({
            serviceId: service_id,
            userId: user_id,
            ratingScore: rating_score,
            comment
        });

        const rating = await Rating.findOne({ where: { serviceId: service_id } });

        if (rating) {
            const newReviewCount = rating.reviewCount + 1;
            const newRatingScore = (rating.ratingScore * rating.reviewCount + rating_score) / newReviewCount;
            const formattedRatingScore = parseFloat(newRatingScore.toFixed(1));

            await Rating.update(
                { ratingScore: formattedRatingScore, reviewCount: newReviewCount },
                { where: { serviceId: service_id } }
            );
        } else {
            await Rating.create({
                serviceId: service_id,
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
