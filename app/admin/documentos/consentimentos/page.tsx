import Link from 'next/link';
import { getConsentimentosLGPD } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Consentimentos LGPD - Admin GEEF',
};

async function ConsentimentosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { consentimentos, total, pageSize } = await getConsentimentosLGPD(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Consentimentos LGPD</h1>
          <p className="admin-page-subtitle">Rastreamento discreto de consentimentos e base legal.</p>
        </div>
        <Link href="/admin/documentos/consentimentos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Consentimento
        </Link>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.9rem 1rem' }}>
        <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
          Registre só o necessário para justificar o tratamento e facilitar revogação, se houver pedido do titular.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
        <Link href="/admin/documentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          📄 Modelos
        </Link>
        <Link href="/admin/documentos/pedidos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          📮 Pedidos do Titular
        </Link>
        <Link href="/admin/documentos/termos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          ✍️ Termos Assinados
        </Link>
        <Link href="/admin/documentos/consentimentos" style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          🔒 Consentimentos LGPD
        </Link>
        <Link href="/admin/documentos/voluntariado" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          🤝 Serviços Voluntários
        </Link>
        <Link href="/admin/documentos/auditoria" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          🧭 Auditoria LGPD
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {consentimentos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhum consentimento registrado.</p>
            <Link href="/admin/documentos/consentimentos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Registrar primeiro consentimento
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Finalidade</th>
                <th>Base Legal</th>
                <th>Data Consentimento</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {consentimentos.map((consentimento: any) => (
                <tr key={consentimento.id}>
                  <td style={{ fontWeight: 500 }}>{consentimento.pessoas?.nome || '—'}</td>
                  <td style={{ fontSize: '0.9rem' }}>{consentimento.finalidade}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{consentimento.base_legal || '—'}</td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {new Date(consentimento.data_consentimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.7rem',
                      backgroundColor:
                        consentimento.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' :
                        'rgba(239, 68, 68, 0.1)',
                      color:
                        consentimento.status === 'ativo' ? '#22c55e' :
                        '#ef4444',
                      borderRadius: '0.4rem',
                      fontSize: '0.85rem',
                    }}>
                      {consentimento.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/documentos/consentimentos/${consentimento.id}`} className="admin-btn admin-btn-small">
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
            <Link href={`/admin/documentos/consentimentos?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/documentos/consentimentos?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function ConsentimentosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ConsentimentosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

