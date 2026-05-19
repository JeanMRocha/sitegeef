import Link from "next/link";
import { loadLgpdAdminData } from "@/lib/lgpd/admin";
import { getOpsEventStats, listOpsEvents, type OpsEventLevel } from "@/lib/observability";

export const metadata = {
  title: "Observabilidade - Admin GEEF",
};

function resolveLevel(level?: string): OpsEventLevel | "all" {
  if (level === "debug" || level === "info" || level === "warn" || level === "error") {
    return level;
  }

  return "all";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function ObservabilityContent({ searchParams }: { searchParams: { level?: string; source?: string; q?: string } }) {
  const level = resolveLevel(searchParams.level);
  const source = searchParams.source?.trim();
  const q = searchParams.q?.trim();

  const [opsEvents, lgpdData] = await Promise.all([
    listOpsEvents({
      limit: 80,
      level,
      source,
      query: q,
    }),
    loadLgpdAdminData(),
  ]);

  const stats = await getOpsEventStats(opsEvents);
  const recentOps = opsEvents.slice(0, 12);
  const lgpdSeverityCounts = lgpdData.registros.reduce<Record<string, number>>((acc, item) => {
    const severity = typeof item.escopo?.severity === "string" ? item.escopo.severity : "info";
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Observabilidade</p>
            <h1 className="area-hero-title">Central de Observabilidade</h1>
            <p className="area-subtitle">
              Erros, debug, falhas silenciosas do Supabase e trilha LGPD num ponto único.
            </p>
          </div>
          <div className="admin-actions">
            <Link href="/admin/observability?level=error" className="admin-btn admin-btn-secondary">
              Erros e Debug
            </Link>
            <Link href="/admin/lgpd" className="admin-btn admin-btn-secondary">
              LGPD
            </Link>
          </div>
        </div>

        <div className="area-summary-grid">
          <div className="area-summary-card">
            <strong>{stats.total}</strong>
            <span>Eventos exibidos</span>
          </div>
          <div className="area-summary-card">
            <strong>{stats.last24h}</strong>
            <span>Últimas 24h</span>
          </div>
          <div className="area-summary-card">
            <strong>{stats.errors}</strong>
            <span>Erros</span>
          </div>
          <div className="area-summary-card">
            <strong>{stats.sources}</strong>
            <span>Fontes distintas</span>
          </div>
          <div className="area-summary-card">
            <strong>{lgpdData.registros.length}</strong>
            <span>Registros LGPD</span>
          </div>
          <div className="area-summary-card">
            <strong>{lgpdData.solicitacoes.length}</strong>
            <span>Pedidos do titular</span>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Atalhos</h2>
          <p>Entradas rápidas para triagem e conformidade.</p>
        </div>
        <div className="module-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Link href="/admin/observability?level=error" className="module-card">
            <p className="module-title">Erros e Debug</p>
            <p style={{ color: "var(--muted)" }}>Incidentes de runtime e payload técnico.</p>
          </Link>
          <Link href="/admin/lgpd" className="module-card">
            <p className="module-title">Central LGPD</p>
            <p style={{ color: "var(--muted)" }}>Cookies, consentimentos e fila do titular.</p>
          </Link>
          <Link href="/admin/documentos/pedidos" className="module-card">
            <p className="module-title">Pedidos do Titular</p>
            <p style={{ color: "var(--muted)" }}>Fila operacional de acesso, correção e revogação.</p>
          </Link>
          <Link href="/admin/documentos/auditoria" className="module-card">
            <p className="module-title">Auditoria LGPD</p>
            <p style={{ color: "var(--muted)" }}>Rastro técnico e eventos de alteração.</p>
          </Link>
        </div>
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
              <a href="/admin/observability" className="profile-form-btn profile-form-btn-secondary">Limpar</a>
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
          {recentOps.length === 0 ? (
            <div className="area-empty">Nenhum evento encontrado com os filtros atuais.</div>
          ) : (
            <div className="area-panel-grid">
              {recentOps.map((event) => (
                <article key={event.id} className="area-panel-item">
                  <div className="area-hero-top" style={{ alignItems: "start" }}>
                    <div>
                      <h3 className="module-title">{event.message}</h3>
                      <p className="area-subtitle">
                        {formatDate(event.created_at)} · {event.source}
                      </p>
                    </div>
                    <div className="tag-list">
                      <span className="tag">{event.level}</span>
                      <span className="tag">{event.event_type}</span>
                    </div>
                  </div>

                  <details>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>Ver detalhes técnicos</summary>
                    <pre
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.9rem",
                        borderRadius: "0.75rem",
                        overflowX: "auto",
                        background: "var(--admin-bg)",
                        border: "1px solid var(--line)",
                        fontSize: "0.82rem",
                      }}
                    >
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </details>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>LGPD por severidade</h2>
          <p>Classificação embutida na observabilidade sem mudar o schema.</p>
        </div>
        <div className="area-summary-grid">
          {(["info", "low", "medium", "high", "critical"] as const).map((severity) => (
            <div key={severity} className="area-summary-card">
              <strong>{lgpdSeverityCounts[severity] || 0}</strong>
              <span>{severity}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function ObservabilityPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;

  return <ObservabilityContent searchParams={resolvedSearchParams} />;
}
