import Link from 'next/link';
import { getNomeMes, getProximaQuinta, formatarDataLonga } from '@/lib/escalas/datas';
import { getCachedAdminDashboardSummary } from '@/lib/admin/dashboard';

export const metadata = {
  title: 'Dashboard - Admin GEEF',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const {
    totalPessoas,
    totalFuncoes,
    totalTemas,
    totalEscalasPublicadas,
    escalaMesAtual,
    mesAtual,
    anoAtual,
  } = await getCachedAdminDashboardSummary();

  const proximaQuinta = getProximaQuinta();
  const summaryCards = [
    { label: 'Pessoas ativas', value: totalPessoas },
    { label: 'Funções', value: totalFuncoes },
    { label: 'Temas doutrinários', value: totalTemas },
    { label: 'Escalas publicadas', value: totalEscalasPublicadas },
  ];

  return (
    <div className="admin-dashboard-page">
      <section className="admin-page-header admin-card admin-page-header--hero">
        <div className="admin-page-header-copy">
          <span className="admin-dashboard-kicker">ERP GEEF</span>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Um painel mais calmo e intuitivo para acompanhar a operação e chegar rápido às rotinas principais.
          </p>
          <div className="admin-page-header-chips">
            <span className="admin-inline-pill">{getNomeMes(mesAtual)} / {anoAtual}</span>
            <span className="admin-inline-pill">Próxima reunião: {formatarDataLonga(proximaQuinta)}</span>
          </div>
        </div>

        <div className="admin-actions">
          <Link href="/admin/pessoas/nova" className="admin-btn admin-btn-primary">
            ➕ Nova pessoa
          </Link>
          <Link href="/admin/escalas/nova" className="admin-btn admin-btn-secondary">
            📅 Nova escala
          </Link>
        </div>
      </section>

      <section className="admin-dashboard-hero">
        <div className="admin-card admin-dashboard-panel admin-dashboard-panel--highlight">
          <div className="admin-dashboard-status">Operação ativa</div>
          <h2>Gestão com leitura rápida e ações diretas.</h2>
          <p>
            O painel concentra os indicadores mais usados, mantendo a navegação
            pronta para a rotina administrativa e a atualização de conteúdo.
          </p>

          <div className="admin-dashboard-actions">
            <Link href="/admin/pessoas" className="admin-btn admin-btn-secondary">
              👥 Ver pessoas
            </Link>
            <Link href="/admin/escalas" className="admin-btn admin-btn-secondary">
              📋 Ver escalas
            </Link>
            <Link href="/admin/funcoes" className="admin-btn admin-btn-secondary">
              🎯 Funções
            </Link>
            <Link href="/admin/financeiro" className="admin-btn admin-btn-secondary">
              💰 Financeiro
            </Link>
          </div>
        </div>

        <div className="admin-card admin-dashboard-panel admin-subtle-card">
          <span className="admin-inline-pill">Resumo do mês</span>
          <div className="admin-card-grid admin-metric-grid">
            {summaryCards.map((card) => (
              <div key={card.label} className="admin-card admin-stat-card">
                <p className="admin-stat-value">{card.value}</p>
                <p className="admin-stat-label">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-card">
          <div className="admin-section-heading">
            <span className="admin-dashboard-kicker">Rotina</span>
            <h2>Ações rápidas</h2>
            <p>Atalhos diretos para os fluxos que mais começam o trabalho do dia.</p>
          </div>

          <div className="admin-quick-grid">
            <Link href="/admin/pessoas/nova" className="admin-btn admin-btn-primary">
              ➕ Adicionar Pessoa
            </Link>

            <Link href="/admin/funcoes" className="admin-btn admin-btn-secondary">
              🎯 Gerenciar Funções
            </Link>

            <Link href="/admin/funcoes/temas" className="admin-btn admin-btn-secondary">
              📚 Gerenciar Temas
            </Link>

            <Link href="/admin/escalas/nova" className="admin-btn admin-btn-primary">
              📅 Nova Escala
            </Link>
          </div>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-dashboard-lower-grid">
          <div className="admin-card">
            <div className="admin-section-heading">
              <span className="admin-dashboard-kicker">Escala do mês</span>
              <h2>{getNomeMes(mesAtual)} / {anoAtual}</h2>
              <p>Visão rápida do estado atual para reduzir navegação desnecessária.</p>
            </div>

            {escalaMesAtual ? (
              <div className="admin-status-panel">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="admin-status-chip" data-status={escalaMesAtual.status}>
                    {escalaMesAtual.status === 'publicada'
                      ? '✅ Publicada'
                      : escalaMesAtual.status === 'revisada'
                        ? '⏳ Em Revisão'
                        : '📝 Rascunho'}
                  </span>
                </p>

                <Link href={`/admin/escalas/${escalaMesAtual.id}`} className="admin-btn admin-btn-secondary">
                  ✏️ Editar Escala →
                </Link>
              </div>
            ) : (
              <div className="admin-empty-state">
                <p>Nenhuma escala criada para este mês.</p>
                <Link href="/admin/escalas/nova" className="admin-btn admin-btn-primary">
                  ➕ Criar Escala
                </Link>
              </div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-section-heading">
              <span className="admin-dashboard-kicker">Próxima reunião</span>
              <h2>Quinta-feira</h2>
              <p>A data ajuda a priorizar o que precisa ser revisado agora.</p>
            </div>

            <div className="admin-next-meeting">
              <p className="admin-next-meeting-date">
                {formatarDataLonga(proximaQuinta)}
              </p>
              <div className="admin-next-meeting-actions">
                <Link href="/admin/escalas" className="admin-btn admin-btn-secondary">
                  📅 Ver escalas
                </Link>
                <Link href="/admin/pessoas" className="admin-btn admin-btn-secondary">
                  👥 Ver pessoas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-card">
          <div className="admin-section-heading">
            <span className="admin-dashboard-kicker">Próximos passos</span>
            <h2>Leitura rápida da operação</h2>
            <p>Um resumo para abrir a rotina sem poluir a tela com blocos repetidos.</p>
          </div>

          <div className="admin-summary-strip">
            {summaryCards.map((card) => (
              <div className="admin-summary-item" key={card.label}>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
