import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Juventude - Admin GEEF',
};

export default function JuventudeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={['coord_juventude']}
      redirectPath="/admin/juventude"
      title="Juventude"
    >
      {children}
    </AdminModuleGate>
  );
}
