"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/site-icons";
import { clearUserData } from "@/hooks/useUserPersistence";
import { useTheme } from "@/hooks/useTheme";
import { getMultilingualCopy, type Locale } from "@/lib/multilingual/client";

type AdminUserMenuProps = {
  locale: Locale;
  email?: string;
  fullName?: string;
};

function getInitials(value?: string) {
  if (!value) {
    return "GE";
  }

  const parts = value.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join("");
  return (initials || value.slice(0, 2)).toUpperCase();
}

export function AdminUserMenu({ locale, email, fullName }: AdminUserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const copy = getMultilingualCopy(locale);
  const displayName = fullName || email || "Usuário";
  const initials = getInitials(displayName);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={menuRef} className="admin-user-menu">
      <button
        type="button"
        className="admin-user-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Menu do usuário"
      >
        <span className="admin-user-menu-avatar">{initials}</span>
      </button>

      {open && (
        <div className="admin-user-menu-popover">
          <div className="admin-user-menu-info">
            <strong>{displayName}</strong>
            <span>{email}</span>
          </div>

          <nav className="admin-user-menu-nav">
            <Link href="/perfil" className="admin-user-menu-item" onClick={() => setOpen(false)}>
              👤 Perfil
            </Link>
            <Link href="/minha-area" className="admin-user-menu-item" onClick={() => setOpen(false)}>
              🧭 Minha área
            </Link>
            <Link href="/admin/painel" className="admin-user-menu-item" onClick={() => setOpen(false)}>
              🛠️ Painel
            </Link>
            <Link href="/" className="admin-user-menu-item" onClick={() => setOpen(false)}>
              🌐 Ver site
            </Link>

            <div className="admin-user-menu-controls">
              <div className="admin-user-menu-controls-label">Tema</div>
              <div className="admin-user-menu-controls-row">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="site-icon-toggle"
                  title={theme === "light" ? copy.header.themeLight : copy.header.themeDark}
                  aria-label={theme === "light" ? copy.header.themeLight : copy.header.themeDark}
                >
                  {theme === "light" ? (
                    <MoonIcon className="site-icon-toggle-svg" />
                  ) : (
                    <SunIcon className="site-icon-toggle-svg" />
                  )}
                </button>
              </div>
            </div>

            <a
              href="/logout"
              className="admin-user-menu-item admin-user-menu-item-logout"
              onClick={() => {
                clearUserData();
                setOpen(false);
              }}
            >
              🚪 Sair
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
