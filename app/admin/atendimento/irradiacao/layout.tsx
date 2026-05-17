import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Irradiação - Admin GEEF',
};

export default function IrradiacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_atendimento"
      profiles={['coord_passe']}
      redirectPath="/admin/atendimento/irradiacao"
      title="Irradiação"
    >
      {children}
    </AdminModuleGate>
  );
}
