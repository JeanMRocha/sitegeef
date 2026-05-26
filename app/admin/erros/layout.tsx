import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Observabilidade - Admin GEEF',
};

export default function ErrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      adminOnly
      redirectPath="/admin/sistema"
      title="Observabilidade"
    >
      {children}
    </AdminModuleGate>
  );
}
