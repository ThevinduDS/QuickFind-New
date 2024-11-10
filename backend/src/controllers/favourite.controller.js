const Favourite = require('../models/favourite.model');
const Service = require('../models/service.model');
const Rating = require('../models/rating.model');
const Review = require('../models/review.model');
const Category = require('../models/category.model')

// Add a favourite for a user
exports.addFavourite = async (req, res) => {
    try {
        const { userId, serviceId } = req.body;

        // Check if the favourite already exists for the user and service
        const existingFavourite = await Favourite.findOne({ 
            where: { userId, serviceId } // Ensure the same service is not added again
        });
        if (existingFavourite) {
            return res.status(400).json({ message: 'Provider already in favorites' });
        }

        const favourite = await Favourite.create({
            userId,
            serviceId
        });

        res.status(201).json(favourite);
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(500).json({ message: 'Failed to add favourite' });
    }
};

// Get all favorites for a specific user by userId
exports.getFavouritesByUserId = async (req, res) => {
    try {
        const favourites = await Favourite.findAll({
            where: { userId: req.params.userId },
            include: [
                {
                    model: Service,
                    attributes: ['title', 'description','categoryId'],
                    include: [
                        {
                            model: Rating,
                            attributes: ['ratingScore', 'reviewCount']
                        },
                        {
                            model: Review,
                            attributes: ['comment']
                        },
                        {
                            model: Category,
                            attributes: ['name', 'photoUrl'] // Include Category info here
                        }
                    ]
                }
            ]
        });
        res.json(favourites);
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).json({ error: 'Failed to fetch favourites' });
    }
};

// Remove a favourite
exports.removeFavourite = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const result = await Favourite.destroy({
            where: {
                id: id,
                userId: userId
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Favourite not found.' });
        }

        res.json({ message: 'Favourite removed successfully.' });
    } catch (error) {
        console.error('Error removing favourite:', error);
        res.status(500).json({ message: 'Error removing favourite.' });
    }
};