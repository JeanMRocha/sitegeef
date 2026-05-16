import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import '@/styles/admin.css';
import '@/styles/admin-sidebar.css';

export const metadata = {
  title: 'Admin - GEEF',
  description: 'Painel administrativo para gestão de escalas',
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin');
  }

  // Verificar se o usuário tem acesso ao admin
  const { data: usuarioSistema } = await supabase
    .from('usuarios_sistema')
    .select('perfil, pode_mediunidade, pode_escalas, pode_biblioteca, pode_livraria, pode_financeiro, pode_pessoas, pode_publicar, pode_atendimento, pode_apse')
    .eq('id', user.id)
    .single();

  if (!usuarioSistema) {
    return (
      <div className="admin-access-denied">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Acesso Negado</h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--muted)' }}>
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <a href="/" style={{ marginTop: '1rem', display: 'inline-block', color: 'var(--uva)' }}>
            Voltar para home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader user={user} usuarioSistema={usuarioSistema} />
      <div className="admin-container">
        <AdminSidebar podeMediunidade={usuarioSistema.pode_mediunidade} />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
