import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Erros e Debug - Admin GEEF',
};

export default function ErrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      adminOnly
      redirectPath="/admin/erros"
      title="Observabilidade"
    >
      {children}
    </AdminModuleGate>
  );
}
