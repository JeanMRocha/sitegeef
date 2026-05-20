'use client';

import Link from 'next/link';
import { clearUserData } from '@/hooks/useUserPersistence';

interface AdminHeaderProps {
  user: {
    email?: string;
  };
  usuarioSistema: {
    perfil: string;
  };
}

export function AdminHeader({ user, usuarioSistema }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <Link href="/admin" className="admin-brand">
        <span className="admin-brand-icon">⚙️</span>
        <span className="admin-brand-text">
          <strong>GEEF</strong>
          <small>Admin</small>
        </span>
      </Link>

      <div className="admin-header-right">
        <div className="admin-user-info">
          <span className="admin-user-email">{user.email}</span>
          <span className="admin-user-role">{usuarioSistema.perfil}</span>
        </div>

        <a
          href="/logout"
          onClick={() => clearUserData()}
          className="admin-logout-btn"
        >
          Sair
        </a>
      </div>
    </header>
  );
}
