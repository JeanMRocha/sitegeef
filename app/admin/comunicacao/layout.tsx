import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Comunicação - Admin GEEF',
};

export default function ComunicacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['comunicacao', 'secretaria']}
      redirectPath="/admin/comunicacao"
      title="Comunicação"
    >
      {children}
    </AdminModuleGate>
  );
}
