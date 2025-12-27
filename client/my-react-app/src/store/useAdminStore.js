/**
 * Admin State Management Store
 * 
 * Manages all state and actions for the admin panel where instructors
 * can create, edit, and delete SQL practice assignments.
 * 
 * Provides full CRUD (Create, Read, Update, Delete) operations with
 * optimistic UI updates and error handling.
 * 
 * @module store/useAdminStore
 */

import { create } from 'zustand';

// API endpoint configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Admin Store
 * 
 * Central state management for admin panel operations.
 * Handles all assignment management functionality.
 */
const useAdminStore = create((set, get) => ({
    // ===== State =====

    /** @type {Array} List of all assignments */
    assignments: [],

    /** @type {boolean} Is data currently being loaded or saved? */
    loading: false,

    /** @type {string|null} Error message to display */
    error: null,

    /** @type {string|null} Success message to display */
    success: null,

    // ===== Actions =====

    /**
     * Fetches all assignments from the server
     * Used to populate the admin assignment list
     */
    fetchAssignments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/assignments`);
            const data = await response.json();

            if (data.success) {
                // Successfully loaded all assignments
                set({ assignments: data.data, loading: false });
            } else {
                // Server returned an error
                set({ error: 'Failed to load assignments', loading: false });
            }
        } catch (err) {
            console.error('Fetch assignments error:', err);
            // Network or other error
            set({ error: 'Failed to connect to server', loading: false });
        }
    },

    /**
     * Creates a new assignment
     * 
     * @param {Object} assignmentData - The assignment data to create
     * @param {string} assignmentData.title - Assignment title
     * @param {string} assignmentData.difficulty - Easy/Medium/Hard
     * @param {string} assignmentData.description - Brief description
     * @param {string} assignmentData.question - Full question text
     * @param {Object} assignmentData.sampleData - Database tables and data
     * @returns {Promise<boolean>} True if creation succeeded, false otherwise
     */
    createAssignment: async (assignmentData) => {
        // Clear previous messages and show loading
        set({ loading: true, error: null, success: null });
        try {
            const response = await fetch(`${API_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignmentData),
            });

            const data = await response.json();

            if (data.success) {
                // Add the new assignment to the list
                set((state) => ({
                    assignments: [...state.assignments, data.data],
                    loading: false,
                    success: 'Assignment created successfully! 🎉',
                }));
                return true;
            } else {
                // Server validation failed
                set({ error: data.message || 'Failed to create assignment', loading: false });
                return false;
            }
        } catch (err) {
            console.error('Create assignment error:', err);
            // Network or other error
            set({ error: 'Failed to create assignment. Please check your connection.', loading: false });
            return false;
        }
    },

    /**
     * Updates an existing assignment
     * 
     * @param {string} id - MongoDB ObjectId of the assignment
     * @param {Object} assignmentData - Updated assignment data
     * @returns {Promise<boolean>} True if update succeeded, false otherwise
     */
    updateAssignment: async (id, assignmentData) => {
        set({ loading: true, error: null, success: null });
        try {
            const response = await fetch(`${API_URL}/assignments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignmentData),
            });

            const data = await response.json();

            if (data.success) {
                // Update the assignment in the list
                set((state) => ({
                    assignments: state.assignments.map((assignment) =>
                        assignment._id === id ? data.data : assignment
                    ),
                    loading: false,
                    success: 'Assignment updated successfully! ✅',
                }));
                return true;
            } else {
                // Server validation failed
                set({ error: data.message || 'Failed to update assignment', loading: false });
                return false;
            }
        } catch (err) {
            console.error('Update assignment error:', err);
            // Network or other error
            set({ error: 'Failed to update assignment. Please try again.', loading: false });
            return false;
        }
    },

    /**
     * Deletes an assignment
     * 
     * @param {string} id - MongoDB ObjectId of the assignment to delete
     * @returns {Promise<boolean>} True if deletion succeeded, false otherwise
     */
    deleteAssignment: async (id) => {
        set({ loading: true, error: null, success: null });
        try {
            const response = await fetch(`${API_URL}/assignments/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                // Remove the assignment from the list
                set((state) => ({
                    assignments: state.assignments.filter((assignment) => assignment._id !== id),
                    loading: false,
                    success: 'Assignment deleted successfully! 🗑️',
                }));
                return true;
            } else {
                // Server error
                set({ error: data.message || 'Failed to delete assignment', loading: false });
                return false;
            }
        } catch (err) {
            console.error('Delete assignment error:', err);
            // Network or other error
            set({ error: 'Failed to delete assignment. Please try again.', loading: false });
            return false;
        }
    },

    /**
     * Clears success and error messages
     * Useful for dismissing notifications
     */
    clearMessages: () => set({ error: null, success: null }),
}));

export default useAdminStore;
