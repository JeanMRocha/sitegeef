import Link from 'next/link';
import { getProdutos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Livraria - Admin GEEF',
};

async function LivrariaList({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';

  const { produtos, total, pageSize } = await getProdutos(page, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Acervo e estoque</p>
            <h1 className="area-hero-title">Livraria</h1>
          </div>
          <Link href="/admin/livraria/novo-produto" className="profile-form-btn profile-form-btn-primary">
            Novo Produto
          </Link>
        </div>
        <p className="area-subtitle">Gerenciamento de vendas, estoque e catálogo.</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <form method="get" className="module-grid" style={{ alignItems: 'end' }}>
            <label className="profile-form-field" style={{ gridColumn: '1 / -2' }}>
              <span>Buscar</span>
              <input
                type="text"
                name="search"
                placeholder="Buscar por título ou autor..."
                defaultValue={search}
                className="profile-form-input"
              />
            </label>
            <div className="area-panel-item">
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Buscar</button>
              {search ? (
                <Link href="/admin/livraria" className="profile-form-btn profile-form-btn-secondary">
                  Limpar
                </Link>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Produtos</h2>
          <p>Controle de disponibilidade, categoria e preço de venda.</p>
        </div>
        <div className="table-surface">
          {produtos.length === 0 ? (
            <div className="area-empty">
              <p>{search ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}</p>
              <Link href="/admin/livraria/novo-produto" className="profile-form-btn profile-form-btn-primary">
                Adicionar primeiro produto
              </Link>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Preço venda</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto: any) => {
                  const baixoEstoque = produto.qtd_estoque <= produto.estoque_minimo;
                  return (
                    <tr key={produto.id}>
                      <td style={{ fontWeight: 500 }}>{produto.titulo}</td>
                      <td style={{ color: 'var(--muted)' }}>{produto.autor || '—'}</td>
                      <td>
                        {produto.categoria ? <span className="tag">{produto.categoria}</span> : '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: baixoEstoque ? 'var(--danger)' : 'var(--text)' }}>
                        {produto.qtd_estoque}{baixoEstoque ? ' ⚠️' : ''}
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {produto.valor_venda
                          ? `R$ ${produto.valor_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : '—'}
                      </td>
                      <td>
                        <span className={produto.status === 'disponivel' ? 'inline-status inline-status-success' : 'inline-status'}>
                          {produto.status}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/livraria/${produto.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <section className="area-section">
          <div className="area-panel-grid" style={{ justifyContent: 'center' }}>
            {page > 1 && (
              <Link href={`/admin/livraria?page=${page - 1}${search ? `&search=${search}` : ''}`} className="profile-form-btn profile-form-btn-secondary">
                Anterior
              </Link>
            )}
            <span className="area-panel-item" style={{ alignSelf: 'center', fontWeight: 600 }}>
              Página {page} de {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/admin/livraria?page=${page + 1}${search ? `&search=${search}` : ''}`} className="profile-form-btn profile-form-btn-secondary">
                Próxima
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function LivrariaPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <LivrariaList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

