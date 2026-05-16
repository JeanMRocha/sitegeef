import Link from 'next/link';
import { getEvangelhasNoLar } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Evangelho no Lar - Admin GEEF',
};

async function EvangelhasContent() {
  const evangelhos = await getEvangelhasNoLar();

  const situacoes: { [key: string]: { label: string; color: string } } = {
    'planejada': { label: '📋 Planejada', color: '#3b82f6' },
    'realizada': { label: '✓ Realizada', color: '#22c55e' },
    'adiada': { label: '⏸️ Adiada', color: '#f97316' },
    'cancelada': { label: '❌ Cancelada', color: '#ef4444' },
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Evangelho no Lar</h1>
          <p className="admin-page-subtitle">Atividades de evangelização familiar</p>
        </div>
        <Link href="/admin/atendimento/evangelhos-lar/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Evangelho
        </Link>
      </div>

      {/* Tabela */}
      <div className="admin-card">
        {evangelhos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pessoa</th>
                  <th>Endereço</th>
                  <th>Equipe</th>
                  <th>Situação</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {evangelhos.map((ev: any) => {
                  const sit = situacoes[ev.situacao] || { label: ev.situacao, color: '#999' };
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {new Date(ev.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {ev.pessoas?.nome}
                      </td>
                      <td style={{ fontSize: '0.9rem' }}>
                        {ev.endereco}
                      </td>
                      <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                        {ev.equipe}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.6rem',
                          backgroundColor: `${sit.color}20`,
                          color: sit.color,
                          borderRadius: '0.3rem',
                          fontSize: '0.85rem',
                        }}>
                          {sit.label}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/atendimento/evangelhos-lar/${ev.id}`} className="admin-btn admin-btn-small">
                          ✏️ Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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
            <p>Nenhum evangelho no lar registrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvangelhasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EvangelhasContent />
    </Suspense>
  );
}
