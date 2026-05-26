import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Relatórios - Admin GEEF',
};

export default function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['diretoria', 'secretaria']}
      redirectPath="/admin/operacao"
      title="Relatórios"
    >
      {children}
    </AdminModuleGate>
  );
}
