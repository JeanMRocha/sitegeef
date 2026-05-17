import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Patrimônio - Admin GEEF',
};

export default function PatrimonioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_financeiro"
      profiles={['patrimonio']}
      redirectPath="/admin/patrimonio"
      title="Patrimônio"
    >
      {children}
    </AdminModuleGate>
  );
}
