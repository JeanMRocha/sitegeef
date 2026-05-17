import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'APSE - Admin GEEF',
};

export default function ApseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_apse"
      profiles={['coord_apse']}
      redirectPath="/admin/apse"
      title="APSE"
    >
      {children}
    </AdminModuleGate>
  );
}
