import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Notificações - Admin GEEF',
};

export default function NotificacoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['secretaria', 'comunicacao']}
      redirectPath="/admin/notificacoes"
      title="Notificações"
    >
      {children}
    </AdminModuleGate>
  );
}
