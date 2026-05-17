import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Atendimento - Admin GEEF',
};

export default function AtendimentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_atendimento"
      profiles={['coord_atendimento', 'coord_passe']}
      redirectPath="/admin/atendimento"
      title="Atendimento Espiritual"
    >
      {children}
    </AdminModuleGate>
  );
}
