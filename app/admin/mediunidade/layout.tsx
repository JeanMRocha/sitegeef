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
  let user = null;

  try {
    const authResult = await supabase.auth.getUser();
    user = authResult.data.user;
  } catch (error) {
    console.error('Falha ao obter usuário autenticado no MediunidadeLayout:', error);
    redirect('/login?next=/admin/mediunidade');
  }

  if (!user) {
    redirect('/login?next=/admin/mediunidade');
  }

  const allowed = await checkPermission('pode_mediunidade');

  if (!allowed) {
    return <AccessDenied title="Mediunidade" message="Acesso negado" />;
  }

  return children;
}
