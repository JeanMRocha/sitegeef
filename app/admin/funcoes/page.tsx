import Link from 'next/link';
import { getFuncoes } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Funções e Temas - Admin GEEF',
};

async function FuncoesList() {
  const funcoes = await getFuncoes();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Escalas e temas</p>
            <h1 className="area-hero-title">Funções e Temas</h1>
          </div>
          <Link href="/admin/funcoes/nova" className="profile-form-btn profile-form-btn-primary">
            Nova Função
          </Link>
        </div>
        <p className="area-subtitle">Configure funções de escalas e temas doutrinários.</p>
      </section>

      <section className="area-section">
        <div className="area-panel-grid">
          <Link href="/admin/funcoes" className="module-card" style={{ borderColor: 'var(--accent)' }}>
            <h3 className="module-title">Funções</h3>
            <p>Cadastros de funções usadas nas escalas.</p>
          </Link>
          <Link href="/admin/funcoes/temas" className="module-card">
            <h3 className="module-title">Temas doutrinários</h3>
            <p>Categoria de temas utilizados em estudos e palestras.</p>
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {funcoes.length === 0 ? (
            <div className="area-empty">
              <p>Nenhuma função cadastrada.</p>
              <Link href="/admin/funcoes/nova" className="profile-form-btn profile-form-btn-primary">Criar primeira função</Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {funcoes.map((funcao: any) => (
                  <tr key={funcao.id}>
                    <td style={{ fontWeight: 600 }}>{funcao.nome}</td>
                    <td style={{ color: 'var(--muted)' }}>{funcao.descricao || '—'}</td>
                    <td>
                      <Link href={`/admin/funcoes/${funcao.id}`} className="profile-form-btn profile-form-btn-secondary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default function FuncoesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <FuncoesList />
    </Suspense>
  );
}
