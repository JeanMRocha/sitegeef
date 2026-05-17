import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Reuniões Virtuais - Admin GEEF',
};

export default function ReunioesVirtuaisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['secretaria', 'diretoria']}
      redirectPath="/admin/reunioes-virtuais"
      title="Reuniões Virtuais"
    >
      {children}
    </AdminModuleGate>
  );
}
