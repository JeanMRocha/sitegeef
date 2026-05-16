import Link from 'next/link';
import { getCriancas } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Crianças - Admin GEEF',
};

async function CriancasContent({ searchParams }: { searchParams: { turma?: string } }) {
  const criancas = await getCriancas(searchParams.turma);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Crianças</h1>
          <p className="admin-page-subtitle">Cadastro de crianças no programa de evangelização</p>
        </div>
        <Link href="/admin/evangelizacao/criancas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Criança
        </Link>
      </div>

      <div className="admin-card">
        {criancas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Turma</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {criancas.map((crianca: any) => (
                  <tr key={crianca.id}>
                    <td style={{ fontWeight: 500 }}>
                      {crianca.pessoa?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {crianca.turma?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {crianca.responsavel?.nome}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: crianca.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: crianca.status === 'ativa' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {crianca.status === 'ativa' ? '✓ Ativa' : '✕ Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/evangelizacao/criancas/${crianca.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
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
            <p>Nenhuma criança cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function CriancasPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CriancasContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

