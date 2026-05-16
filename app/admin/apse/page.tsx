import Link from "next/link";
import { getFamilias, getCampanhas, getAtendimentos } from "./actions";
import { Suspense } from "react";

export const metadata = {
  title: "APSE - Admin GEEF",
};

async function ApseContent() {
  const familias = await getFamilias();
  const campanhas = await getCampanhas();
  const atendimentos = await getAtendimentos();
  const campanhasAtivas = campanhas.filter((c: any) => c.status === "planejada" || c.status === "em_execucao");

  const cards = [
    { label: "Famílias ativas", value: familias.filter((f: any) => f.status === "ativa").length },
    { label: "Campanhas ativas", value: campanhasAtivas.length },
    { label: "Atendimentos", value: atendimentos.length },
  ];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">APSE</p>
            <h1 className="area-hero-title">Assistência Social</h1>
          </div>
        </div>
        <p className="area-subtitle">Gestão de famílias assistidas, campanhas e atendimentos.</p>
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
        <div className="module-grid">
          <Link href="/admin/apse/familias" className="module-card">
            <p className="module-title">👨‍👩‍👧‍👦 Famílias</p>
            <p>Cadastro e acompanhamento das famílias assistidas.</p>
          </Link>
          <Link href="/admin/apse/campanhas" className="module-card">
            <p className="module-title">📢 Campanhas</p>
            <p>Planejamento e execução das campanhas sociais.</p>
          </Link>
          <Link href="/admin/apse/atendimentos" className="module-card">
            <p className="module-title">🤝 Atendimentos</p>
            <p>Histórico consolidado de atendimentos realizados.</p>
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Campanhas ativas</h2>
          <p>Campanhas em planejamento ou andamento.</p>
        </div>
        <div className="table-surface">

          {campanhasAtivas.length > 0 ? (
            <div className="module-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
              {campanhasAtivas.map((campanha: any) => (
                <Link
                  key={campanha.id}
                  href={`/admin/apse/campanhas/${campanha.id}`}
                  className="module-card"
                >
                  <p className="module-title">{campanha.nome}</p>
                  <p>{campanha.descricao || "Sem descrição"}</p>
                  {campanha.meta && (
                    <p style={{ marginTop: "0.5rem", color: "var(--muted)", fontSize: "0.85rem" }}>
                      Meta: {campanha.meta}
                    </p>
                  )}
                  <span
                    className="inline-status"
                    style={{
                      marginTop: "0.75rem",
                      backgroundColor: campanha.status === "planejada" ? "rgba(168, 85, 247, 0.1)" : "rgba(59, 130, 246, 0.1)",
                      color: campanha.status === "planejada" ? "#a855f7" : "#3b82f6",
                    }}
                  >
                    {campanha.status === "planejada" ? "📋 Planejada" : "▶ Em execução"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="area-empty">Nenhuma campanha ativa.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ApsePage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ApseContent />
    </Suspense>
  );
}
