import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Funções - Admin GEEF',
};

export default function FuncoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_escalas"
      profiles={['coord_passe']}
      redirectPath="/admin/funcoes"
      title="Funções"
    >
      {children}
    </AdminModuleGate>
  );
}
