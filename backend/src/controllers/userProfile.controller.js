const User = require('../models/user.model');


// Controller to get user profile by ID
exports.getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        // Use findOne with the where clause to find the user by ID
        const user = await User.findOne({
            where: {
                id: userId  // Filter by user ID
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'status','photoURL', 'createdAt', 'updatedAt'] // Define the columns to return
        });
        

        if (user) {
            res.json({
                success: true,
                data: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// In user.controller.js
exports.updateUserProfilePhoto = async (req, res) => {
    const userId = req.params.id;
    const { photoURL } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (user) {
            console.log("New photo URL:", photoURL); // Debugging line
            user.photoURL = photoURL;
            await user.update();
            res.json({
                success: true,
                message: 'Profile photo updated successfully',
                data: user
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error updating profile photo:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
