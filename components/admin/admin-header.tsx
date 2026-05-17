 'use client';

import Link from 'next/link';
import { signOut } from '@/app/login/actions';

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

        <button
          onClick={async () => {
            await signOut();
          }}
          className="admin-logout-btn"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
