import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Migrations - Admin GEEF',
};

export default function MigrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      adminOnly
      redirectPath="/admin/sistema"
      title="Migrations"
    >
      {children}
    </AdminModuleGate>
  );
}
