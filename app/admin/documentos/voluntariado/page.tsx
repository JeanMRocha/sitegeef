import Link from 'next/link';
import { getServicosVoluntarios } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Serviços Voluntários - Admin GEEF',
};

type ServicoVoluntarioItem = {
  id: string;
  servico: string;
  data_inicio: string;
  status?: string | null;
  pessoas?: { nome?: string | null } | null;
  departamentos?: { nome?: string | null } | null;
};

async function ServicosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  const { servicos, total, pageSize } = await getServicosVoluntarios(page);
  const servicoList = servicos as ServicoVoluntarioItem[];
  const totalPages = Math.ceil(total / pageSize);

  const tabs = [
    { href: '/admin/documentos', label: '📄 Modelos' },
    { href: '/admin/documentos/pedidos', label: '📮 Pedidos do Titular' },
    { href: '/admin/documentos/termos', label: '✍️ Termos Assinados' },
    { href: '/admin/documentos/consentimentos', label: '🔒 Consentimentos LGPD' },
    { href: '/admin/documentos/voluntariado', label: '🤝 Serviços Voluntários', active: true },
    { href: '/admin/documentos/auditoria', label: '🧭 Auditoria LGPD' },
  ];

  return (
    <div>
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
        <p className="panel-note">
          Registre só o necessário para comprovar o vínculo e o período de atuação.
        </p>
      </div>

      <div className="document-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`document-tab${tab.active ? ' document-tab-active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="admin-card">
        {servicoList.length === 0 ? (
          <div className="text-center-muted" style={{ padding: '2rem' }}>
            <p>Nenhum serviço voluntário registrado.</p>
            <Link href="/admin/documentos/voluntariado/novo" className="admin-btn admin-btn-primary mt-1">
              ➕ Registrar primeiro serviço
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {servicoList.map((servico) => (
                  <tr key={servico.id}>
                    <td><strong>{servico.pessoas?.nome || '—'}</strong></td>
                    <td><span className="tag">{servico.departamentos?.nome || '—'}</span></td>
                    <td className="text-sm-muted">{servico.servico}</td>
                    <td className="text-sm-muted">
                      {new Date(servico.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span className={servico.status === 'ativo' ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
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
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="page-pagination">
          {page > 1 && (
            <Link href={`/admin/documentos/voluntariado?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span className="page-pagination-label">
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
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <ServicosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

