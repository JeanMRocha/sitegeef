"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Musica } from "@/lib/musicas";
import { formatParteTipoLabel } from "@/lib/musicas";

type MusicaReaderProps = {
  musica: Musica;
  logoSrc: string;
  displayCode?: string | null;
  mode?: "publico" | "exibicao";
  showBackLink?: boolean;
};

export function MusicaReader({ musica, logoSrc, displayCode, mode = "publico", showBackLink = true }: MusicaReaderProps) {
  const isDisplay = mode === "exibicao";
  const [viewMode, setViewMode] = useState<"letra" | "cifra">("letra");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const partesComCifra = musica.partes.filter((p) => p.cifra);
  const mostrarCifra = viewMode === "cifra";
  const podeAlternarCifra = partesComCifra.length > 0;

  const hasMedia = musica.youtube_url || musica.audio_url;

  useEffect(() => {
    if (isDisplay) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [musica.id, isDisplay]);

  if (isDisplay) {
    return (
      <main
        className="musica-display-shell musica-display-shell--live"
        style={{
          width: "100vw",
          height: "100vh",
          aspectRatio: "16 / 9",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg-dark, #1a1a1a)",
          color: "var(--text-light, #ffffff)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "1.5rem",
            zIndex: 10,
            opacity: 0.7,
          }}
        >
          <img src={logoSrc} alt="Logo GEEF" style={{ height: "3rem", width: "auto" }} />
        </div>

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            padding: "2rem 2rem 1rem",
            backgroundColor: "rgba(26, 26, 26, 0.95)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem" }}>{musica.titulo}</h1>
          <p style={{ margin: 0, fontSize: "1rem", opacity: 0.8 }}>
            {musica.autor}
            {musica.tom ? ` • Tom ${musica.tom}` : ""}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          <div style={{ display: "grid", gap: "2rem" }}>
            {musica.partes
              .filter((parte) => !mostrarCifra || parte.cifra)
              .map((parte, index) => (
                <section
                  key={parte.id ?? `${musica.id}-${index}`}
                  style={{
                    padding: "1.5rem",
                    backgroundColor: parte.destaque ? "rgba(138, 0, 90, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    borderRadius: "0.5rem",
                    borderLeft: parte.destaque ? "4px solid #8a005a" : "4px solid transparent",
                  }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ fontSize: "0.9rem", opacity: 0.6, margin: "0 0 0.5rem" }}>
                      {formatParteTipoLabel(parte.tipo)}
                    </p>
                    <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
                      {parte.titulo || formatParteTipoLabel(parte.tipo)}
                    </h2>
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: "inherit",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {mostrarCifra ? parte.cifra : parte.conteudo}
                  </pre>
                </section>
              ))}
          </div>
        </div>

        <style jsx>{`
          @media (max-aspect-ratio: 16/9) {
            .musica-display-shell--live {
              height: 100vw;
              width: auto;
              aspect-ratio: 9 / 16;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className={`musica-page ${isDisplay ? "musica-page--display" : ""}`}>
      <section className="musica-hero public-hero-shell">
        <div className="musica-hero-bar">
          <div className="musica-brand-block">
            <div className="musica-brand-logo">
              <Image src={logoSrc} alt="Logo GEEF" width={190} height={76} priority />
            </div>
            <div>
              <p className="eyebrow">Institucional</p>
              <h1>{musica.titulo}</h1>
              <p className="musica-hero-subtitle">
                {musica.autor}
                {musica.tom ? ` • Tom ${musica.tom}` : ""}
                {musica.versao ? ` • ${musica.versao}` : ""}
              </p>
            </div>
          </div>

          <div className="musica-hero-actions">
            {displayCode && !isDisplay ? <span className="musica-code-pill">Pareamento {displayCode}</span> : null}
            {showBackLink ? (
              <Link href="/musicas" className="button button-secondary">
                Voltar ao catálogo
              </Link>
            ) : null}
            {!isDisplay && (
              <button
                onClick={() => window.print()}
                className="button button-secondary"
                title="Imprimir"
              >
                Imprimir
              </button>
            )}
          </div>
        </div>
      </section>

      {hasMedia && !isDisplay && (
        <section className="musica-media-section" style={{ padding: "1.5rem 0", borderBottom: "1px solid var(--border-medium)" }}>
          <div className="area-container">
            {musica.youtube_url && (
              <div style={{ marginBottom: musica.audio_url ? "1.5rem" : 0 }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem" }}>Vídeo</p>
                <iframe
                  width="100%"
                  height="400"
                  src={musica.youtube_url.replace("watch?v=", "embed/")}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ borderRadius: "0.5rem" }}
                />
              </div>
            )}
            {musica.audio_url && (
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem" }}>Áudio</p>
                <audio controls style={{ width: "100%", marginBottom: "0.5rem" }}>
                  <source src={musica.audio_url} type="audio/mpeg" />
                  Seu navegador não suporta reprodução de áudio.
                </audio>
                <div>
                  <a
                    href={musica.audio_url}
                    download
                    className="button button-secondary"
                    style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                  >
                    Baixar MP3
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="musica-reader-grid">
        <article className="musica-reader-panel musica-reader-panel--summary">
          <p className="content-panel-label">Resumo</p>
          <p className="musica-summary-text">
            {musica.observacoes ||
              "Leia, procure e apresente a música com o mesmo padrão visual em qualquer tela."}
          </p>

          <div className="musica-meta-list">
            <div>
              <span>Autor</span>
              <strong>{musica.autor}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{musica.status === "ativa" ? "Ativa" : musica.status === "rascunho" ? "Rascunho" : "Inativa"}</strong>
            </div>
            <div>
              <span>Partes</span>
              <strong>{musica.partes.length}</strong>
            </div>
            <div>
              <span>Tom</span>
              <strong>{musica.tom || "—"}</strong>
            </div>
          </div>

          {podeAlternarCifra && !isDisplay && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-medium)" }}>
              <p className="content-panel-label" style={{ marginBottom: "0.75rem" }}>Visualização</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setViewMode("letra")}
                  className={`button ${viewMode === "letra" ? "button-primary" : "button-secondary"}`}
                  style={{ flex: 1, fontSize: "0.875rem" }}
                >
                  Letra
                </button>
                <button
                  onClick={() => setViewMode("cifra")}
                  className={`button ${viewMode === "cifra" ? "button-primary" : "button-secondary"}`}
                  style={{ flex: 1, fontSize: "0.875rem" }}
                >
                  Cifra
                </button>
              </div>
            </div>
          )}
        </article>

        <article className="musica-reader-panel musica-reader-panel--lyrics">
          <div className="musica-partes-grid">
            {musica.partes
              .filter((parte) => !mostrarCifra || parte.cifra)
              .map((parte, index) => (
                <section
                  key={parte.id ?? `${musica.id}-${index}`}
                  className={`musica-parte ${parte.destaque ? "is-highlighted" : ""} musica-parte--${parte.tipo}`}
                >
                  <div className="musica-parte-heading">
                    <span className="musica-parte-badge">{index + 1}</span>
                    <div>
                      <p className="musica-parte-kicker">{formatParteTipoLabel(parte.tipo)}</p>
                      <h2>{parte.titulo || formatParteTipoLabel(parte.tipo)}</h2>
                    </div>
                  </div>

                  <pre className="musica-parte-text">
                    {mostrarCifra ? parte.cifra : parte.conteudo}
                  </pre>
                </section>
              ))}
          </div>
        </article>
      </section>

      <style jsx>{`
        @media print {
          .musica-hero-actions,
          .musica-reader-panel--summary,
          .musica-media-section {
            display: none;
          }
          .musica-reader-grid {
            display: block;
          }
          .musica-reader-panel {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
