import Link from 'next/link';
import { getMetas } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Planejamento - Admin GEEF',
};

async function PlanejamentoContent() {
  const metas = await getMetas();
  const ativas = metas.filter((m: any) => m.status === 'em_execucao' || m.status === 'planejada');
  const concluidas = metas.filter((m: any) => m.status === 'concluida');

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Gestão estratégica</p>
            <h1 className="area-hero-title">Planejamento</h1>
          </div>
          <Link href="/admin/planejamento/nova-meta" className="profile-form-btn profile-form-btn-primary">
            Nova Meta
          </Link>
        </div>
        <p className="area-subtitle">Gestão de metas, objetivos e ações.</p>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Metas ativas</span>
          <strong>{ativas.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Metas concluídas</span>
          <strong>{concluidas.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Total</span>
          <strong>{metas.length}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Todas as metas</h2>
          <p>Panorama de andamento, prazo e status de execução.</p>
        </div>
        <div className="table-surface">
          {metas.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Objetivo</th>
                    <th>Responsável</th>
                    <th>Andamento</th>
                    <th>Prazo</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {metas.map((meta: any) => (
                    <tr key={meta.id}>
                      <td style={{ fontWeight: 500, maxWidth: '220px' }}>{meta.objetivo}</td>
                      <td>{meta.responsavel?.nome || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', backgroundColor: 'var(--accent)', width: `${meta.andamento || 0}%` }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', minWidth: '30px' }}>{meta.andamento || 0}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>
                        {meta.prazo ? new Date(meta.prazo).toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td>
                        <span className={
                          meta.status === 'concluida'
                            ? 'inline-status inline-status-success'
                            : meta.status === 'atrasada'
                              ? 'inline-status inline-status-danger'
                              : meta.status === 'em_execucao'
                                ? 'inline-status inline-status-warning'
                                : 'inline-status'
                        }>
                          {meta.status === 'planejada' && 'Planejada'}
                          {meta.status === 'em_execucao' && 'Em execução'}
                          {meta.status === 'atrasada' && 'Atrasada'}
                          {meta.status === 'concluida' && 'Concluída'}
                          {meta.status === 'cancelada' && 'Cancelada'}
                          {meta.status === 'suspensa' && 'Suspensa'}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/planejamento/${meta.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="area-empty">Nenhuma meta cadastrada.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function PlanejamentoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PlanejamentoContent />
    </Suspense>
  );
}
