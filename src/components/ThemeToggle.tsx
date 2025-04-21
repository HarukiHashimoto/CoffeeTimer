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
      className="p-2 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
    >
      <span className="text-light-text dark:text-dark-text">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
