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
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin/atendimento');
  }

  return children;
}
