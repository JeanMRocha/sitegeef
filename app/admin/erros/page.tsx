import { Suspense } from "react";
import { listOpsEvents, getOpsEventStats, type OpsEventLevel } from "@/lib/ops-events";

export const metadata = {
  title: "Erros e Debug - Admin GEEF",
};

function resolveLevel(level?: string): OpsEventLevel | "all" {
  if (level === "debug" || level === "info" || level === "warn" || level === "error") {
    return level;
  }

  return "all";
}

async function ErrosContent({ searchParams }: { searchParams: { level?: string; source?: string; q?: string } }) {
  const level = resolveLevel(searchParams.level);
  const source = searchParams.source?.trim();
  const q = searchParams.q?.trim();

  const events = await listOpsEvents({
    limit: 80,
    level,
    source,
    query: q,
  });

  const stats = await getOpsEventStats(events);
  const recent = events.slice(0, 12);

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Observabilidade</p>
            <h1 className="area-hero-title">Erros e Debug</h1>
          </div>
        </div>
        <p className="area-subtitle">Coleta central de incidentes para análise, rastreio e correção.</p>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Eventos exibidos</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Nas últimas 24h</span>
          <strong>{stats.last24h}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Erros</span>
          <strong>{stats.errors}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Fontes distintas</span>
          <strong>{stats.sources}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Filtros</h2>
          <p>Refine a lista por nível, origem ou texto da mensagem.</p>
        </div>
        <div className="table-surface">
          <form method="get" className="module-grid">
            <label className="profile-form-field">
              <span>Nível</span>
              <select name="level" defaultValue={level} className="profile-form-input">
                <option value="all">Todos</option>
                <option value="error">Erro</option>
                <option value="warn">Aviso</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </label>

            <label className="profile-form-field">
              <span>Fonte</span>
              <input name="source" defaultValue={source || ""} className="profile-form-input" placeholder="app/error, api/..." />
            </label>

            <label className="profile-form-field">
              <span>Busca</span>
              <input name="q" defaultValue={q || ""} className="profile-form-input" placeholder="texto da mensagem" />
            </label>

            <div className="area-panel-item" style={{ alignSelf: "end" }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Filtrar</button>
              <a href="/admin/erros" className="profile-form-btn profile-form-btn-secondary">Limpar</a>
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Últimos incidentes</h2>
          <p>Clique para revisar o payload completo.</p>
        </div>
        <div className="table-surface">
          {recent.length === 0 ? (
            <div className="area-empty">Nenhum evento encontrado com os filtros atuais.</div>
          ) : (
            <div className="area-panel-grid">
              {recent.map((event) => (
                <article key={event.id} className="area-panel-item">
                  <div className="area-hero-top" style={{ alignItems: "start" }}>
                    <div>
                      <h3 className="module-title">{event.message}</h3>
                      <p className="area-subtitle">
                        {new Date(event.created_at).toLocaleString("pt-BR")} · {event.source}
                      </p>
                    </div>
                    <div className="tag-list">
                      <span className="tag">{event.level}</span>
                      <span className="tag">{event.event_type}</span>
                    </div>
                  </div>

                  <details>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>Ver detalhes técnicos</summary>
                    <pre style={{
                      marginTop: "0.75rem",
                      padding: "0.9rem",
                      borderRadius: "0.75rem",
                      overflowX: "auto",
                      background: "var(--admin-bg)",
                      border: "1px solid var(--line)",
                      fontSize: "0.82rem",
                    }}>
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

export default async function ErrosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ErrosContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
