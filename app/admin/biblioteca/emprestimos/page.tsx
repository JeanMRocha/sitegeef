import Link from 'next/link';
import { getEmprestimos, getHistoricoEmprestimos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Empréstimos - Admin GEEF',
};

async function EmprestimosList({ searchParams }: { searchParams: { page?: string; view?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const view = searchParams.view || 'ativos';

  let data;
  if (view === 'ativos') {
    data = await getEmprestimos(page);
  } else {
    data = await getHistoricoEmprestimos(page);
  }

  const totalPages = Math.ceil(data.total / data.pageSize);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Empréstimos</h1>
          <p className="admin-page-subtitle">Gerenciamento de empréstimos e devoluções</p>
        </div>
        {view === 'ativos' && (
          <Link href="/admin/biblioteca/emprestimos/novo" className="admin-btn admin-btn-primary">
            ➕ Novo Empréstimo
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
        <Link
          href="/admin/biblioteca/emprestimos?view=ativos"
          style={{
            paddingBottom: '0.5rem',
            borderBottom: view === 'ativos' ? '2px solid var(--primary)' : 'none',
            color: view === 'ativos' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: view === 'ativos' ? 600 : 400,
            textDecoration: 'none',
          }}
        >
          📤 Empréstimos Ativos
        </Link>
        <Link
          href="/admin/biblioteca/emprestimos?view=historico"
          style={{
            paddingBottom: '0.5rem',
            borderBottom: view === 'historico' ? '2px solid var(--primary)' : 'none',
            color: view === 'historico' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: view === 'historico' ? 600 : 400,
            textDecoration: 'none',
          }}
        >
          ✓ Histórico de Devoluções
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {data.emprestimos && data.emprestimos.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Obra</th>
                <th>Código</th>
                {view === 'ativos' ? (
                  <>
                    <th>Data Retirada</th>
                    <th>Prazo Devolução</th>
                    <th>Status</th>
                  </>
                ) : (
                  <>
                    <th>Data Retirada</th>
                    <th>Data Devolução</th>
                  </>
                )}
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {data.emprestimos.map((emprestimo: any) => {
                const vencido = emprestimo.prazo_devolucao < today;
                return (
                  <tr key={emprestimo.id}>
                    <td style={{ fontWeight: 500 }}>{emprestimo.pessoas?.nome}</td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {emprestimo.exemplares?.obra?.titulo}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {emprestimo.exemplares?.codigo}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(emprestimo.data_retirada + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: vencido && view === 'ativos' ? '#c00' : 'var(--text)' }}>
                      {new Date(emprestimo.prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
                      {vencido && view === 'ativos' && ' ⚠️'}
                    </td>
                    <td>
                      {view === 'ativos' && (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.7rem',
                            backgroundColor: vencido ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                            color: vencido ? '#ef4444' : '#f97316',
                            borderRadius: '0.4rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          {vencido ? 'Vencido' : 'Em aberto'}
                        </span>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/admin/biblioteca/emprestimos/${emprestimo.id}`}
                        className="admin-btn admin-btn-small"
                      >
                        {view === 'ativos' ? '📥 Devolver' : '✏️ Ver'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>
              {view === 'ativos'
                ? 'Nenhum empréstimo ativo.'
                : 'Nenhum histórico de devolução.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
          {page > 1 && (
            <Link
              href={`/admin/biblioteca/emprestimos?page=${page - 1}&view=${view}`}
              className="admin-btn admin-btn-secondary"
            >
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/biblioteca/emprestimos?page=${page + 1}&view=${view}`}
              className="admin-btn admin-btn-secondary"
            >
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function EmprestimosPage({ searchParams }: { searchParams: { page?: string; view?: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EmprestimosList searchParams={searchParams} />
    </Suspense>
  );
}
