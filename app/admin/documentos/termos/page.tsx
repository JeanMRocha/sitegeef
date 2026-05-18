import Link from 'next/link';
import { getTermosAssinados } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Termos Assinados - Admin GEEF',
};

async function TermosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { termos, total, pageSize } = await getTermosAssinados(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Termos Assinados</h1>
          <p className="admin-page-subtitle">Registro discreto de termos, vigência e revogação.</p>
        </div>
        <Link href="/admin/documentos/termos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Termo
        </Link>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.9rem 1rem' }}>
        <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
          Use o modelo correto, guarde só o essencial e confirme a validade antes de assinar.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
        <Link href="/admin/documentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          📄 Modelos
        </Link>
        <Link href="/admin/documentos/termos" style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          ✍️ Termos Assinados
        </Link>
        <Link href="/admin/documentos/consentimentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
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
        {termos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhum termo assinado registrado.</p>
            <Link href="/admin/documentos/termos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Registrar primeiro termo
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Documento</th>
                <th>Data Assinatura</th>
                <th>Validade</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {termos.map((termo: any) => {
                const hoje = new Date().toISOString().split('T')[0];
                const vencido = termo.validade && termo.validade < hoje;

                return (
                  <tr key={termo.id}>
                    <td style={{ fontWeight: 500 }}>{termo.pessoas?.nome || '—'}</td>
                    <td style={{ fontSize: '0.9rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.7rem',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--primary)',
                        borderRadius: '0.4rem',
                        fontSize: '0.85rem',
                      }}>
                        {termo.documentos_modelo?.tipo || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {termo.data_assinatura ? new Date(termo.data_assinatura + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: vencido ? '#c00' : 'var(--text)' }}>
                      {termo.validade ? new Date(termo.validade + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}
                      {vencido && ' (vencido)'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.7rem',
                        backgroundColor:
                          termo.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' :
                          termo.status === 'revogado' ? 'rgba(239, 68, 68, 0.1)' :
                          'rgba(107, 114, 128, 0.1)',
                        color:
                          termo.status === 'ativo' ? '#22c55e' :
                          termo.status === 'revogado' ? '#ef4444' :
                          '#6b7280',
                        borderRadius: '0.4rem',
                        fontSize: '0.85rem',
                      }}>
                        {termo.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/documentos/termos/${termo.id}`} className="admin-btn admin-btn-small">
                        ✏️ Ver
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
            <Link href={`/admin/documentos/termos?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/documentos/termos?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function TermosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <TermosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

