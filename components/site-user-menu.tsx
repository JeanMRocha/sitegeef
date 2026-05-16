"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { UserIcon } from "@/components/site-icons";

type SiteUserMenuProps = {
  userEmail?: string | null;
  nomeCompleto?: string | null;
  avatarUrl?: string | null;
  hasAdminAccess?: boolean;
};

export function SiteUserMenu({
  userEmail,
  nomeCompleto,
  avatarUrl,
  hasAdminAccess = false,
}: SiteUserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={rootRef} className="site-user-menu">
      <button
        type="button"
        className="site-user-menu-trigger site-nav-icon"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menu do usuário"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nomeCompleto || "Avatar"}
            className="site-nav-avatar"
            width={24}
            height={24}
          />
        ) : (
            <span className="site-nav-avatar-initial">{initial}</span>
          )}
      </button>

      {open ? (
        <div className="site-user-menu-popover" role="menu" aria-label="Menu do usuário">
          <div className="site-user-menu-info">
            <strong>{nomeCompleto || "Usuário"}</strong>
            <span>{userEmail}</span>
          </div>

          <Link href="/minha-area" className="site-user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            Minha Área
          </Link>

          {hasAdminAccess ? (
            <Link href="/admin" className="site-user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          ) : null}

          <form action={signOut} className="site-user-menu-form">
            <button type="submit" className="site-user-menu-item site-user-menu-logout">
              Logout
            </button>
          </form>
        </div>
      ) : null}

      <span className="sr-only">Menu do usuário</span>
    </div>
  );
}
