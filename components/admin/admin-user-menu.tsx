"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clearUserData } from "@/hooks/useUserPersistence";

type AdminUserMenuProps = {
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

export function AdminUserMenu({ email, fullName }: AdminUserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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
