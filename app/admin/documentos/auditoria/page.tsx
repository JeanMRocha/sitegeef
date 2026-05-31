import Link from 'next/link';
import { Suspense } from 'react';
import { getOpsEventStats, listOpsEvents, type OpsEvent } from '@/lib/ops-events';

export const metadata = {
  title: 'Auditoria LGPD - Admin GEEF',
};

function resolveSource(source?: string) {
  const value = source?.trim();

  if (!value || value === 'all') {
    return undefined;
  }

  return value;
}

async function AuditoriaContent({ searchParams }: { searchParams: { source?: string; q?: string } }) {
  const source = searchParams.source?.trim() || 'all';
  const q = searchParams.q?.trim();

  const events: OpsEvent[] = await listOpsEvents({
    limit: 80,
    source: resolveSource(source),
    query: q,
  });

  const stats = await getOpsEventStats(events);
  const recent = events.slice(0, 20);
  const modelos = events.filter((event) => event.source.includes('admin/documentos/modelos')).length;
  const pedidosAdmin = events.filter((event) => event.source.includes('admin/documentos/pedidos')).length;
  const termos = events.filter((event) => event.source.includes('admin/documentos/termos')).length;
  const consentimentos = events.filter((event) => event.source.includes('admin/documentos/consentimentos')).length;
  const voluntariado = events.filter((event) => event.source.includes('admin/documentos/voluntariado')).length;
  const titulares = events.filter((event) => event.source.includes('user-area/lgpd')).length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Auditoria LGPD</h1>
          <p className="admin-page-subtitle">Rastro técnico discreto das ações sensíveis do módulo.</p>
        </div>
        <Link href="/admin/documentos" className="admin-btn admin-btn-secondary">
          ← Voltar para documentos
        </Link>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.9rem 1rem' }}>
        <p className="panel-note">
          A tela mostra apenas eventos operacionais gravados após criar, alterar ou revogar registros do módulo.
        </p>
      </div>

      <div className="document-tabs">
        <Link href="/admin/documentos" className="document-tab">
          📄 Modelos
        </Link>
        <Link href="/admin/documentos/pedidos" className="document-tab">
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
        <Link href="/admin/documentos/auditoria" className="document-tab document-tab-active">
          🧭 Auditoria LGPD
        </Link>
      </div>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Eventos exibidos</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Últimas 24h</span>
          <strong>{stats.last24h}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Modelos</span>
          <strong>{modelos}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Pedidos</span>
          <strong>{pedidosAdmin}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Termos</span>
          <strong>{termos}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Consentimentos</span>
          <strong>{consentimentos}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Voluntariado</span>
          <strong>{voluntariado}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Titular</span>
          <strong>{titulares}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Filtros</h2>
          <p>Use um recorte simples para revisão rápida.</p>
        </div>
        <div className="table-surface">
          <form method="get" className="module-grid align-end">
            <label className="profile-form-field">
              <span>Fonte</span>
              <select name="source" defaultValue={source} className="profile-form-input">
                <option value="all">Todos</option>
                <option value="admin/documentos/modelos">Modelos</option>
                <option value="admin/documentos/pedidos">Pedidos</option>
                <option value="admin/documentos/termos">Termos</option>
                <option value="admin/documentos/consentimentos">Consentimentos</option>
                <option value="admin/documentos/voluntariado">Voluntariado</option>
                <option value="user-area/lgpd">Titular</option>
              </select>
            </label>

            <label className="profile-form-field">
              <span>Busca</span>
              <input
                name="q"
                defaultValue={q || ''}
                className="profile-form-input"
                placeholder="texto da mensagem"
              />
            </label>

            <div className="area-panel-item">
              <button type="submit" className="profile-form-btn profile-form-btn-primary">
                Filtrar
              </button>
              <Link href="/admin/documentos/auditoria" className="profile-form-btn profile-form-btn-secondary">
                Limpar
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Últimos registros</h2>
          <p>Os detalhes completos ficam recolhidos para leitura sob demanda.</p>
        </div>
        <div className="table-surface">
          {recent.length === 0 ? (
            <div className="area-empty">Nenhum evento encontrado com os filtros atuais.</div>
          ) : (
            <div className="area-panel-grid">
              {recent.map((event) => (
                <article key={event.id} className="area-panel-item">
                  <div className="atendimento-list-item-content">
                    <div>
                      <h3 className="module-title">{event.message}</h3>
                      <p className="area-subtitle">
                        {new Date(event.created_at).toLocaleString('pt-BR')} · {event.source}
                      </p>
                    </div>
                    <div className="tag-list">
                      <span className="tag">{event.level}</span>
                      <span className="tag">{event.event_type}</span>
                    </div>
                  </div>

                  <details>
                    <summary className="details-summary">Ver detalhes técnicos</summary>
                    <pre className="details-box">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </details>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default async function AuditoriaPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <AuditoriaContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
