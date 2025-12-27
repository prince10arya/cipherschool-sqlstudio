/**
 * Workspace State Management Store
 * 
 * Manages all state and actions for the SQL workspace where students
 * practice assignments. This includes:
 * - Assignment data loading
 * - SQL query management
 * - Query execution
 * - Hint generation from AI
 * - Error and result handling
 * 
 * Uses Zustand for lightweight, performant state management.
 * 
 * @module store/useWorkspaceStore
 */

import { create } from 'zustand';

// API endpoint configuration (can be overridden with environment variable)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Workspace Store
 * 
 * Central state management for the assignment workspace.
 * All workspace-related state and actions are contained here.
 */
const useWorkspaceStore = create((set, get) => ({
    // ===== State =====

    /** @type {Object|null} Current assignment being worked on */
    assignment: null,

    /** @type {string} Student's SQL query (defaults to helpful placeholder) */
    query: '-- Write your SQL query here\n',

    /** @type {Object|null} Results from executing the query */
    results: null,

    /** @type {string|null} Error message to display */
    error: null,

    /** @type {string|null} AI-generated hint text */
    hint: null,

    /** @type {string|null} Which AI model generated the hint */
    hintModel: null,

    /** @type {boolean} Is data currently being loaded? */
    loading: true,

    /** @type {boolean} Is a query currently being executed? */
    executing: false,

    /** @type {boolean} Is a hint currently being generated? */
    gettingHint: false,

    // ===== Actions =====

    /**
     * Updates the student's SQL query
     * @param {string} query - The new query text
     */
    setQuery: (query) => set({ query }),

    /**
     * Fetches assignment details from the server
     * 
     * @param {string} id - Assignment MongoDB ObjectId
     */
    fetchAssignment: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/assignments/${id}`);
            const data = await response.json();

            if (data.success) {
                // Successfully loaded assignment
                set({ assignment: data.data, loading: false });
            } else {
                // Server returned an error
                set({ error: 'Assignment not found', loading: false });
            }
        } catch (err) {
            console.error('Failed to fetch assignment:', err);
            // Network or other error
            set({ error: 'Failed to load assignment. Please check your connection.', loading: false });
        }
    },

    /**
     * Executes the student's SQL query against the database
     * 
     * Validates that a query exists before sending to server.
     * Clears previous results and errors.
     */
    executeQuery: async () => {
        const { query } = get();

        // Don't execute if query is empty or unchanged from placeholder
        if (!query.trim() || query.trim() === '-- Write your SQL query here') {
            set({ error: 'Please write a SQL query first' });
            return;
        }

        // Clear previous results and show loading state
        set({ executing: true, error: null, results: null });

        try {
            const response = await fetch(`${API_URL}/query/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (data.success) {
                // Query executed successfully
                set({ results: data.data, executing: false });
            } else {
                // Query had errors (syntax, security, etc.)
                set({
                    error: data.message || 'Query execution failed',
                    executing: false
                });
            }
        } catch (err) {
            console.error('Query execution failed:', err);
            // Network or server error
            set({ error: 'Failed to execute query. Please try again.', executing: false });
        }
    },

    /**
     * Requests an AI-generated hint for the current assignment
     * 
     * Sends the question, student's current query, and sample data
     * to the AI to get contextual, educational guidance.
     */
    getHint: async () => {
        const { assignment, query } = get();

        // Can't get a hint without an assignment
        if (!assignment) return;

        // Show loading state and clear previous hint
        set({ gettingHint: true, hint: null });

        try {
            const response = await fetch(`${API_URL}/hint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: assignment.question,
                    currentQuery: query,
                    sampleData: assignment.sampleData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Successfully received hint from AI
                set({
                    hint: data.hint,
                    hintModel: data.modelUsed,
                    gettingHint: false,
                });
            } else {
                // AI service error
                set({ error: 'Failed to get hint. Please try again.', gettingHint: false });
            }
        } catch (err) {
            console.error('Hint generation failed:', err);
            // Network or server error
            set({ error: 'Failed to get hint. Please try again.', gettingHint: false });
        }
    },

    /**
     * Resets the workspace to initial state
     * 
     * Called when navigating away from the workspace to clean up
     * and prevent memory leaks.
     */
    resetWorkspace: () => set({
        assignment: null,
        query: '-- Write your SQL query here\n',
        results: null,
        error: null,
        hint: null,
        hintModel: null,
        loading: true,
        executing: false,
        gettingHint: false,
    }),
}));

export default useWorkspaceStore;
