'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminShellArea } from '@/components/admin/use-admin-shell-area';
import { AdminUserMenu } from '@/components/admin/admin-user-menu';

interface AdminHeaderProps {
  user: {
    email?: string;
    fullName?: string;
  };
}

const AREA_ROUTES: Record<string, string> = {
  painel: '/admin',
  geef: '/admin/geef',
  pessoas: '/admin/pessoas',
  governanca: '/admin/governanca',
  documentos: '/admin/documentos',
  operacao: '/admin/atendimento',
  sistema: '/admin/observability',
};

export function AdminHeader({ user }: AdminHeaderProps) {
  const displayName = user.fullName || user.email || 'Usuário';
  const { area, setSelectedArea, areas } = useAdminShellArea();
  const router = useRouter();

  const handleAreaChange = (areaKey: string) => {
    setSelectedArea(areaKey as any);
    const route = AREA_ROUTES[areaKey];
    if (route) {
      router.push(route);
    }
  };

  return (
    <header className="admin-header">
      <Link href="/admin" className="admin-brand">
      </Link>

      <div className="admin-header-middle">
        <div className="admin-shell-tabs" aria-label="Seções do painel">
          {areas.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleAreaChange(item.key)}
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
