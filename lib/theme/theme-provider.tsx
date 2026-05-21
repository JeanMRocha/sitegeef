"use client";

import React, { createContext, useEffect, useState } from "react";
import type { Theme } from "./colors";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("geef-theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const preset = (window as Window & { __GEEF_THEME__?: Theme }).__GEEF_THEME__;
  if (preset === "light" || preset === "dark") {
    return preset;
  }

  const saved = localStorage.getItem("geef-theme");
  return saved === "dark" ? "dark" : "light";
}
