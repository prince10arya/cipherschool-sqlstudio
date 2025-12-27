require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongoDB();

// Routes
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/query', require('./routes/query'));
app.use('/api/hint', require('./routes/hint'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CipherSQL Studio API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
