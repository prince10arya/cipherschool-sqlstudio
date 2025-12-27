/**
 * Assignment Management Routes
 * 
 * Handles CRUD operations for SQL practice assignments:
 * - List all assignments
 * - Get single assignment details
 * - Create new assignment (admin)
 * - Update existing assignment (admin)
 * - Delete assignment (admin)
 * 
 * @module routes/assignments
 */

const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

/**
 * GET /api/assignments
 * 
 * Retrieves a list of all available SQL practice assignments.
 * Returns only essential fields for the listing page (title, difficulty, description).
 * Assignments are sorted by creation date (newest first).
 * 
 * @route GET /api/assignments
 * @returns {Object} JSON response with array of assignments
 */
router.get('/', async (req, res) => {
    try {
        // Fetch all assignments, selecting only necessary fields for performance
        const assignments = await Assignment.find()
            .select('title difficulty description createdAt')
            .sort({ createdAt: -1 }); // Newest first

        res.json({
            success: true,
            data: assignments,
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Could not load assignments. Please try again later.',
        });
    }
});

/**
 * GET /api/assignments/:id
 * 
 * Retrieves complete details of a specific assignment including:
 * - Full question text
 * - Sample data with table schemas
 * - All metadata
 * 
 * @route GET /api/assignments/:id
 * @param {string} req.params.id - MongoDB ObjectId of the assignment
 * @returns {Object} JSON response with complete assignment data
 */
router.get('/:id', async (req, res) => {
    try {
        // Find the assignment by its unique ID
        const assignment = await Assignment.findById(req.params.id);

        // Handle case where assignment doesn't exist
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found. It may have been deleted.',
            });
        }

        // Return the complete assignment data
        res.json({
            success: true,
            data: assignment,
        });
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Could not load assignment details. Please try again.',
        });
    }
});

/**
 * POST /api/assignments
 * 
 * Creates a new SQL practice assignment.
 * Requires all fields to be provided and validates difficulty level.
 * 
 * @route POST /api/assignments
 * @param {Object} req.body - Assignment data
 * @param {string} req.body.title - Assignment title
 * @param {string} req.body.difficulty - Difficulty level (Easy/Medium/Hard)
 * @param {string} req.body.description - Brief description
 * @param {string} req.body.question - Full question text
 * @param {Object} req.body.sampleData - Sample database tables and data
 * @returns {Object} JSON response with created assignment
 */
router.post('/', async (req, res) => {
    try {
        const { title, difficulty, description, question, sampleData } = req.body;

        // Validate that all required fields are present
        if (!title || !difficulty || !description || !question || !sampleData) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: title, difficulty, description, question, and sampleData',
            });
        }

        // Validate difficulty is one of the allowed values
        const validDifficulties = ['Easy', 'Medium', 'Hard'];
        if (!validDifficulties.includes(difficulty)) {
            return res.status(400).json({
                success: false,
                message: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
            });
        }

        // Create a new assignment document
        const newAssignment = new Assignment({
            title,
            difficulty,
            description,
            question,
            sampleData,
        });

        // Save to database
        const savedAssignment = await newAssignment.save();

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully!',
            data: savedAssignment,
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create assignment. Please check your data and try again.',
            error: error.message,
        });
    }
});

/**
 * PUT /api/assignments/:id
 * 
 * Updates an existing assignment with new data.
 * Only provided fields will be updated (partial updates supported).
 * 
 * @route PUT /api/assignments/:id
 * @param {string} req.params.id - MongoDB ObjectId of the assignment to update
 * @param {Object} req.body - Fields to update
 * @returns {Object} JSON response with updated assignment
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, difficulty, description, question, sampleData } = req.body;

        // If difficulty is being updated, validate it
        if (difficulty) {
            const validDifficulties = ['Easy', 'Medium', 'Hard'];
            if (!validDifficulties.includes(difficulty)) {
                return res.status(400).json({
                    success: false,
                    message: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
                });
            }
        }

        // Update the assignment and get the updated version
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id,
            { title, difficulty, description, question, sampleData },
            {
                new: true,          // Return the updated document
                runValidators: true // Run schema validations
            }
        );

        // Handle case where assignment doesn't exist
        if (!updatedAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found. It may have been deleted.',
            });
        }

        res.json({
            success: true,
            message: 'Assignment updated successfully!',
            data: updatedAssignment,
        });
    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update assignment. Please try again.',
            error: error.message,
        });
    }
});

/**
 * DELETE /api/assignments/:id
 * 
 * Permanently deletes an assignment from the database.
 * This action cannot be undone.
 * 
 * @route DELETE /api/assignments/:id
 * @param {string} req.params.id - MongoDB ObjectId of the assignment to delete
 * @returns {Object} JSON response confirming deletion
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(id);

        // Handle case where assignment doesn't exist
        if (!deletedAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found. It may have already been deleted.',
            });
        }

        res.json({
            success: true,
            message: 'Assignment deleted successfully!',
            data: deletedAssignment,
        });
    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete assignment. Please try again.',
            error: error.message,
        });
    }
});

module.exports = router;
