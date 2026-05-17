import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Fix Usuários - Admin GEEF',
};

export default function FixUsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      adminOnly
      redirectPath="/admin/fix-usuarios"
      title="Fix Usuários"
    >
      {children}
    </AdminModuleGate>
  );
}
