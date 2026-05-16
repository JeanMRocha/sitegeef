import Link from 'next/link';
import { getIrradiacoes, toggleIrradiacaoStatus } from '../actions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata = {
  title: 'Irradiação - Admin GEEF',
};

async function handleToggle(id: string, ativa: boolean) {
  'use server';
  const { toggleIrradiacaoStatus: toggle } = await import('../actions');
  await toggle(id, ativa);
  redirect('/admin/atendimento/irradiacao');
}

async function IrradiacaoContent() {
  const irradiacoes = await getIrradiacoes();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Irradiação</h1>
          <p className="admin-page-subtitle">Solicitações de irradiação de preces</p>
        </div>
        <Link href="/admin/atendimento/irradiacao/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Solicitação
        </Link>
      </div>

      <div className="admin-card">
        {irradiacoes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome da Irradiação</th>
                  <th>Solicitante</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Privacidade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {irradiacoes.map((irr: any) => (
                  <tr key={irr.id}>
                    <td style={{ fontWeight: 500 }}>
                      {irr.nome_irradiacao}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {irr.pessoas?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {irr.periodo}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: irr.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: irr.status === 'ativa' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {irr.status === 'ativa' ? '✓ Ativa' : '✕ Encerrada'}
                      </span>
                    </td>
                    <td>
                      {irr.confidencial ? (
                        <span style={{ fontSize: '0.9rem', color: '#ef4444' }}>🔒 Confidencial</span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Público</span>
                      )}
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/atendimento/irradiacao/${irr.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                      <form action={() => handleToggle(irr.id, irr.status === 'ativa')}>
                        <button type="submit" className="admin-btn admin-btn-small" style={{
                          backgroundColor: irr.status === 'ativa' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          color: irr.status === 'ativa' ? '#ef4444' : '#22c55e',
                        }}>
                          {irr.status === 'ativa' ? '🔒' : '✓'}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--admin-bg)',
            borderRadius: '0.6rem',
            color: 'var(--muted)',
          }}>
            <p>Nenhuma irradiação registrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IrradiacaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <IrradiacaoContent />
    </Suspense>
  );
}
