const mongoose = require('mongoose');
const { Pool } = require('pg');

// MongoDB Connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// PostgreSQL Connection Pool
const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

pgPool.on('connect', () => {
    console.log('✅ PostgreSQL connected successfully');
});

pgPool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
});

module.exports = { connectMongoDB, pgPool };
