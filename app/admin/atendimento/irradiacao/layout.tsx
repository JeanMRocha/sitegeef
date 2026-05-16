import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkPermission } from '@/lib/auth/permissions';
import { AccessDenied } from '@/components/admin/access-denied';

export const metadata = {
  title: 'Irradiação - Admin GEEF',
};

export default async function IrradiacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin/atendimento/irradiacao');
  }

  const allowed = await checkPermission('pode_atendimento');

  if (!allowed) {
    return <AccessDenied title="Irradiação" message="Acesso negado" />;
  }

  return children;
}
