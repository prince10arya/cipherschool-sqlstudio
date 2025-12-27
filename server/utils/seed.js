const Assignment = require('../models/Assignment');
const mongoose = require('mongoose');
require('dotenv').config();

// Sample assignments
const sampleAssignments = require('./sample');

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing assignments
        await Assignment.deleteMany({});
        console.log('Cleared existing assignments');

        // Insert sample assignments
        await Assignment.insertMany(sampleAssignments);
        console.log('Successfully seeded database with sample assignments');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
