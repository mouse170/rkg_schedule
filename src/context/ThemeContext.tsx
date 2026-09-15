import React, { createContext, useContext, useEffect } from 'react';

export type ThemeMode = 'dark';

interface ThemeContextType {
  theme: 'dark';
  resolvedTheme: 'dark';
  setTheme: (mode: 'dark') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 依據辣酷甜天鵝絨金主視覺主題，全站統一鎖定於天鵝絨暗色奢華設計，取消亮暗切換
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'dark',
        resolvedTheme: 'dark',
        setTheme: () => {},
        toggleTheme: () => {}
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
