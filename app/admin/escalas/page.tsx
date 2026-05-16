import Link from 'next/link';
import { getEscalas } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Escalas Mensais - Admin GEEF',
};

function getMonthName(mes: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[mes - 1];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'rascunho':
      return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' };
    case 'revisada':
      return { bg: 'rgba(251, 146, 60, 0.1)', color: '#f97316' };
    case 'publicada':
      return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
    default:
      return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' };
  }
}

async function EscalasList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { escalas, total, pageSize } = await getEscalas(page);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Escalas Mensais</h1>
          <p className="admin-page-subtitle">Planejamento de funções, passe e evangelização</p>
        </div>
        <Link href="/admin/escalas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Escala
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {escalas.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhuma escala cadastrada.</p>
            <Link href="/admin/escalas/nova" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Criar primeira escala
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Ano</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {escalas.map((escala: any) => {
                const statusColor = getStatusColor(escala.status);
                return (
                  <tr key={escala.id}>
                    <td style={{ fontWeight: 600 }}>{getMonthName(escala.mes)}</td>
                    <td style={{ fontSize: '0.9rem' }}>{escala.ano}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.7rem',
                        backgroundColor: statusColor.bg,
                        color: statusColor.color,
                        borderRadius: '0.4rem',
                        fontSize: '0.85rem',
                      }}>
                        {escala.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {new Date(escala.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <Link href={`/admin/escalas/${escala.id}`} className="admin-btn admin-btn-small">
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
            <Link href={`/admin/escalas?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/escalas?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function EscalasPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EscalasList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

