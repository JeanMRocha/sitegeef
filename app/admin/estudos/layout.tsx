import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Estudos - Admin GEEF',
};

export default function EstudosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['coord_estudos']}
      redirectPath="/admin/estudos"
      title="Estudos"
    >
      {children}
    </AdminModuleGate>
  );
}
