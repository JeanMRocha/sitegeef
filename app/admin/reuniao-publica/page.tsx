import { Suspense } from "react";
import { getMusicasResumo, listMusicaSessoes, listMusicaAutores } from "@/lib/musicas";

export const metadata = {
  title: "Reunião pública - Admin GEEF",
};

async function ReuniaoPublicaContent() {
  const [musicasResumo, sessoes, autores] = await Promise.all([
    getMusicasResumo(),
    listMusicaSessoes(),
    listMusicaAutores(),
  ]);

  const sessoesAtivas = sessoes.filter((s) => s.ativo);
  const musicasAtivas = musicasResumo.filter((m) => m.status === "ativa");

  // Associar músicas com autores (pela tabela musica_autores)
  const autoresComMusicas = autores.map((autor) => {
    const musicas = musicasResumo.filter((m) => m.autor === autor.nome);
    const ativas = musicas.filter((m) => m.status === "ativa").length;
    return {
      ...autor,
      totalMusicas: musicas.length,
      musicasAtivas: ativas,
    };
  });

  const autoresUnicos = autoresComMusicas.length;
  const autoresOrdenados = autoresComMusicas
    .sort((a, b) => b.totalMusicas - a.totalMusicas)
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
              Autores
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {autoresOrdenados.map((autor) => (
                <div
                  key={autor.id}
                  style={{
                    padding: "1rem",
                    borderLeft: "3px solid var(--primary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "0.95rem" }}>{autor.nome}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      {autor.totalMusicas} {autor.totalMusicas === 1 ? "música" : "músicas"}
                      {autor.musicasAtivas > 0 && ` • ${autor.musicasAtivas} ativa${autor.musicasAtivas > 1 ? "s" : ""}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>
                      {autor.musicasAtivas}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ativas</div>
                  </div>
                </div>
              ))}
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
