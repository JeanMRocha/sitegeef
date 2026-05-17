import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Evangelização - Admin GEEF',
};

export default function EvangelizacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['evangelizador']}
      redirectPath="/admin/evangelizacao"
      title="Evangelização"
    >
      {children}
    </AdminModuleGate>
  );
}
