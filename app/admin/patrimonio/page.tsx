import Link from 'next/link';
import { getBens } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Patrimônio - Admin GEEF',
};

async function PatrimonioContent() {
  const bens = await getBens();
  const ativos = bens.filter((b: any) => b.status === 'ativo');

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Controle de ativos</p>
            <h1 className="area-hero-title">Patrimônio</h1>
          </div>
          <Link href="/admin/patrimonio/novo-bem" className="profile-form-btn profile-form-btn-primary">
            Novo Bem
          </Link>
        </div>
        <p className="area-subtitle">Gestão de bens, responsáveis e conservação.</p>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Bens ativos</span>
          <strong>{ativos.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Total de bens</span>
          <strong>{bens.length}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Todos os bens</h2>
          <p>Lista consolidada com localização e estado de conservação.</p>
        </div>
        <div className="table-surface">
          {bens.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Localização</th>
                    <th>Responsável</th>
                    <th>Conservação</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {bens.map((bem: any) => (
                    <tr key={bem.id}>
                      <td style={{ fontWeight: 500 }}>{bem.nome}</td>
                      <td>{bem.categoria || '—'}</td>
                      <td style={{ color: 'var(--muted)' }}>{bem.localizacao || '—'}</td>
                      <td>{bem.responsavel?.nome || '—'}</td>
                      <td>
                        <span className={
                          bem.conservacao === 'bom'
                            ? 'inline-status inline-status-success'
                            : bem.conservacao === 'regular'
                              ? 'inline-status inline-status-warning'
                              : bem.conservacao === 'ruim'
                                ? 'inline-status inline-status-danger'
                                : 'inline-status'
                        }>
                          {bem.conservacao === 'bom' && 'Bom'}
                          {bem.conservacao === 'regular' && 'Regular'}
                          {bem.conservacao === 'ruim' && 'Ruim'}
                          {!bem.conservacao && '—'}
                        </span>
                      </td>
                      <td>
                        <span className={bem.status === 'ativo' ? 'inline-status inline-status-success' : 'inline-status'}>
                          {bem.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/patrimonio/${bem.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="area-empty">Nenhum bem cadastrado.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function PatrimonioPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PatrimonioContent />
    </Suspense>
  );
}
