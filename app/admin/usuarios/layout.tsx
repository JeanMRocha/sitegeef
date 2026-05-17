import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Usuários - Admin GEEF',
};

export default function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_pessoas"
      profiles={['diretoria', 'secretaria']}
      redirectPath="/admin/usuarios"
      title="Usuários e Permissões"
    >
      {children}
    </AdminModuleGate>
  );
}
