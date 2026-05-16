import Link from 'next/link';
import { getPessoas } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Pessoas - Admin GEEF',
};

async function PessoasList({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';

  const { pessoas, total, pageSize } = await getPessoas(page, search);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pessoas</h1>
          <p className="admin-page-subtitle">Cadastro central — núcleo do sistema</p>
        </div>
        <Link href="/admin/pessoas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Pessoa
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <form method="GET" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
              Buscar por nome, email ou telefone
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Digite para filtrar..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
              }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-secondary">
            🔍 Buscar
          </button>
          {search && (
            <Link href="/admin/pessoas" className="admin-btn admin-btn-secondary">
              ❌ Limpar
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ marginBottom: '2rem', overflowX: 'auto' }}>
        {pessoas.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhuma pessoa encontrada.</p>
            <Link href="/admin/pessoas/nova" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Criar primeira pessoa
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Vínculos</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa: any) => (
                <tr key={pessoa.id}>
                  <td style={{ fontWeight: 600 }}>{pessoa.nome}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{pessoa.email || '—'}</td>
                  <td style={{ fontSize: '0.9rem' }}>{pessoa.telefone || '—'}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor:
                          pessoa.status === 'ativo'
                            ? 'rgba(99, 213, 31, 0.2)'
                            : pessoa.status === 'inativo'
                              ? 'rgba(158, 158, 158, 0.2)'
                              : pessoa.status === 'falecido'
                                ? 'rgba(200, 0, 0, 0.2)'
                                : 'rgba(255, 193, 7, 0.2)',
                        color:
                          pessoa.status === 'ativo'
                            ? 'var(--leaf)'
                            : pessoa.status === 'inativo'
                              ? 'var(--muted)'
                              : pessoa.status === 'falecido'
                                ? '#c00'
                                : '#f57f17',
                      }}
                    >
                      {pessoa.status === 'ativo'
                        ? '✅ Ativo'
                        : pessoa.status === 'inativo'
                          ? '⏸️ Inativo'
                          : pessoa.status === 'falecido'
                            ? '†️ Falecido'
                            : '⏳ Afastado'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {pessoa.pessoa_vinculos && pessoa.pessoa_vinculos.length > 0 ? (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {pessoa.pessoa_vinculos.slice(0, 2).map((v: any) => (
                          <span
                            key={v.vinculo}
                            style={{
                              padding: '0.15rem 0.4rem',
                              borderRadius: '0.3rem',
                              backgroundColor: 'rgba(138, 0, 90, 0.1)',
                              color: 'var(--uva)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {v.vinculo}
                          </span>
                        ))}
                        {pessoa.pessoa_vinculos.length > 2 && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            +{pessoa.pessoa_vinculos.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/pessoas/${pessoa.id}`} className="admin-btn admin-btn-small">
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
            <Link href={`/admin/pessoas?page=${page - 1}${search ? `&search=${search}` : ''}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/pessoas?page=${page + 1}${search ? `&search=${search}` : ''}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function PessoasPage({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PessoasList searchParams={searchParams} />
    </Suspense>
  );
}
