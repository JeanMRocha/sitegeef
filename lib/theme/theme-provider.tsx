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
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Carregar tema preferido do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("geef-theme") as Theme | null;
    const isPublicSurface = isPublicRoute(window.location.pathname);

    const initialTheme = isPublicSurface ? "light" : (saved || "light");
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

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
      {mounted ? children : null}
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

function isPublicRoute(pathname: string) {
  return !pathname.startsWith("/admin") && pathname !== "/login" && pathname !== "/minha-area" && pathname !== "/perfil";
}
