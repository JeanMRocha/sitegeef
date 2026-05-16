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
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Erros e Debug</h1>
          <p className="admin-page-subtitle">Coleta central de incidentes para análise e correção</p>
        </div>
      </div>

      <div className="admin-card-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{stats.total}</p>
          <p className="admin-stat-label">Eventos exibidos</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{stats.last24h}</p>
          <p className="admin-stat-label">Nas últimas 24h</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{stats.errors}</p>
          <p className="admin-stat-label">Erros</p>
        </div>
        <div className="admin-card admin-stat-card">
          <p className="admin-stat-value">{stats.sources}</p>
          <p className="admin-stat-label">Fontes distintas</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <form method="get" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", alignItems: "end" }}>
          <label style={{ display: "grid", gap: "0.45rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Nível</span>
            <select name="level" defaultValue={level} className="profile-input">
              <option value="all">Todos</option>
              <option value="error">Erro</option>
              <option value="warn">Aviso</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.45rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Fonte</span>
            <input name="source" defaultValue={source || ""} className="profile-input" placeholder="app/error, api/..." />
          </label>

          <label style={{ display: "grid", gap: "0.45rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Busca</span>
            <input name="q" defaultValue={q || ""} className="profile-input" placeholder="texto da mensagem" />
          </label>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" className="button button-primary" style={{ width: "auto" }}>
              Filtrar
            </button>
            <a href="/admin/erros" className="button button-secondary" style={{ width: "auto" }}>
              Limpar
            </a>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Últimos incidentes</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>Clique para revisar o payload completo.</p>
        </div>

        {recent.length === 0 ? (
          <p style={{ margin: 0, color: "var(--muted)" }}>Nenhum evento encontrado com os filtros atuais.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {recent.map((event) => (
              <article
                key={event.id}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "1rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{event.message}</p>
                    <p style={{ margin: "0.35rem 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
                      {new Date(event.created_at).toLocaleString("pt-BR")} · {event.source}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "start" }}>
                    <span className="error-badge">{event.level}</span>
                    <span className="error-badge">{event.event_type}</span>
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
