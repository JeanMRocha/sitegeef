import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkPermission } from '@/lib/auth/permissions';
import { AccessDenied } from '@/components/admin/access-denied';

export const metadata = {
  title: 'Mediunidade - Admin GEEF',
};

export default async function MediunidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin/mediunidade');
  }

  const allowed = await checkPermission('pode_mediunidade');

  if (!allowed) {
    return <AccessDenied title="Mediunidade" message="Acesso negado" />;
  }

  return children;
}
