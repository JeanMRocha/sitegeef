"use client";

import { useContext } from "react";
import { ThemeContext } from "@/lib/theme/theme-provider";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }

  return context;
}
