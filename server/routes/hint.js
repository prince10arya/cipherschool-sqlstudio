/**
 * AI Hint Generation Route
 * 
 * Provides intelligent, educational hints to students working on SQL assignments.
 * Uses Groq's LLM API with carefully crafted prompts to generate helpful guidance
 * without giving away complete solutions.
 * 
 * @module routes/hint
 */

const express = require('express');
const router = express.Router();
const { llmConfig, DEFAULT_MODEL } = require('../config/llm');

/**
 * POST /api/hint
 * 
 * Generates an educational hint for a SQL assignment using AI.
 * The hint is designed to guide the student toward the solution without
 * directly providing the answer.
 * 
 * The prompt is carefully constructed to ensure hints:
 * - Are educational and encouraging
 * - Don't reveal the complete solution
 * - Guide students to think about SQL concepts
 * - Reference relevant SQL keywords and patterns
 * 
 * @route POST /api/hint
 * @param {Object} req.body - Hint request data
 * @param {string} req.body.question - The assignment question
 * @param {string} req.body.currentQuery - Student's current attempt (optional)
 * @param {Object} req.body.sampleData - Sample database structure
 * @returns {Object} JSON response with generated hint and model used
 */
router.post('/', async (req, res) => {
    try {
        const { question, currentQuery, sampleData } = req.body;

        // Validate required fields
        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Question is required to generate a helpful hint',
            });
        }

        // Build context from sample data to help the AI understand available tables
        const dataContext = sampleData
            ? `Available tables and structure:\n${JSON.stringify(sampleData, null, 2)}`
            : 'No sample data provided';

        // Construct a carefully designed prompt for the AI
        // The prompt emphasizes providing guidance without revealing the answer
        const prompt = llmConfig.buildHintPrompt({
            question,
            currentQuery: currentQuery || 'Student hasn\'t started yet',
            dataContext,
        });

        // Call the Groq API to generate the hint
        const hint = await llmConfig.getCompletion(prompt, DEFAULT_MODEL);

        // Return the generated hint along with which model was used
        res.json({
            success: true,
            hint,
            modelUsed: DEFAULT_MODEL,
        });
    } catch (error) {
        console.error('Hint generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to generate hint at this time. Please try again or consult the documentation.',
        });
    }
});

module.exports = router;
