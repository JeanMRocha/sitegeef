import Link from 'next/link';
import { getCampanhas } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Campanhas APSE - Admin GEEF',
};

async function CampanhasContent() {
  const campanhas = await getCampanhas();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Campanhas APSE</h1>
          <p className="admin-page-subtitle">Gestão de campanhas de assistência social</p>
        </div>
        <Link href="/admin/apse/campanhas/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Campanha
        </Link>
      </div>

      <div className="admin-card">
        {campanhas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Meta</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {campanhas.map((campanha: any) => (
                  <tr key={campanha.id}>
                    <td style={{ fontWeight: 500 }}>
                      {campanha.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {campanha.descricao || '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {campanha.meta || '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {campanha.data_inicio ? new Date(campanha.data_inicio).toLocaleDateString('pt-BR') : '—'} a {campanha.data_fim ? new Date(campanha.data_fim).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: campanha.status === 'planejada' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: campanha.status === 'planejada' ? '#a855f7' : '#3b82f6',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {campanha.status === 'planejada' ? '📋 Planejada' : '▶ Em execução'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/apse/campanhas/${campanha.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma campanha cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default function CampanhasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CampanhasContent />
    </Suspense>
  );
}
