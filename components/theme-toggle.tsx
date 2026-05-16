"use client";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Mudar para tema ${theme === "light" ? "escuro" : "claro"}`}
      title={`Tema ${theme === "light" ? "escuro" : "claro"}`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
