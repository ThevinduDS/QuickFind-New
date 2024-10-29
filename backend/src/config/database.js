// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'quickfind_db',
    username: 'postgres',
    password: '5.sachin.505',
    logging: false,
});

module.exports = sequelize;