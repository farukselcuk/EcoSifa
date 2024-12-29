require('dotenv').config();

const config = {
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    app: {
        port: process.env.APP_PORT,
        secret: process.env.APP_SECRET,
        env: process.env.APP_ENV
    }
};

module.exports = config; 