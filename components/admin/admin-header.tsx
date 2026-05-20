'use client';

import Link from 'next/link';
import { clearUserData } from '@/hooks/useUserPersistence';

interface AdminHeaderProps {
  user: {
    email?: string;
    fullName?: string;
  };
  usuarioSistema: {
    perfil: string;
  };
}

function getInitials(value?: string) {
  if (!value) {
    return 'GE';
  }

  const parts = value.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join('');
  return (initials || value.slice(0, 2)).toUpperCase();
}

export function AdminHeader({ user, usuarioSistema }: AdminHeaderProps) {
  const displayName = user.fullName || user.email || 'Usuário';
  const initials = getInitials(displayName);
  const roleLabel = usuarioSistema.perfil === 'administrador'
    ? 'Administrador'
    : usuarioSistema.perfil;

  return (
    <header className="admin-header">
      <Link href="/admin" className="admin-brand">
        <span className="admin-brand-icon">⚙️</span>
        <span className="admin-brand-text">
          <span className="admin-brand-kicker">Área interna</span>
          <strong>GEEF</strong>
          <small>Painel de operação</small>
        </span>
      </Link>

      <div className="admin-header-middle">
        <span className="admin-header-kicker">Gestão institucional</span>
        <strong>Fluxo moderno, leitura rápida e ações diretas.</strong>
        <p>Rotinas administrativas, conteúdo e acompanhamento em um único lugar.</p>
      </div>

      <div className="admin-header-right">
        <div className="admin-user-card">
          <div className="admin-user-avatar">{initials}</div>
          <div className="admin-user-meta">
            <span className="admin-user-email">{displayName}</span>
            {user.email && user.email !== displayName && (
              <span className="admin-user-subline">{user.email}</span>
            )}
            <span className="admin-user-role">{roleLabel}</span>
          </div>
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
