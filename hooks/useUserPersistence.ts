"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

interface UserPreferences {
  theme?: "light" | "dark";
  language?: string;
  lastVisited?: string;
  loginCount?: number;
}

/**
 * Hook para persistir dados do usuário automaticamente
 * Sincroniza com localStorage para cache local
 */
export function useUserPersistence(user: User | null) {
  useEffect(() => {
    if (!user) {
      // Limpar dados ao fazer logout
      localStorage.removeItem("geef-user-data");
      localStorage.removeItem("geef-user-id");
      return;
    }

    // Salvar ID do usuário
    localStorage.setItem("geef-user-id", user.id);

    // Salvar dados do usuário
    const userData = {
      id: user.id,
      email: user.email,
      nome_completo: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem("geef-user-data", JSON.stringify(userData));

    // Atualizar contagem de logins
    const loginCountKey = `geef-login-count-${user.id}`;
    const currentCount = parseInt(localStorage.getItem(loginCountKey) || "0");
    localStorage.setItem(loginCountKey, String(currentCount + 1));
  }, [user]);
}

/**
 * Recuperar dados do usuário do cache local
 */
export function getCachedUserData() {
  try {
    const data = localStorage.getItem("geef-user-data");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Obter preferências do usuário
 */
export function getUserPreferences(): UserPreferences {
  return {
    theme: (localStorage.getItem("geef-theme") as "light" | "dark") || "light",
    language: localStorage.getItem("geef-language") || "pt-BR",
    lastVisited: localStorage.getItem("geef-last-visited") || "/",
  };
}

/**
 * Salvar preferência do usuário
 */
export function saveUserPreference(key: keyof UserPreferences, value: string) {
  localStorage.setItem(`geef-${key}`, value);
}

/**
 * Limpar todos os dados do usuário ao fazer logout
 */
export function clearUserData() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("geef-"));
  keys.forEach((key) => {
    // Manter tema mesmo após logout (é uma preferência global)
    if (key !== "geef-theme" && key !== "geef-language") {
      localStorage.removeItem(key);
    }
  });
}
