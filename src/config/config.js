require('dotenv').config();

module.exports = {
"development": {
    "username": process.env.DATABASE_USERNAME || 'root',
    "password": process.env.DATABASE_PASSWORD || '123456',
    "database": process.env.DATABASE_NAME || 'core',
    "host": process.env.DATABASE_HOST || 'localhost',
    "dialect": "postgres",
    "define": {
        timestamps: false
    }
},
"test": {
    "username": process.env.DATABASE_USERNAME,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    "dialect": "postgres",
    "define": {
        timestamps: false
    }
},
"production": {
    "username": process.env.DATABASE_USERNAME,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    "dialect": "postgres",
    "define": {
        timestamps: false
    }
}
};