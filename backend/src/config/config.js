// backend/src/config/config.js
require('dotenv').config();

const config = {
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development'
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'quickfind_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD
    },
    server: {
        port: process.env.PORT || 3000
    }
};

module.exports = config;