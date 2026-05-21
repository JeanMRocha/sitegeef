import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { withTimeout } from '@/lib/admin/safe-supabase';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { NotificationFlashBridge } from '@/components/notification-flash-bridge';
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
  let user = null;

  try {
    const authResult = await withTimeout(
      supabase.auth.getUser() as Promise<any>,
      4500,
      { data: { user: null }, error: null } as any,
    );
    user = authResult.data.user;
  } catch (error) {
    console.error('Falha ao obter usuário autenticado no AdminLayout:', error);
    redirect('/login?next=/admin');
  }

  if (!user) {
    redirect('/login?next=/admin');
  }

  const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;
  const isAdminViaAuth = appMetadata.site_role === 'administrador';

  // Verificar se o usuário tem acesso ao admin
  let usuarioSistema = null;

  try {
    const { data, error } = await withTimeout(
      supabase
        .from('usuarios_sistema')
        .select('perfil, pode_mediunidade, pode_escalas, pode_biblioteca, pode_livraria, pode_financeiro, pode_pessoas, pode_publicar, pode_atendimento, pode_apse')
        .eq('id', user.id)
        .maybeSingle(),
      4500,
      { data: null, error: null } as any,
    );

    if (!error) {
      usuarioSistema = data;
    }
  } catch (error) {
    usuarioSistema = null;
  }

  if (!usuarioSistema && !isAdminViaAuth) {
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

  const resolvedUsuarioSistema = usuarioSistema ?? {
    perfil: 'administrador',
    pode_mediunidade: appMetadata.pode_mediunidade === true,
    pode_escalas: appMetadata.pode_escalas === true,
    pode_biblioteca: appMetadata.pode_biblioteca === true,
    pode_livraria: appMetadata.pode_livraria === true,
    pode_financeiro: appMetadata.pode_financeiro === true,
    pode_pessoas: appMetadata.pode_pessoas === true,
    pode_publicar: appMetadata.pode_publicar === true,
    pode_atendimento: appMetadata.pode_atendimento === true,
    pode_apse: appMetadata.pode_apse === true,
  };

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    'Usuário';

  return (
    <div className="admin-layout">
      <Suspense fallback={null}>
        <NotificationFlashBridge />
      </Suspense>
      <AdminHeader
        user={{ email: user.email, fullName: displayName }}
      />
      <div className="admin-container">
        <AdminSidebar usuarioSistema={resolvedUsuarioSistema} />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
