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
  const { area, areas, routes } = useAdminShellArea();

  return (
    <header className="admin-header">
      <Link href="/admin/painel" className="admin-brand">
      </Link>

      <div className="admin-header-middle">
        <div className="admin-shell-tabs" aria-label="Seções do painel">
          {areas.map((item) => (
            <Link
              key={item.key}
              href={routes[item.key]}
              className={`admin-shell-tab ${area === item.key ? 'active' : ''}`}
              aria-current={area === item.key ? 'page' : undefined}
              title={item.note}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-header-right">
        <AdminUserMenu email={user.email} fullName={displayName} />
      </div>
    </header>
  );
}
