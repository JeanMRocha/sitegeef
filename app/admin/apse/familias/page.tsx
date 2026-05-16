import Link from 'next/link';
import { getFamilias } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Famílias Assistidas - Admin GEEF',
};

async function FamiliasContent() {
  const familias = await getFamilias();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Famílias Assistidas</h1>
          <p className="admin-page-subtitle">Registro e acompanhamento de famílias</p>
        </div>
        <Link href="/admin/apse/familias/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Família
        </Link>
      </div>

      <div className="admin-card">
        {familias.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Responsável</th>
                  <th>Endereço</th>
                  <th>Membros</th>
                  <th>Situação</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {familias.map((familia: any) => (
                  <tr key={familia.id}>
                    <td style={{ fontWeight: 500 }}>
                      {familia.responsavel?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {familia.endereco || '—'}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 500 }}>
                      {familia.membros}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {familia.situacao || '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: familia.status === 'ativa' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: familia.status === 'ativa' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {familia.status === 'ativa' ? '✓ Ativa' : '✕ Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/apse/familias/${familia.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma família cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default function FamiliasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <FamiliasContent />
    </Suspense>
  );
}
