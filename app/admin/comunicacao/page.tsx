import Link from "next/link";
import { getPublicacoes } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "Comunicação - Admin GEEF",
};

async function ComunicacaoContent() {
  const publicacoes = await getPublicacoes();
  const publicadas = publicacoes.filter((p: any) => p.status === "publicado");
  const rascunhos = publicacoes.filter((p: any) => p.status === "rascunho");

  const cards = [
    { label: "Publicadas", value: publicadas.length },
    { label: "Rascunhos", value: rascunhos.length },
    { label: "Total", value: publicacoes.length },
  ];

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Comunicação</span>
          <h1 className="admin-page-title">Comunicação</h1>
          <p className="admin-page-subtitle">Gestão de publicações e conteúdo</p>
        </div>
      </div>

      <section className="area-section">
        <div className="stat-grid">
          {cards.map((item) => (
            <div key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div style={{ marginBottom: "1rem" }}>
          <Link href="/admin/comunicacao/nova-publicacao" className="admin-btn admin-btn-primary">
            ➕ Nova Publicação
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="admin-card">
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.1rem", color: "var(--text)" }}>Publicações recentes</h2>

          {publicacoes.length > 0 ? (
            <div className="table-surface">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Autor</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {publicacoes.map((publicacao: any) => (
                    <tr key={publicacao.id}>
                      <td style={{ fontWeight: 500, maxWidth: "200px" }}>{publicacao.titulo}</td>
                      <td style={{ fontSize: "0.9rem" }}>{publicacao.tipo || "—"}</td>
                      <td style={{ fontSize: "0.9rem" }}>{publicacao.autor?.nome}</td>
                      <td>
                        <span
                          className="inline-status"
                          style={{
                            backgroundColor:
                              publicacao.status === "rascunho"
                                ? "rgba(107, 114, 128, 0.1)"
                                : publicacao.status === "revisao"
                                  ? "rgba(168, 85, 247, 0.1)"
                                  : publicacao.status === "aprovado"
                                    ? "rgba(59, 130, 246, 0.1)"
                                    : "rgba(34, 197, 94, 0.1)",
                            color:
                              publicacao.status === "rascunho"
                                ? "#6b7280"
                                : publicacao.status === "revisao"
                                  ? "#a855f7"
                                  : publicacao.status === "aprovado"
                                    ? "#3b82f6"
                                    : "#22c55e",
                          }}
                        >
                          {publicacao.status === "rascunho" && "📝 Rascunho"}
                          {publicacao.status === "revisao" && "🔍 Revisão"}
                          {publicacao.status === "aprovado" && "✓ Aprovado"}
                          {publicacao.status === "publicado" && "🔔 Publicado"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                        {publicacao.publicado_em
                          ? new Date(publicacao.publicado_em).toLocaleDateString("pt-BR")
                          : new Date(publicacao.criado_em).toLocaleDateString("pt-BR")}
                      </td>
                      <td>
                        <Link href={`/admin/comunicacao/${publicacao.id}`} className="admin-btn admin-btn-small">
                          ✏️ Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="area-empty">Nenhuma publicação cadastrada.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ComunicacaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ComunicacaoContent />
    </Suspense>
  );
}
