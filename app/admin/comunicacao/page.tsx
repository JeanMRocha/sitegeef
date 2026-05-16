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
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Comunicação</p>
            <h1 className="area-hero-title">Comunicação</h1>
          </div>
          <Link href="/admin/comunicacao/nova-publicacao" className="profile-form-btn profile-form-btn-primary">
            Nova Publicação
          </Link>
        </div>
        <p className="area-subtitle">Gestão de publicações e conteúdo.</p>
      </section>

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
        <div className="area-section-title">
          <h2>Publicações recentes</h2>
          <p>Visão geral do conteúdo já cadastrado.</p>
        </div>
        <div className="table-surface">
          {publicacoes.length > 0 ? (
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
                    <td>{publicacao.tipo || "—"}</td>
                    <td>{publicacao.autor?.nome || "—"}</td>
                    <td>
                      <span className="inline-status" style={{
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
                      }}>
                        {publicacao.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)" }}>
                      {publicacao.publicado_em
                        ? new Date(publicacao.publicado_em).toLocaleDateString("pt-BR")
                        : new Date(publicacao.criado_em).toLocaleDateString("pt-BR")}
                    </td>
                    <td>
                      <Link href={`/admin/comunicacao/${publicacao.id}`} className="profile-form-btn profile-form-btn-secondary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
