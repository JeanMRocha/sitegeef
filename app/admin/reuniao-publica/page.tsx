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

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Publicação e exibição</p>
            <h1 className="area-hero-title">Reunião pública</h1>
          </div>
        </div>
        <p className="area-subtitle">
          Gerencie o catálogo de músicas, pareamento de telas e transmissão ao vivo da reunião pública.
        </p>
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
            <span>Telas pareadas</span>
            <strong>{sessoes.length}</strong>
            <small style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {sessoesAtivas.length} ativas
            </small>
          </div>
          <div className="stat-card">
            <span>Modo de exibição</span>
            <strong>{sessoes.filter((s) => s.modo === "exibicao").length}</strong>
            <small style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {sessoes.filter((s) => s.modo === "catalogo").length} catálogo
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

      <section className="area-section">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>Sobre este módulo</h2>
            <p>
              Centralize a gestão de músicas, defina pareamentos de tela para exibição ao vivo e controle o que está sendo transmitido durante a reunião pública.
            </p>
          </div>

          <div style={{ marginTop: "2rem", display: "grid", gap: "2rem" }}>
            <div style={{ paddingLeft: "2rem", borderLeft: "3px solid var(--primary)" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 600 }}>
                🎵 Músicas
              </h3>
              <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Cadastre, edite e organize o catálogo de músicas. Defina partes, cifras, autores e estados (ativa, rascunho, inativa).
              </p>
            </div>

            <div style={{ paddingLeft: "2rem", borderLeft: "3px solid var(--primary)" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 600 }}>
                🖥️ Sessões
              </h3>
              <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Pareie telas públicas com códigos, selecione modo de exibição (apresentação ou catálogo) e gerencie o ciclo de vida das sessões.
              </p>
            </div>

            <div style={{ paddingLeft: "2rem", borderLeft: "3px solid var(--primary)" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 600 }}>
                👤 Autores
              </h3>
              <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Normalize e reutilize autores entre múltiplas músicas, evitando duplicatas e mantendo o catálogo consistente.
              </p>
            </div>
          </div>
        </div>
      </section>
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
