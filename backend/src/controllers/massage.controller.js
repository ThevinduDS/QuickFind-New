//This is the updated massage.controller.js file

const { Op } = require('sequelize');
const Message = require('../models/message.model');
const User = require('../models/user.model');

// Get service providers
const getServiceProviders = async (req, res) => {
    try {
        const serviceProviders = await User.findAll({
            where: { role: 'service_provider' },
            attributes: ['id', 'firstName', 'lastName']
        });
        res.json(serviceProviders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching service providers' });
    }
};

// massage.controller.js

const getConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        // Log the userId to verify it's being received correctly
        console.log(`Fetching conversations for userId: ${userId}`);

        // Execute the query and log intermediate data
        const conversations = await Message.findAll({
            where: {
                senderId: userId
            },
            include: [
                { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName'] }
            ],
            group: ['receiver.id', 'Message.id'],  // Ensure Message.id is included in GROUP BY
            order: [['createdAt', 'DESC']]
        });

        console.log(`Conversations found: ${JSON.stringify(conversations, null, 2)}`);
        res.json(conversations);

    } catch (error) {
        // Log the full error for detailed inspection
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Error fetching conversations' });
    }
};


// Send a message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        const message = await Message.create({ senderId, receiverId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
};

// Retrieve all messages between two users
const getMessagesBetweenUsers = async (req, res) => {
    const { userId, receiverId } = req.params;
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId },
                    { senderId: receiverId, receiverId: userId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

// Export all functions
module.exports = {
    getServiceProviders,
    getConversations,
    sendMessage,
    getMessagesBetweenUsers
};
