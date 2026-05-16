"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { signOut } from "@/app/login/actions";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

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

  // Not authenticated
  if (!userEmail) {
    return (
      <Link
        href="/login?next=/minha-area&popup=1"
        className="site-header-user-btn site-header-user-login"
        title="Fazer login"
      >
        👤
      </Link>
    );
  }

  // Authenticated
  return (
    <div ref={menuRef} className="site-header-user">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="site-header-user-btn"
        title="Menu de usuário"
        aria-label="Menu de usuário"
        aria-expanded={menuOpen}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={44}
            height={44}
            className="site-header-user-avatar"
            unoptimized
          />
        ) : (
          <div className="site-header-user-initial">👤</div>
        )}
      </button>

      {menuOpen && (
        <div className="site-header-user-dropdown">
          {/* User Info */}
          <div className="site-header-user-info">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={48}
                height={48}
                className="site-header-user-avatar-lg"
                unoptimized
              />
            ) : (
              <div className="site-header-user-initial-lg">👤</div>
            )}
            <div className="site-header-user-details">
              <strong>{nomeCompleto || "Usuário"}</strong>
              <span>{userEmail}</span>
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
          <button
            onClick={() => signOut()}
            className="site-header-user-logout"
          >
            <span>🚪</span> Sair
          </button>
        </div>
      )}
    </div>
  );
}
