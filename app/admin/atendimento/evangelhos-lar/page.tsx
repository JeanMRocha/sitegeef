import Link from 'next/link';
import { getEvangelhasNoLar } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Evangelho no Lar - Admin GEEF',
};

type EvangelhoItem = {
  id: string;
  data: string;
  situacao?: string | null;
  endereco?: string | null;
  equipe?: string | null;
  pessoas?: { nome?: string | null } | null;
};

async function EvangelhasContent() {
  const evangelhos = await getEvangelhasNoLar();
  const evangelhoList = evangelhos as EvangelhoItem[];

  const situacoes: { [key: string]: { label: string; color: string } } = {
    'planejada': { label: '📋 Planejada', color: '#3b82f6' },
    'realizada': { label: '✓ Realizada', color: '#22c55e' },
    'adiada': { label: '⏸️ Adiada', color: '#f97316' },
    'cancelada': { label: '❌ Cancelada', color: '#ef4444' },
  };

  const getSituacaoClass = (situacao?: string | null) => {
    switch (situacao) {
      case 'planejada':
        return 'inline-status inline-status-info';
      case 'realizada':
        return 'inline-status inline-status-success';
      case 'adiada':
        return 'inline-status inline-status-warning';
      case 'cancelada':
        return 'inline-status inline-status-danger';
      default:
        return 'inline-status inline-status-neutral';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Evangelho no Lar</h1>
          <p className="admin-page-subtitle">Atividades de evangelização familiar</p>
        </div>
        <Link href="/admin/atendimento/evangelhos-lar/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Evangelho
        </Link>
      </div>

      {/* Tabela */}
      <div className="admin-card">
        {evangelhoList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pessoa</th>
                  <th>Endereço</th>
                  <th>Equipe</th>
                  <th>Situação</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {evangelhoList.map((ev) => {
                  const situacao = ev.situacao || 'indefinida';
                  const sit = situacoes[situacao] || { label: situacao, color: '#999' };
                  return (
                    <tr key={ev.id}>
                      <td>
                        <strong className="text-sm-500">
                        {new Date(ev.data).toLocaleDateString('pt-BR')}
                        </strong>
                      </td>
                      <td>
                        <strong>
                        {ev.pessoas?.nome}
                        </strong>
                      </td>
                      <td className="text-sm-muted">
                        {ev.endereco}
                      </td>
                      <td className="text-sm-muted">
                        {ev.equipe}
                      </td>
                      <td>
                        <span className={getSituacaoClass(ev.situacao)}>
                          {sit.label}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/atendimento/evangelhos-lar/${ev.id}`} className="admin-btn admin-btn-small">
                          ✏️ Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="area-empty">
            <p>Nenhum evangelho no lar registrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvangelhasPage() {
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EvangelhasContent />
    </Suspense>
  );
}
