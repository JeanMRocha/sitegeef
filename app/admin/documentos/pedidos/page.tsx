import Link from 'next/link';
import { Suspense } from 'react';
import { getPessoasDisponiveis, getTitularSolicitacoes } from '../actions';

export const metadata = {
  title: 'Pedidos do Titular - Admin GEEF',
};

type PedidoItem = {
  id: string;
  titular_nome?: string | null;
  titular_email?: string | null;
  request_type: string;
  status?: string | null;
  responsavel_id?: string | null;
  created_at: string;
};

type PessoaItem = {
  id: string;
  nome: string;
};

function resolveStatus(status?: string) {
  if (
    status === 'aberta' ||
    status === 'em_andamento' ||
    status === 'respondida' ||
    status === 'encerrada'
  ) {
    return status;
  }

  return 'all';
}

function resolveLabel(tipo?: string | null) {
  if (tipo === 'acesso') return 'Acesso';
  if (tipo === 'correcao') return 'Correção';
  if (tipo === 'revogacao') return 'Revogação';
  if (tipo === 'eliminacao') return 'Eliminação';
  return tipo || '—';
}

function resolveStatusLabel(status?: string | null) {
  if (status === 'aberta') return 'Aberta';
  if (status === 'em_andamento') return 'Em andamento';
  if (status === 'respondida') return 'Respondida';
  if (status === 'encerrada') return 'Encerrada';
  return status || '—';
}

async function PedidosContent({ searchParams }: { searchParams: { page?: string; status?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const filterStatus = resolveStatus(searchParams.status);

  const [pedidosResult, abertasResult, andamentoResult, respondidasResult, encerradasResult, pessoas] = await Promise.all([
    getTitularSolicitacoes(page, filterStatus),
    getTitularSolicitacoes(1, 'aberta'),
    getTitularSolicitacoes(1, 'em_andamento'),
    getTitularSolicitacoes(1, 'respondida'),
    getTitularSolicitacoes(1, 'encerrada'),
    getPessoasDisponiveis(),
  ]);

  const { solicitacoes, total, pageSize } = pedidosResult;
  const totalPages = Math.ceil(total / pageSize);
  const pedidoList = solicitacoes as PedidoItem[];
  const responsavelMap = new Map((pessoas as PessoaItem[]).map((p) => [p.id, p.nome]));

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">LGPD</p>
            <h1 className="area-hero-title">Pedidos do Titular</h1>
          </div>
          <Link href="/admin/documentos" className="profile-form-btn profile-form-btn-secondary">
            Voltar
          </Link>
        </div>
        <p className="area-subtitle">Fila discreta para tratar acesso, correção, revogação e eliminação quando cabível.</p>
      </section>

      <section className="area-section">
        <div className="area-panel-item">
          <strong>Nota rápida</strong>
          <p className="mt-035">
            Use o pedido como ponto de partida. Responda, atribua responsável e mantenha a trilha em auditoria.
          </p>
        </div>
      </section>

      <section className="area-section">
        <div className="document-tabs">
          <Link href="/admin/documentos" className="document-tab">
            📄 Modelos
          </Link>
          <Link href="/admin/documentos/pedidos" className="document-tab document-tab-active">
            📮 Pedidos do Titular
          </Link>
          <Link href="/admin/documentos/termos" className="document-tab">
            ✍️ Termos Assinados
          </Link>
          <Link href="/admin/documentos/consentimentos" className="document-tab">
            🔒 Consentimentos LGPD
          </Link>
          <Link href="/admin/documentos/voluntariado" className="document-tab">
            🤝 Serviços Voluntários
          </Link>
          <Link href="/admin/documentos/auditoria" className="document-tab">
            🧭 Auditoria LGPD
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Total</span>
          <strong>{total}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Abertos</span>
          <strong>{abertasResult.total}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Em andamento</span>
          <strong>{andamentoResult.total}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Respondidos</span>
          <strong>{respondidasResult.total}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Encerrados</span>
          <strong>{encerradasResult.total}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Filtros</h2>
          <p>Mostre só o que precisa de atenção agora.</p>
        </div>
        <div className="table-surface">
          <form method="get" className="module-grid">
            <label className="profile-form-field">
              <span>Status</span>
              <select name="status" defaultValue={filterStatus} className="profile-form-input">
                <option value="all">Todos</option>
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em andamento</option>
                <option value="respondida">Respondida</option>
                <option value="encerrada">Encerrada</option>
              </select>
            </label>

            <div className="area-panel-item" style={{ alignSelf: 'end' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">
                Filtrar
              </button>
              <Link href="/admin/documentos/pedidos" className="profile-form-btn profile-form-btn-secondary">
                Limpar
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {pedidoList.length === 0 ? (
            <div className="area-empty">Nenhum pedido encontrado com os filtros atuais.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titular</th>
                  <th>Pedido</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Criado em</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {pedidoList.map((pedido) => {
                  return (
                    <tr key={pedido.id}>
                      <td>
                        <strong>
                        {pedido.titular_nome || pedido.titular_email || '—'}
                        </strong>
                        <div className="text-xs-muted mt-035">
                          {pedido.titular_email || '—'}
                        </div>
                      </td>
                      <td>
                        <span className="tag">{resolveLabel(pedido.request_type)}</span>
                      </td>
                      <td>
                        <span className={pedido.status === 'aberta' ? 'inline-status inline-status-info' : pedido.status === 'em_andamento' ? 'inline-status inline-status-warning' : pedido.status === 'respondida' ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
                          {resolveStatusLabel(pedido.status)}
                        </span>
                      </td>
                      <td className="text-sm-muted">
                        {pedido.responsavel_id ? responsavelMap.get(pedido.responsavel_id) || '—' : '—'}
                      </td>
                      <td className="text-sm-muted">
                        {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <Link href={`/admin/documentos/pedidos/${pedido.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Abrir
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
        <div className="page-pagination">
          {page > 1 && (
            <Link href={`/admin/documentos/pedidos?page=${page - 1}&status=${filterStatus}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span className="page-pagination-label">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/documentos/pedidos?page=${page + 1}&status=${filterStatus}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function PedidosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <PedidosContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
