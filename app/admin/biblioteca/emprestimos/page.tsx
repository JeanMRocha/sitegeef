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

  const emprestimos = view === 'ativos' ? (data as any).emprestimos : (data as any).historico;
  const totalPages = Math.ceil((data as any).total / (data as any).pageSize);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Circulação</p>
            <h1 className="area-hero-title">Empréstimos</h1>
          </div>
          {view === 'ativos' && (
            <Link href="/admin/biblioteca/emprestimos/novo" className="profile-form-btn profile-form-btn-primary">
              Novo Empréstimo
            </Link>
          )}
        </div>
        <p className="area-subtitle">Gerenciamento de empréstimos e devoluções.</p>
      </section>

      <section className="area-section">
        <div className="area-panel-grid">
          <Link href="/admin/biblioteca/emprestimos?view=ativos" className="module-card" style={view === 'ativos' ? { borderColor: 'var(--accent)' } : undefined}>
            <h3 className="module-title">Empréstimos ativos</h3>
            <p>Itens em circulação e prazos em aberto.</p>
          </Link>
          <Link href="/admin/biblioteca/emprestimos?view=historico" className="module-card" style={view === 'historico' ? { borderColor: 'var(--accent)' } : undefined}>
            <h3 className="module-title">Histórico de devoluções</h3>
            <p>Empréstimos já encerrados.</p>
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {emprestimos && emprestimos.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pessoa</th>
                  <th>Obra</th>
                  <th>Código</th>
                  <th>Data retirada</th>
                  {view === 'ativos' ? <th>Prazo devolução</th> : <th>Data devolução</th>}
                  {view === 'ativos' && <th>Status</th>}
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {emprestimos.map((emprestimo: any) => {
                  const vencido = emprestimo.prazo_devolucao < today;
                  return (
                    <tr key={emprestimo.id}>
                      <td style={{ fontWeight: 500 }}>{emprestimo.pessoas?.nome}</td>
                      <td>{emprestimo.exemplares?.obra?.titulo}</td>
                      <td style={{ color: 'var(--muted)' }}>{emprestimo.exemplares?.codigo}</td>
                      <td>{new Date(emprestimo.data_retirada + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      {view === 'ativos' ? (
                        <>
                          <td style={{ color: vencido ? 'var(--danger)' : 'var(--text)' }}>
                            {new Date(emprestimo.prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
                            {vencido ? ' ⚠️' : ''}
                          </td>
                          <td>
                            <span className={vencido ? 'inline-status inline-status-danger' : 'inline-status inline-status-warning'}>
                              {vencido ? 'Vencido' : 'Em aberto'}
                            </span>
                          </td>
                        </>
                      ) : (
                        <td>{emprestimo.data_devolucao ? new Date(emprestimo.data_devolucao + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                      )}
                      <td>
                        <Link href={`/admin/biblioteca/emprestimos/${emprestimo.id}`} className="profile-form-btn profile-form-btn-secondary">
                          {view === 'ativos' ? 'Devolver' : 'Ver'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="area-empty">{view === 'ativos' ? 'Nenhum empréstimo ativo.' : 'Nenhum histórico de devolução.'}</div>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <section className="area-section">
          <div className="area-panel-grid" style={{ justifyContent: 'center' }}>
            {page > 1 && (
              <Link href={`/admin/biblioteca/emprestimos?page=${page - 1}&view=${view}`} className="profile-form-btn profile-form-btn-secondary">
                Anterior
              </Link>
            )}
            <span className="area-panel-item" style={{ alignSelf: 'center', fontWeight: 600 }}>
              Página {page} de {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/admin/biblioteca/emprestimos?page=${page + 1}&view=${view}`} className="profile-form-btn profile-form-btn-secondary">
                Próxima
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function EmprestimosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EmprestimosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

