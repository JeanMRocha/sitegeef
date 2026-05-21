'use client';

import Link from 'next/link';
import { useAdminShellArea } from '@/components/admin/use-admin-shell-area';
import { AdminUserMenu } from '@/components/admin/admin-user-menu';

interface AdminHeaderProps {
  user: {
    email?: string;
    fullName?: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const displayName = user.fullName || user.email || 'Usuário';
  const { area, setSelectedArea, areas } = useAdminShellArea();

  return (
    <header className="admin-header">
      <Link href="/admin" className="admin-brand">
        <span className="admin-brand-icon">⚙️</span>
      </Link>

      <div className="admin-header-middle">
        <div className="admin-shell-tabs" aria-label="Seções do painel">
          {areas.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedArea(item.key)}
              className={`admin-shell-tab ${area === item.key ? 'active' : ''}`}
              aria-pressed={area === item.key}
              title={item.note}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-header-right">
        <AdminUserMenu email={user.email} fullName={displayName} />
      </div>
    </header>
  );
}
