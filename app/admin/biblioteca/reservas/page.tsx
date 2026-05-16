import Link from 'next/link';
import { getReservas } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Reservas - Admin GEEF',
};

async function ReservasList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { reservas, total, pageSize } = await getReservas(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reservas</h1>
          <p className="admin-page-subtitle">Gerenciamento de fila de espera</p>
        </div>
        <Link href="/admin/biblioteca/reservas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Reserva
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {reservas.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Pessoa</th>
                <th>Obra</th>
                <th>Autor</th>
                <th>Data Reserva</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva: any) => (
                <tr key={reserva.id}>
                  <td style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    #{reserva.posicao_fila}
                  </td>
                  <td style={{ fontWeight: 500 }}>{reserva.pessoas?.nome}</td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {reserva.obras?.titulo}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {reserva.obras?.autor || '—'}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {new Date(reserva.criado_em).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <Link
                      href={`/admin/biblioteca/reservas/${reserva.id}`}
                      className="admin-btn admin-btn-small"
                    >
                      ✏️ Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhuma reserva aguardando.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
          {page > 1 && (
            <Link
              href={`/admin/biblioteca/reservas?page=${page - 1}`}
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
              href={`/admin/biblioteca/reservas?page=${page + 1}`}
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

export default function ReservasPage({ searchParams }: { searchParams: { page?: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ReservasList searchParams={searchParams} />
    </Suspense>
  );
}
