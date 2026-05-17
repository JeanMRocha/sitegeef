import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Mediunidade - Admin GEEF',
};

export default function MediunidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_mediunidade"
      profiles={['administrador']}
      redirectPath="/admin/mediunidade"
      title="Mediunidade"
    >
      {children}
    </AdminModuleGate>
  );
}
