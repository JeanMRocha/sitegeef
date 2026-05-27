import { Suspense } from "react";
import { getMusicasResumo, listMusicaSessoes } from "@/lib/musicas";

export const metadata = {
  title: "Reunião pública - Admin GEEF",
};

async function ReuniaoPublicaContent() {
  const [musicasResumo, sessoes] = await Promise.all([
    getMusicasResumo(),
    listMusicaSessoes(),
  ]);

  const sessoesAtivas = sessoes.filter((s) => s.ativo);
  const musicasAtivas = musicasResumo.filter((m) => m.status === "ativa");

  // Agrupar músicas por autor
  const musicasPorAutor = musicasResumo.reduce(
    (acc, musica) => {
      const autor = musica.autor || "Sem autor";
      if (!acc[autor]) {
        acc[autor] = [];
      }
      acc[autor].push(musica);
      return acc;
    },
    {} as Record<string, typeof musicasResumo>
  );

  const autoresUnicos = Object.keys(musicasPorAutor).length;
  const autoresOrdenados = Object.entries(musicasPorAutor)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  return (
    <div className="area-page">
      <section className="area-hero" style={{ paddingBottom: "1.5rem" }}>
        <div className="area-hero-top">
          <div>
            <h1 className="area-hero-title" style={{ fontSize: "2rem" }}>
              Reunião pública
            </h1>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="stat-grid">
          <div className="stat-card">
            <span>Músicas cadastradas</span>
            <strong>{musicasResumo.length}</strong>
            <small style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {musicasAtivas.length} ativas
            </small>
          </div>
          <div className="stat-card">
            <span>Autores únicos</span>
            <strong>{autoresUnicos}</strong>
            <small style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              no catálogo
            </small>
          </div>
          <div className="stat-card">
            <span>Telas ativas</span>
            <strong>{sessoesAtivas.length}</strong>
            <small style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              de {sessoes.length} total
            </small>
          </div>
          <div className="stat-card">
            <span>Taxa de cobertura</span>
            <strong>
              {musicasResumo.length > 0
                ? Math.round((musicasAtivas.length / musicasResumo.length) * 100)
                : 0}%
            </strong>
            <small style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              de músicas prontas
            </small>
          </div>
        </div>
      </section>

      {autoresOrdenados.length > 0 && (
        <section className="area-section">
          <div className="admin-card table-surface">
            <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", fontWeight: 600 }}>
              Top autores
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {autoresOrdenados.map(([autor, musicas]) => {
                const ativas = musicas.filter((m) => m.status === "ativa").length;
                return (
                  <div
                    key={autor}
                    style={{
                      padding: "1rem",
                      borderLeft: "3px solid var(--primary)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>{autor}</strong>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        {musicas.length} {musicas.length === 1 ? "música" : "músicas"}
                        {ativas > 0 && ` • ${ativas} ativa${ativas > 1 ? "s" : ""}`}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                        {ativas}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ativas</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function ReuniaoPublicaPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <ReuniaoPublicaContent />
    </Suspense>
  );
}
