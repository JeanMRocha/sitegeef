"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/client";

type UserMenuProps = {
  userEmail?: string | null;
  nomeCompleto?: string | null;
  avatarUrl?: string | null;
  hasAdminAccess?: boolean;
};

export function UserMenu({
  userEmail,
  nomeCompleto,
  avatarUrl,
  hasAdminAccess,
}: UserMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clientUserEmail, setClientUserEmail] = useState<string | null>(userEmail ?? null);
  const [clientNomeCompleto, setClientNomeCompleto] = useState<string | null>(nomeCompleto ?? null);
  const [clientAvatarUrl, setClientAvatarUrl] = useState<string | null>(avatarUrl ?? null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setClientUserEmail(null);
        setClientNomeCompleto(null);
        setClientAvatarUrl(null);
        return;
      }

      setClientUserEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("nome_completo, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      setClientNomeCompleto(profile?.nome_completo ?? null);
      setClientAvatarUrl(profile?.avatar_url ?? null);
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const effectiveUserEmail = clientUserEmail ?? userEmail ?? null;
  const effectiveNomeCompleto = clientNomeCompleto ?? nomeCompleto ?? null;
  const effectiveAvatarUrl = clientAvatarUrl ?? avatarUrl ?? null;

  // Not authenticated
  if (!effectiveUserEmail) {
    return (
      <Link
        href="/login?next=/minha-area"
        className="site-header-user-btn site-header-user-login"
        title="Fazer login"
      >
        👤
      </Link>
    );
  }

  // Authenticated
  const initial = (effectiveNomeCompleto?.charAt(0) || effectiveUserEmail?.charAt(0) || "U").toUpperCase();

  return (
    <div ref={menuRef} className="site-header-user">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="site-header-user-btn"
        title="Menu de usuário"
        aria-label="Menu de usuário"
        aria-expanded={menuOpen}
      >
        {effectiveAvatarUrl ? (
          <img src={effectiveAvatarUrl} alt="Avatar" className="site-header-user-avatar" />
        ) : (
          <div className="site-header-user-initial">{initial}</div>
        )}
      </button>

      {menuOpen && (
        <div className="site-header-user-dropdown">
          {/* User Info */}
          <div className="site-header-user-info">
            {effectiveAvatarUrl ? (
              <img src={effectiveAvatarUrl} alt="Avatar" className="site-header-user-avatar-lg" />
            ) : (
              <div className="site-header-user-initial-lg">{initial}</div>
            )}
            <div className="site-header-user-details">
              <strong>{effectiveNomeCompleto || "Usuário"}</strong>
              <span>{effectiveUserEmail}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="site-header-user-divider"></div>

          {/* Navigation Links */}
          <nav className="site-header-user-nav">
            <Link
              href="/perfil"
              className="site-header-user-item"
              onClick={() => setMenuOpen(false)}
            >
              <span>👤</span> Meu Perfil
            </Link>
            <Link
              href="/minha-area"
              className="site-header-user-item"
              onClick={() => setMenuOpen(false)}
            >
              <span>📋</span> Minha Área
            </Link>
            {hasAdminAccess && (
              <Link
                href="/admin"
                className="site-header-user-item"
                onClick={() => setMenuOpen(false)}
              >
                <span>🛠️</span> Painel Admin
              </Link>
            )}
          </nav>

          {/* Divider */}
          <div className="site-header-user-divider"></div>

          {/* Settings */}
          <div className="site-header-user-settings">
            <button
              onClick={toggleTheme}
              className="site-header-user-item site-header-user-setting"
            >
              <span>{theme === "light" ? "🌙" : "☀️"}</span>
              {theme === "light" ? "Modo Escuro" : "Modo Claro"}
            </button>
          </div>

          {/* Divider */}
          <div className="site-header-user-divider"></div>

          {/* Logout */}
          <form action={signOut} className="site-header-user-logout-form">
            <button type="submit" className="site-header-user-logout">
              <span>🚪</span> Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
