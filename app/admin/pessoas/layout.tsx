import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Tarefeiros - Admin GEEF',
};

export default function PessoasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_pessoas"
      profiles={['diretoria', 'secretaria']}
      redirectPath="/admin/pessoas"
      title="Tarefeiros"
    >
      {children}
    </AdminModuleGate>
  );
}
