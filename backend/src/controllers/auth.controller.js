require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../config/config');  // Import config to access JWT_SECRET

// Check if JWT_SECRET is configured
if (!config.jwt.secret) {
    console.error('JWT_SECRET is missing in config');
    process.exit(1); // Exit if JWT secret is missing
}

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body;

        console.log('Registration attempt:', { email, phone });

        // Check for existing user by email or phone
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

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: role || 'customer'
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt.secret,
            { expiresIn: '24h' }
        );

        console.log('User registered:', { id: user.id, email: user.email });

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

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email' });
        }

        // Check if the password is valid
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt.secret,
            { expiresIn: '24h' }
        );

        // console.log('User logged in:', { id: user.id, email: user.email });

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

