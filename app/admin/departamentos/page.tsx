import Link from 'next/link';
import { getDepartamentos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Departamentos - Admin GEEF',
};

async function DepartamentosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { departamentos, total, pageSize } = await getDepartamentos(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Departamentos</h1>
          <p className="admin-page-subtitle">Organizações internas do GEEF</p>
        </div>
        <Link href="/admin/departamentos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Departamento
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {departamentos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhum departamento cadastrado.</p>
            <Link href="/admin/departamentos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Criar primeiro departamento
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Coordenador</th>
                <th>Membros</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.map((dept: any) => (
                <tr key={dept.id}>
                  <td style={{ fontWeight: 600 }}>{dept.nome}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    {dept.descricao ? dept.descricao.substring(0, 50) : '—'}
                    {dept.descricao && dept.descricao.length > 50 ? '...' : ''}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {dept.coordenador_id ? '✅ Sim' : '—'}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{dept.departamento_membros?.length || 0}</span>
                  </td>
                  <td>
                    <Link href={`/admin/departamentos/${dept.id}`} className="admin-btn admin-btn-small">
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
            <Link href={`/admin/departamentos?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/departamentos?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function DepartamentosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <DepartamentosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

