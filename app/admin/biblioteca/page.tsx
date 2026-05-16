import Link from 'next/link';
import { getObras } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Biblioteca - Admin GEEF',
};

async function BibliotecaList({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';

  const { obras, total, pageSize } = await getObras(page, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Biblioteca</h1>
          <p className="admin-page-subtitle">Gerenciamento de obras e exemplares</p>
        </div>
        <Link href="/admin/biblioteca/nova-obra" className="admin-btn admin-btn-primary">
          ➕ Nova Obra
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
            <Link href="/admin/biblioteca" className="admin-btn admin-btn-secondary" style={{ width: 'auto' }}>
              ✕ Limpar
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {obras.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>{search ? 'Nenhuma obra encontrada.' : 'Nenhuma obra cadastrada.'}</p>
            <Link href="/admin/biblioteca/nova-obra" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Adicionar primeira obra
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoria</th>
                <th>Público</th>
                <th>Exemplares</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((obra: any) => (
                <tr key={obra.id}>
                  <td style={{ fontWeight: 500 }}>{obra.titulo}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    {obra.autor || '—'}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {obra.categoria ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--primary)',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {obra.categoria}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.6rem',
                      backgroundColor:
                        obra.publico === 'adulto' ? 'rgba(59, 130, 246, 0.1)' :
                        obra.publico === 'jovem' ? 'rgba(168, 85, 247, 0.1)' :
                        'rgba(34, 197, 94, 0.1)',
                      color:
                        obra.publico === 'adulto' ? 'var(--primary)' :
                        obra.publico === 'jovem' ? '#a855f7' :
                        '#22c55e',
                      borderRadius: '0.3rem',
                      fontSize: '0.85rem',
                    }}>
                      {obra.publico}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>
                    {obra.exemplares?.length || 0}
                  </td>
                  <td>
                    <Link href={`/admin/biblioteca/${obra.id}`} className="admin-btn admin-btn-small">
                      ✏️ Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
          {page > 1 && (
            <Link
              href={`/admin/biblioteca?page=${page - 1}${search ? `&search=${search}` : ''}`}
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
              href={`/admin/biblioteca?page=${page + 1}${search ? `&search=${search}` : ''}`}
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

export default async function BibliotecaPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <BibliotecaList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

