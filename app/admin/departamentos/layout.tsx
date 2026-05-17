import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Departamentos - Admin GEEF',
};

export default function DepartamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_pessoas"
      profiles={['diretoria', 'secretaria']}
      redirectPath="/admin/departamentos"
      title="Departamentos"
    >
      {children}
    </AdminModuleGate>
  );
}
