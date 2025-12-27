/**
 * Theme Management Store
 * 
 * Manages the application's dark/light theme state.
 * Theme preference is persisted to localStorage so it's remembered
 * across sessions.
 * 
 * @module store/useThemeStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store with Persistence
 * 
 * Manages theme state and provides toggle functionality.
 * Uses Zustand's persist middleware to save preference to localStorage.
 */
const useThemeStore = create(
    persist(
        (set) => ({
            /**
             * Current theme mode
             * @type {'dark'|'light'}
             */
            theme: 'dark', // Default to dark theme

            /**
             * Toggles between dark and light theme
             * Automatically updates the data-theme attribute on document root
             */
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'dark' ? 'light' : 'dark',
                })),

            /**
             * Directly sets the theme to a specific value
             * @param {'dark'|'light'} theme - The theme to set
             */
            setTheme: (theme) => set({ theme }),
        }),
        {
            // Save to localStorage with this key
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
