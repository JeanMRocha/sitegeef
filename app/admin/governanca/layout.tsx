import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Governança - Admin GEEF',
};

export default function GovernancaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_pessoas"
      profiles={['diretoria', 'secretaria']}
      redirectPath="/admin/governanca"
      title="Governança"
    >
      {children}
    </AdminModuleGate>
  );
}
