import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Atendimento - Admin GEEF',
};

export default async function AtendimentoLayout({
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
    console.error('Falha ao obter usuário autenticado no AtendimentoLayout:', error);
    redirect('/login?next=/admin/atendimento');
  }

  if (!user) {
    redirect('/login?next=/admin/atendimento');
  }

  return children;
}
