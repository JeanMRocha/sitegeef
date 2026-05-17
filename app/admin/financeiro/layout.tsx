import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Financeiro - Admin GEEF',
};

export default function FinanceiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_financeiro"
      profiles={['financeiro']}
      redirectPath="/admin/financeiro"
      title="Financeiro"
    >
      {children}
    </AdminModuleGate>
  );
}
