import Link from 'next/link';
import { Suspense } from 'react';
import { getPessoasDisponiveis, getTitularSolicitacoes } from '../actions';

export const metadata = {
  title: 'Pedidos do Titular - Admin GEEF',
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

function resolveLabel(tipo: string) {
  if (tipo === 'acesso') return 'Acesso';
  if (tipo === 'correcao') return 'Correção';
  if (tipo === 'revogacao') return 'Revogação';
  if (tipo === 'eliminacao') return 'Eliminação';
  return tipo;
}

function resolveStatusLabel(status: string) {
  if (status === 'aberta') return 'Aberta';
  if (status === 'em_andamento') return 'Em andamento';
  if (status === 'respondida') return 'Respondida';
  if (status === 'encerrada') return 'Encerrada';
  return status;
}

function statusColor(status: string) {
  if (status === 'aberta') return { bg: 'rgba(59, 130, 246, 0.1)', fg: 'var(--primary)' };
  if (status === 'em_andamento') return { bg: 'rgba(245, 158, 11, 0.1)', fg: '#d97706' };
  if (status === 'respondida') return { bg: 'rgba(34, 197, 94, 0.1)', fg: '#22c55e' };
  return { bg: 'rgba(107, 114, 128, 0.1)', fg: '#6b7280' };
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
  const responsavelMap = new Map(pessoas.map((p: any) => [p.id, p.nome]));

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
          <p style={{ marginTop: '0.45rem' }}>
            Use o pedido como ponto de partida. Responda, atribua responsável e mantenha a trilha em auditoria.
          </p>
        </div>
      </section>

      <section className="area-section">
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--admin-border)',
            paddingBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/admin/documentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
            📄 Modelos
          </Link>
          <Link
            href="/admin/documentos/pedidos"
            style={{
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            📮 Pedidos do Titular
          </Link>
          <Link href="/admin/documentos/termos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
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
              <a href="/admin/documentos/pedidos" className="profile-form-btn profile-form-btn-secondary">
                Limpar
              </a>
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {solicitacoes.length === 0 ? (
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
                {solicitacoes.map((pedido: any) => {
                  const colors = statusColor(pedido.status);

                  return (
                    <tr key={pedido.id}>
                      <td style={{ fontWeight: 500 }}>
                        {pedido.titular_nome || pedido.titular_email || '—'}
                        <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                          {pedido.titular_email || '—'}
                        </div>
                      </td>
                      <td>
                        <span className="tag">{resolveLabel(pedido.request_type)}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.7rem',
                            backgroundColor: colors.bg,
                            color: colors.fg,
                            borderRadius: '0.4rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          {resolveStatusLabel(pedido.status)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>
                        {pedido.responsavel_id ? responsavelMap.get(pedido.responsavel_id) || '—' : '—'}
                      </td>
                      <td style={{ color: 'var(--muted)' }}>
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
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
          {page > 1 && (
            <Link href={`/admin/documentos/pedidos?page=${page - 1}&status=${filterStatus}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
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
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PedidosContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
