import { GlobalTheme } from "@carbon/react";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemePreferenceContext = createContext();

const useThemePreference = () => {
  return useContext(ThemePreferenceContext);
}

const ThemePreference = ({children}) => {
  const [theme, setTheme] = useState('g100');
  const value = { theme, setTheme };

  useEffect(() => {
    document.documentElement.setAttribute('data-carbon-theme', theme);
  }, [theme]);

  return (
    <ThemePreferenceContext.Provider value={value}>
      <GlobalTheme theme={theme}>{children}</GlobalTheme>
    </ThemePreferenceContext.Provider>
  );
}

export { ThemePreference, useThemePreference };