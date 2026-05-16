import Link from 'next/link';
import { getProdutos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Livraria - Admin GEEF',
};

async function LivrariList({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';

  const { produtos, total, pageSize } = await getProdutos(page, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Livraria</h1>
          <p className="admin-page-subtitle">Gerenciamento de vendas e estoque</p>
        </div>
        <Link href="/admin/livraria/novo-produto" className="admin-btn admin-btn-primary">
          ➕ Novo Produto
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <form method="get" style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            name="search"
            placeholder="Buscar por título ou autor..."
            defaultValue={search}
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
            }}
          />
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: 'auto' }}
          >
            🔍 Buscar
          </button>
          {search && (
            <Link href="/admin/livraria" className="admin-btn admin-btn-secondary" style={{ width: 'auto' }}>
              ✕ Limpar
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {produtos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>{search ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}</p>
            <Link href="/admin/livraria/novo-produto" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Adicionar primeiro produto
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
                <th>Preço Venda</th>
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
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {produto.autor || '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {produto.categoria ? (
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.6rem',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: 'var(--primary)',
                          borderRadius: '0.3rem',
                          fontSize: '0.85rem',
                        }}>
                          {produto.categoria}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{
                      fontWeight: 600,
                      color: baixoEstoque ? '#ef4444' : 'var(--text)',
                    }}>
                      {produto.qtd_estoque}
                      {baixoEstoque && ' ⚠️'}
                    </td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {produto.valor_venda
                        ? `R$ ${produto.valor_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.7rem',
                        backgroundColor: produto.status === 'disponivel' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: produto.status === 'disponivel' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.4rem',
                        fontSize: '0.85rem',
                      }}>
                        {produto.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/livraria/${produto.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
          {page > 1 && (
            <Link
              href={`/admin/livraria?page=${page - 1}${search ? `&search=${search}` : ''}`}
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
              href={`/admin/livraria?page=${page + 1}${search ? `&search=${search}` : ''}`}
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

export default function Livraria​Page({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <LivrariList searchParams={searchParams} />
    </Suspense>
  );
}
