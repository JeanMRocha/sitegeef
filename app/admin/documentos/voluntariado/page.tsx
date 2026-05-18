import Link from 'next/link';
import { getServicosVoluntarios } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Serviços Voluntários - Admin GEEF',
};

async function ServicosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { servicos, total, pageSize } = await getServicosVoluntarios(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Serviços Voluntários</h1>
          <p className="admin-page-subtitle">Registro discreto de voluntariado, vínculo e vigência.</p>
        </div>
        <Link href="/admin/documentos/voluntariado/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Serviço
        </Link>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.9rem 1rem' }}>
        <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
          Registre só o necessário para comprovar o vínculo e o período de atuação.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
        <Link href="/admin/documentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          📄 Modelos
        </Link>
        <Link href="/admin/documentos/termos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          ✍️ Termos Assinados
        </Link>
        <Link href="/admin/documentos/consentimentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          🔒 Consentimentos LGPD
        </Link>
        <Link href="/admin/documentos/voluntariado" style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          🤝 Serviços Voluntários
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {servicos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhum serviço voluntário registrado.</p>
            <Link href="/admin/documentos/voluntariado/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Registrar primeiro serviço
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Voluntário</th>
                <th>Departamento</th>
                <th>Serviço</th>
                <th>Data Início</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico: any) => (
                <tr key={servico.id}>
                  <td style={{ fontWeight: 500 }}>{servico.pessoas?.nome || '—'}</td>
                  <td style={{ fontSize: '0.9rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.7rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: 'var(--primary)',
                      borderRadius: '0.4rem',
                      fontSize: '0.85rem',
                    }}>
                      {servico.departamentos?.nome || '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{servico.servico}</td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {new Date(servico.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.7rem',
                      backgroundColor:
                        servico.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' :
                        'rgba(107, 114, 128, 0.1)',
                      color:
                        servico.status === 'ativo' ? '#22c55e' :
                        '#6b7280',
                      borderRadius: '0.4rem',
                      fontSize: '0.85rem',
                    }}>
                      {servico.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/documentos/voluntariado/${servico.id}`} className="admin-btn admin-btn-small">
                      ✏️ Ver
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
            <Link href={`/admin/documentos/voluntariado?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/documentos/voluntariado?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function VoluntariadoPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ServicosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

