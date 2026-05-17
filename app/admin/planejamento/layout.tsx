import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Planejamento - Admin GEEF',
};

export default function PlanejamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['diretoria']}
      redirectPath="/admin/planejamento"
      title="Planejamento"
    >
      {children}
    </AdminModuleGate>
  );
}
