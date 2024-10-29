// backend/src/controllers/auth.controller.js
require('dotenv').config();  // Ensure this is at the top to load environment variables
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');  // Ensure the path is correct

// Registration function
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body;

        // Log the incoming request body for debugging
        console.log('Registration request body:', req.body);
        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the JWT secret

        // Check if the user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or phone already exists'
            });
        }

        // Create a new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: await bcrypt.hash(password, 10),  // Hash the password
            role: role || 'customer'  // Default to 'customer' if no role is provided
        });

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,  // Ensure this is correctly set
            { expiresIn: '24h' }
        );

        // Respond with success
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log the incoming request body for debugging
        console.log('Login request body:', req.body);

        // Find the user by email
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is valid
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,  // Ensure this is correctly set
            { expiresIn: '24h' }
        );

        // Respond with success
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
};