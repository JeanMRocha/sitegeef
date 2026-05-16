"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook para rastrear a página visitada e persistir no localStorage
 * Útil para restaurar contexto quando o usuário volta
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Não rastrear páginas sensíveis
    if (pathname?.includes("/admin") || pathname?.includes("/login")) {
      return;
    }

    // Salvar última página visitada
    if (pathname) {
      localStorage.setItem("geef-last-visited", pathname);
    }
  }, [pathname]);
}

/**
 * Obter última página visitada
 */
export function getLastVisitedPage(): string {
  try {
    return localStorage.getItem("geef-last-visited") || "/";
  } catch {
    return "/";
  }
}
