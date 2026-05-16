import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getQuintasFeiras, getNomeMes, getProximaQuinta } from '@/lib/escalas/datas';
import { formatarDataLonga } from '@/lib/escalas/datas';

export const metadata = {
  title: 'Dashboard - Admin GEEF',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const [pessoasResult, funcoesResult, temasResult, escalasResult] = await Promise.all([
    supabase.from('pessoas').select('id', { count: 'exact' }).eq('ativo', true),
    supabase.from('funcoes').select('id', { count: 'exact' }).eq('ativo', true),
    supabase.from('temas_doutrinarios').select('id', { count: 'exact' }).eq('ativo', true),
    supabase.from('escalas_mensais').select('id', { count: 'exact' }).eq('status', 'publicada'),
  ]);

  const totalPessoas = pessoasResult.count || 0;
  const totalFuncoes = funcoesResult.count || 0;
  const totalTemas = temasResult.count || 0;
  const totalEscalasPublicadas = escalasResult.count || 0;

  // Get próxima quinta
  const proximaQuinta = getProximaQuinta();

  // Get current month escalas
  const agora = new Date();
  const mesAtual = agora.getMonth() + 1;
  const anoAtual = agora.getFullYear();

  const { data: escalaMesAtual } = await supabase
    .from('escalas_mensais')
    .select('id, status')
    .eq('mes', mesAtual)
    .eq('ano', anoAtual)
    .single();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Bem-vindo ao painel administrativo do GEEF
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-card-grid">
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{totalPessoas}</p>
          <p className="admin-stat-label">Pessoas Ativas</p>
        </div>

        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{totalFuncoes}</p>
          <p className="admin-stat-label">Funções</p>
        </div>

        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{totalTemas}</p>
          <p className="admin-stat-label">Temas Doutrinários</p>
        </div>

        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{totalEscalasPublicadas}</p>
          <p className="admin-stat-label">Escalas Publicadas</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: 'var(--text)' }}>
          Ações Rápidas
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link href="/admin/pessoas/nova" className="admin-btn admin-btn-primary">
            ➕ Adicionar Pessoa
          </Link>

          <Link href="/admin/funcoes" className="admin-btn admin-btn-secondary">
            🎯 Gerenciar Funções
          </Link>

          <Link href="/admin/temas" className="admin-btn admin-btn-secondary">
            📚 Gerenciar Temas
          </Link>

          <Link href="/admin/escalas/nova" className="admin-btn admin-btn-primary">
            📅 Nova Escala
          </Link>
        </div>
      </div>

      {/* Current Month */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: 'var(--text)' }}>
          {getNomeMes(mesAtual)} / {anoAtual}
        </h2>

        {escalaMesAtual ? (
          <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: '0.6rem' }}>
            <p style={{ margin: '0 0 0.5rem' }}>
              <strong>Status:</strong>{' '}
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor:
                    escalaMesAtual.status === 'publicada'
                      ? 'rgba(99, 213, 31, 0.2)'
                      : escalaMesAtual.status === 'revisada'
                        ? 'rgba(255, 193, 7, 0.2)'
                        : 'rgba(158, 158, 158, 0.2)',
                  color:
                    escalaMesAtual.status === 'publicada'
                      ? 'var(--leaf)'
                      : escalaMesAtual.status === 'revisada'
                        ? '#f57f17'
                        : 'var(--muted)',
                }}
              >
                {escalaMesAtual.status === 'publicada'
                  ? '✅ Publicada'
                  : escalaMesAtual.status === 'revisada'
                    ? '⏳ Em Revisão'
                    : '📝 Rascunho'}
              </span>
            </p>

            <Link href={`/admin/escalas/${escalaMesAtual.id}`} className="admin-btn admin-btn-secondary" style={{ marginTop: '0.75rem' }}>
              ✏️ Editar Escala →
            </Link>
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'rgba(99, 213, 31, 0.06)', borderRadius: '0.6rem' }}>
            <p style={{ margin: '0 0 0.75rem', color: 'var(--muted)' }}>
              Nenhuma escala criada para este mês.
            </p>
            <Link href="/admin/escalas/nova" className="admin-btn admin-btn-primary">
              ➕ Criar Escala
            </Link>
          </div>
        )}
      </div>

      {/* Próxima Reunião */}
      <div className="admin-card">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: 'var(--text)' }}>
          Próxima Reunião
        </h2>

        <div style={{ padding: '1rem', background: 'var(--bg-alt)', borderRadius: '0.6rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--uva)' }}>
            {formatarDataLonga(proximaQuinta)}
          </p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            Quinta-feira
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
          <Link href="/admin/escalas" className="admin-btn admin-btn-secondary">
            📅 Ver Escalas
          </Link>
          <Link href="/admin/pessoas" className="admin-btn admin-btn-secondary">
            👥 Ver Pessoas
          </Link>
        </div>
      </div>
    </div>
  );
}
