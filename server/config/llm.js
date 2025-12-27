/**
 * Groq LLM Configuration
 * 
 * Configures and manages interactions with Groq's Language Learning Models
 * for generating educational SQL hints.
 * 
 * @module config/llm
 */

const Groq = require('groq-sdk');

// Initialize Groq SDK with API key from environment
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Available Groq LLM models for hint generation
 * Each model has different characteristics in terms of speed and capabilities
 */
const GROQ_MODELS = {
    // High-performance model with excellent reasoning capabilities
    LLAMA_70B: 'llama-3.3-70b-versatile',

    // Fast, lightweight model for quick responses
    LLAMA_8B: 'llama-3.1-8b-instant',

    // Mixture of experts model with balanced performance
    MIXTRAL: 'mixtral-8x7b-32768',

    // Google's Gemma model optimized for instruction following
    GEMMA: 'gemma2-9b-it',
};

// Default model used for hint generation (best balance of quality and speed)
const DEFAULT_MODEL = GROQ_MODELS.LLAMA_70B;

/**
 * LLM Configuration Object
 * Provides methods for interacting with the Groq API
 */
const llmConfig = {
    /**
     * Sends a prompt to the Groq API and retrieves completion
     * 
     * @param {string} prompt - The prompt to send to the model
     * @param {string} model - Which Groq model to use (defaults to LLAMA_70B)
     * @returns {Promise<string>} The generated text response
     */
    getCompletion: async (prompt, model = DEFAULT_MODEL) => {
        try {
            // Call the Groq API with the prompt
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                model: model,
                temperature: 0.7,  // Controls randomness (0.7 = balanced creativity)
                max_tokens: 500,   // Limit response length to 2-3 sentences
            });

            // Extract and return the generated text
            return completion.choices[0]?.message?.content || 'Unable to generate hint';
        } catch (error) {
            console.error('Groq API error:', error);
            throw new Error('Failed to generate hint from AI model');
        }
    },

    /**
     * Builds a carefully crafted prompt for generating educational SQL hints
     * 
     * The prompt instructs the AI to:
     * - Be educational and encouraging
     * - Not reveal the complete solution
     * - Guide students toward SQL concepts
     * - Keep hints brief (2 lines maximum)
     * 
     * @param {Object} params - Prompt parameters
     * @param {string} params.question - The SQL assignment question
     * @param {string} params.currentQuery - Student's current query attempt
     * @param {string} params.dataContext - Available database tables/structure
     * @returns {string} The complete prompt for the AI
     */
    buildHintPrompt: ({ question, currentQuery, dataContext }) => {
        return `You are a helpful SQL tutor providing guidance to a student learning SQL.

**Student's Assignment:**
${question}

**Available Database Context:**
${dataContext}

**Student's Current Query:**
${currentQuery}

**Your Task:**
Provide a brief, educational hint that guides the student toward the solution WITHOUT giving away the complete answer.

**Guidelines:**
1. Be encouraging and supportive
2. Focus on SQL concepts and patterns
3. Suggest which SQL keywords or clauses might be helpful
4. Don't write the actual query or reveal the exact solution
5. Ask guiding questions that lead them to the answer
6. Be encouraging and educational

Provide your hint carefully not to answer the question in 2 lines maximum.`;
    },
};

// Export configuration and available models
module.exports = {
    llmConfig,
    DEFAULT_MODEL,
    GROQ_MODELS,
};
