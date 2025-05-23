"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 bg-light-surface dark:bg-dark-surface border border-neutral-300 dark:border-neutral-600 rounded-full shadow-md hover:bg-neutral-100 dark:hover:bg-dark-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary focus-visible:ring-offset-light-surface dark:focus-visible:ring-offset-dark-surface transition-colors duration-150"
      aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="text-light-text dark:text-dark-text text-xl">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
