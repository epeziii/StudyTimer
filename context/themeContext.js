import React, { createContext, useState, useEffect } from 'react';
import { lightTheme } from '../themes/light';
import { darkTheme } from '../themes/dark';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};