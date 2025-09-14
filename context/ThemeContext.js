// context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'auto', 'light', or 'dark'
  const [themeMode, setThemeMode] = useState('auto');

  // Load the saved theme from storage when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme !== null) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage.', error);
      }
    };
    loadTheme();
  }, []);

  // Save the theme to storage whenever it changes
  const handleSetTheme = async (mode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Failed to save theme to storage.', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};