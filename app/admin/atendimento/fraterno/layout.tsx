import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkPermission } from '@/lib/auth/permissions';
import { AccessDenied } from '@/components/admin/access-denied';

export const metadata = {
  title: 'Atendimento Fraterno - Admin GEEF',
};

export default async function FraternoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin/atendimento/fraterno');
  }

  const allowed = await checkPermission('pode_atendimento');

  if (!allowed) {
    return <AccessDenied title="Atendimento Fraterno" message="Acesso negado" />;
  }

  return children;
}
