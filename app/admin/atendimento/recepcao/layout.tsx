import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Recepção - Admin GEEF',
};

export default function RecepcaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_atendimento"
      profiles={['coord_atendimento']}
      redirectPath="/admin/atendimento/recepcao"
      title="Recepção"
    >
      {children}
    </AdminModuleGate>
  );
}
