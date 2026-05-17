import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Instituição - Admin GEEF',
};

export default function InstituicaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_pessoas"
      profiles={['diretoria', 'secretaria']}
      redirectPath="/admin/instituicao"
      title="Instituição"
    >
      {children}
    </AdminModuleGate>
  );
}
