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
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Planejamento de tarefas</p>
            <h1 className="area-hero-title">Escalas Mensais</h1>
          </div>
          <Link href="/admin/escalas/nova" className="profile-form-btn profile-form-btn-primary">
            Nova Escala
          </Link>
        </div>
        <p className="area-subtitle">Funções, passe e evangelização organizados por mês.</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {escalas.length === 0 ? (
            <div className="area-empty">
              <p>Nenhuma escala cadastrada.</p>
              <Link href="/admin/escalas/nova" className="profile-form-btn profile-form-btn-primary">
                Criar primeira escala
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
                      <td>{escala.ano}</td>
                      <td>
                        <span className="inline-status" style={{ backgroundColor: statusColor.bg, color: statusColor.color }}>
                          {escala.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>
                        {new Date(escala.criado_em).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <Link href={`/admin/escalas/${escala.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <section className="area-section">
          <div className="area-panel-grid" style={{ justifyContent: 'center' }}>
            {page > 1 && (
              <Link href={`/admin/escalas?page=${page - 1}`} className="profile-form-btn profile-form-btn-secondary">
                Anterior
              </Link>
            )}
            <span className="area-panel-item" style={{ alignSelf: 'center', fontWeight: 600 }}>
              Página {page} de {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/admin/escalas?page=${page + 1}`} className="profile-form-btn profile-form-btn-secondary">
                Próxima
              </Link>
            )}
          </div>
        </section>
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

