// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'quickfind_db',
    username: 'postgres',
    password: '', //Add user password after pull 

    logging: false,
});

module.exports = sequelize;