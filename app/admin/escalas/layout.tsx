import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Escalas - Admin GEEF',
};

export default function EscalasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_escalas"
      profiles={['coord_passe']}
      redirectPath="/admin/escalas"
      title="Escalas"
    >
      {children}
    </AdminModuleGate>
  );
}
