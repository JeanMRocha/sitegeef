import { AdminModuleGate } from '@/components/admin/admin-module-gate';

export const metadata = {
  title: 'Livraria - Admin GEEF',
};

export default function LivrariaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminModuleGate
      permission="pode_livraria"
      profiles={['livraria']}
      redirectPath="/admin/livraria"
      title="Livraria"
    >
      {children}
    </AdminModuleGate>
  );
}
