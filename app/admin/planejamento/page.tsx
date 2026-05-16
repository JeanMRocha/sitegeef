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
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Planejamento Estratégico</h1>
          <p className="admin-page-subtitle">Gestão de metas, objetivos e ações</p>
        </div>
        <Link href="/admin/planejamento/nova-meta" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Meta
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Metas Ativas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {ativas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Metas Concluídas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {concluidas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {metas.length}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Todas as Metas</h2>

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
                    <td style={{ fontWeight: 500, maxWidth: '200px' }}>
                      {meta.objetivo}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {meta.responsavel?.nome || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#e5e5e5', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: '#3b82f6', width: `${meta.andamento || 0}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', minWidth: '30px' }}>{meta.andamento || 0}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {meta.prazo ? new Date(meta.prazo).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: meta.status === 'planejada' ? 'rgba(107, 114, 128, 0.1)' : meta.status === 'em_execucao' ? 'rgba(59, 130, 246, 0.1)' : meta.status === 'atrasada' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: meta.status === 'planejada' ? '#6b7280' : meta.status === 'em_execucao' ? '#3b82f6' : meta.status === 'atrasada' ? '#ef4444' : '#22c55e',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {meta.status === 'planejada' && '📋 Planejada'}
                        {meta.status === 'em_execucao' && '▶ Em Execução'}
                        {meta.status === 'atrasada' && '⚠️ Atrasada'}
                        {meta.status === 'concluida' && '✓ Concluída'}
                        {meta.status === 'cancelada' && '✕ Cancelada'}
                        {meta.status === 'suspensa' && '⏸️ Suspensa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/planejamento/${meta.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma meta cadastrada.</p>
        )}
      </div>
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
