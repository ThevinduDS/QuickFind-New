// backend/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'quickfind_db',
    username: 'postgres',
    password: 'Ni@1230Dissa',
    logging: false,
});

module.exports = sequelize;