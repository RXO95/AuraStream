import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('auto');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme !== null) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme.', error);
      }
    };
    loadTheme();
  }, []);

  const handleSetTheme = async (mode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Failed to save theme.', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

