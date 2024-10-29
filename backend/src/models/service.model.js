// backend/src/models/service.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    providerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    priceType: {
        type: DataTypes.ENUM('fixed', 'hourly', 'negotiable'),
        defaultValue: 'fixed'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serviceArea: {
        type: DataTypes.INTEGER, // radius in kilometers
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'inactive', 'rejected'),
        defaultValue: 'pending'
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    availableDays: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    workingHours: {
        type: DataTypes.JSON,
        defaultValue: {
            start: '09:00',
            end: '17:00'
        }
    }
});

module.exports = Service;