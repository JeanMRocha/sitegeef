"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/login/actions";
import { useTheme } from "@/hooks/useTheme";

type HeaderCompactProps = {
  userEmail?: string | null;
  nomeCompleto?: string | null;
  avatarUrl?: string | null;
};

export function HeaderCompact({
  userEmail,
  nomeCompleto,
  avatarUrl,
}: HeaderCompactProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfigOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!userEmail) return null;

  const initial = (nomeCompleto?.charAt(0) || userEmail?.charAt(0) || "U").toUpperCase();

  return (
    <div ref={menuRef} className="header-compact-menu">
      {/* Perfil Avatar Trigger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="header-compact-trigger"
        title="Menu"
        aria-label="Menu"
      >
        ☰
      </button>

      {/* Perfil Menu */}
      {menuOpen && (
        <div className="header-compact-dropdown">
          {/* Header */}
          <div className="header-compact-user">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="header-compact-avatar" />
            ) : (
              <div className="header-compact-avatar-initial">{initial}</div>
            )}
            <div className="header-compact-user-info">
              <strong>{nomeCompleto || "Usuário"}</strong>
              <span>{userEmail}</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="header-compact-nav">
            <Link
              href="/perfil"
              className="header-compact-item"
              onClick={() => setMenuOpen(false)}
            >
              <span>👤</span> Perfil
            </Link>
            <Link
              href="/minha-area"
              className="header-compact-item"
              onClick={() => setMenuOpen(false)}
            >
              <span>📋</span> Minha Área
            </Link>
          </nav>

          {/* Divider */}
          <div className="header-compact-divider"></div>

          {/* Config Submenu */}
          <div className="header-compact-config">
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className="header-compact-config-trigger"
            >
              <span>⚙️</span> Configurações
              <span className="header-compact-arrow">{configOpen ? "▼" : "▶"}</span>
            </button>

            {configOpen && (
              <div className="header-compact-submenu">
                <button
                  onClick={toggleTheme}
                  className="header-compact-submenu-item"
                >
                  <span>{theme === "light" ? "🌙" : "☀️"}</span>
                  {theme === "light" ? "Escuro" : "Claro"}
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="header-compact-divider"></div>

          <form action={signOut}>
            <button type="submit" className="header-compact-logout">
              <span>🚪</span> Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
