import React, { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import './ThemeToggle.scss';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <span className="theme-toggle__icon">
                {theme === 'dark' ? '☀️' : '🌙'}
            </span>
        </button>
    );
};

export default ThemeToggle;
