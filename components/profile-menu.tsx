"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { useTheme } from "@/hooks/useTheme";

type ProfileMenuProps = {
  userEmail?: string | null;
  nomeCompleto?: string | null;
  avatarUrl?: string | null;
};

export function ProfileMenu({
  userEmail,
  nomeCompleto,
  avatarUrl,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const initial = (nomeCompleto?.charAt(0) || userEmail?.charAt(0) || "U").toUpperCase();

  return (
    <div ref={rootRef} className="profile-menu-container">
      <button
        type="button"
        className="profile-menu-trigger"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu de perfil"
        title="Menu de perfil"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nomeCompleto || "Avatar"}
            className="profile-menu-avatar"
          />
        ) : (
          <span className="profile-menu-avatar-initial">{initial}</span>
        )}
      </button>

      {open && (
        <div className="profile-menu-dropdown" role="menu">
          {/* Informações do Usuário */}
          <div className="profile-menu-header">
            <div className="profile-menu-info">
              <strong>{nomeCompleto || "Usuário"}</strong>
              <span className="profile-menu-email">{userEmail}</span>
            </div>
          </div>

          {/* Links */}
          <nav className="profile-menu-nav">
            <Link
              href="/perfil"
              className="profile-menu-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="menu-icon">👤</span>
              Perfil
            </Link>

            <Link
              href="/minha-area"
              className="profile-menu-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="menu-icon">📋</span>
              Minha Área
            </Link>
          </nav>

          {/* Divisor */}
          <div className="profile-menu-divider"></div>

          {/* Configurações */}
          <div className="profile-menu-settings">
            <button
              onClick={toggleTheme}
              className="profile-menu-setting-item"
              title={`Mudar para tema ${theme === "light" ? "escuro" : "claro"}`}
            >
              <span className="menu-icon">{theme === "light" ? "🌙" : "☀️"}</span>
              Tema: {theme === "light" ? "Claro" : "Escuro"}
            </button>
          </div>

          {/* Logout */}
          <div className="profile-menu-divider"></div>

          <form action={signOut} className="profile-menu-logout-form">
            <button
              type="submit"
              className="profile-menu-item profile-menu-logout"
              role="menuitem"
            >
              <span className="menu-icon">🚪</span>
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
