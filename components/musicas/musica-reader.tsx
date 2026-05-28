"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Musica } from "@/lib/musicas";
import { formatParteTipoLabel, isTituloSameasTipo } from "@/lib/musicas";
import { IconArrowLeft, IconExternalLink, IconPrinter } from "@/components/icons";

type MusicaReaderProps = {
  musica: Musica;
  logoSrc: string;
  displayCode?: string | null;
  mode?: "publico" | "exibicao";
  showBackLink?: boolean;
  showBranding?: boolean;
};

export function MusicaReader({
  musica,
  logoSrc,
  displayCode,
  mode = "publico",
  showBackLink = true,
  showBranding = true,
}: MusicaReaderProps) {
  const isDisplay = mode === "exibicao";
  const [viewMode, setViewMode] = useState<"letra" | "cifra">("letra");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pipExpanded, setPipExpanded] = useState(false);
  const [pipHidden, setPipHidden] = useState(false);

  const partesComCifra = musica.partes.filter((p) => p.cifra);
  const mostrarCifra = viewMode === "cifra";
  const podeAlternarCifra = partesComCifra.length > 0;

  const hasMedia = musica.youtube_url || musica.audio_url;
  const partesVisiveis = musica.partes.filter((parte) => !mostrarCifra || parte.cifra);
  const meio = Math.ceil(partesVisiveis.length / 2);
  const blocosLetra = [
    partesVisiveis.slice(0, meio),
    partesVisiveis.slice(meio),
  ].filter((bloco) => bloco.length > 0);

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

  const openExibicaoHref = `/admin/reuniao-publica/musicas/sessoes/novo?musica_id=${encodeURIComponent(musica.id)}`;

  return (
    <main className={`musica-page ${isDisplay ? "musica-page--display" : ""}`}>
      <section className="musica-hero public-hero-shell">
        <div className={`musica-reader-header ${showBranding ? "" : "musica-reader-header--compact"}`}>
          {showBranding ? (
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
          ) : (
            <div className="musica-reader-title-only">
              <h1>{musica.titulo}</h1>
              <p className="musica-hero-subtitle">
                {musica.autor}
                {musica.tom || musica.versao ? " •" : ""}
                {musica.tom ? ` Tom ${musica.tom}` : ""}
                {musica.versao ? ` • ${musica.versao}` : ""}
              </p>
            </div>
          )}

          <div className="musica-reader-actions">
            {displayCode && !isDisplay ? <span className="musica-code-pill">Pareamento {displayCode}</span> : null}
            {showBackLink ? (
              <Link href="/musicas" className="button button-secondary musica-icon-button" aria-label="Voltar ao catálogo" title="Voltar ao catálogo">
                <IconArrowLeft size={18} />
              </Link>
            ) : null}
            {!isDisplay ? (
              <button
                onClick={() => window.print()}
                className="button button-secondary musica-icon-button"
                aria-label="Imprimir música"
                title="Imprimir música"
              >
                <IconPrinter size={18} />
              </button>
            ) : null}
            {!isDisplay && podeAlternarCifra ? (
              <button
                onClick={() => setViewMode(viewMode === "letra" ? "cifra" : "letra")}
                className="button button-secondary musica-icon-button"
                aria-label={`Exibir ${viewMode === "letra" ? "cifra" : "letra"}`}
                title={`Exibir ${viewMode === "letra" ? "cifra" : "letra"}`}
              >
                🎼
              </button>
            ) : null}
            {!isDisplay ? (
              <Link
                href={openExibicaoHref}
                className="button button-primary musica-icon-button"
                aria-label="Levar a música para exibição"
                title="Levar a música para exibição"
              >
                <IconExternalLink size={18} />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {!isDisplay && (
        <>
          {podeAlternarCifra && (
            <section className="musica-reader-top-grid">
              <article className="musica-reader-panel musica-reader-panel--summary">
                <p className="content-panel-label" style={{ marginBottom: "0.75rem" }}>Visualização</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => setViewMode("letra")}
                    className={`button ${viewMode === "letra" ? "button-primary" : "button-secondary"}`}
                    style={{ flex: 1, fontSize: "0.875rem", minWidth: 0 }}
                  >
                    Letra
                  </button>
                  <button
                    onClick={() => setViewMode("cifra")}
                    className={`button ${viewMode === "cifra" ? "button-primary" : "button-secondary"}`}
                    style={{ flex: 1, fontSize: "0.875rem", minWidth: 0 }}
                  >
                    Cifra
                  </button>
                </div>
              </article>
            </section>
          )}

          <section className="musica-reader-lyrics">
            <article className="musica-reader-panel musica-reader-panel--lyrics musica-reader-panel--lyrics-full">
              <div className="musica-letra-blocos">
                {partesVisiveis.map((parte, index) => {
                  const estrofeCount = partesVisiveis
                    .slice(0, index + 1)
                    .filter((p) => p.tipo === "estrofe").length;
                  const tipoLabel = formatParteTipoLabel(parte.tipo);
                  const displayLabel =
                    parte.tipo === "estrofe" ? `${tipoLabel} ${String(estrofeCount).padStart(2, "0")}` : tipoLabel;

                  return (
                    <section
                      key={parte.id ?? `${musica.id}-${index}`}
                      className={`musica-parte-musical ${parte.destaque ? "is-highlighted" : ""}`}
                    >
                      <div className="musica-parte-type-badge">
                        {displayLabel}
                      </div>
                    {parte.titulo && !isTituloSameasTipo(parte.titulo, formatParteTipoLabel(parte.tipo)) && (
                      <h3 className="musica-parte-title">{parte.titulo}</h3>
                    )}
                    <pre className="musica-parte-text musica-parte-text--compact">
                      {mostrarCifra ? parte.cifra : parte.conteudo}
                    </pre>
                    </section>
                  );
                })}
              </div>
            </article>
          </section>
          {hasMedia && (
            <>
              {/* PiP Widget */}
              <div
                className={`musica-pip-widget ${pipHidden ? "is-hidden" : ""} ${pipExpanded ? "is-expanded" : ""}`}
              >
                <div className="musica-pip-content">
                  {musica.youtube_url && (
                    <iframe
                      width="100%"
                      height="100%"
                      src={musica.youtube_url.replace("watch?v=", "embed/")}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ borderRadius: "0.5rem" }}
                    />
                  )}
                  {!musica.youtube_url && musica.audio_url && (
                    <audio controls style={{ width: "100%", borderRadius: "0.5rem" }}>
                      <source src={musica.audio_url} type="audio/mpeg" />
                      Seu navegador não suporta reprodução de áudio.
                    </audio>
                  )}
                </div>
                <div className="musica-pip-controls">
                  <button
                    onClick={() => setPipExpanded(true)}
                    className="musica-pip-btn"
                    aria-label="Expandir vídeo"
                    title="Expandir"
                  >
                    ⛶
                  </button>
                  <button
                    onClick={() => setPipHidden(true)}
                    className="musica-pip-btn"
                    aria-label="Minimizar vídeo"
                    title="Minimizar"
                  >
                    −
                  </button>
                </div>
              </div>

              {/* Modal expandida */}
              {pipExpanded && (
                <dialog
                  className="musica-pip-modal"
                  open
                  onClick={() => setPipExpanded(false)}
                >
                  <div className="musica-pip-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setPipExpanded(false)}
                      className="musica-pip-modal-close"
                      aria-label="Fechar"
                    >
                      ✕
                    </button>
                    <div className="musica-pip-modal-frame">
                      {musica.youtube_url && (
                        <iframe
                          width="100%"
                          height="100%"
                          src={musica.youtube_url.replace("watch?v=", "embed/")}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )}
                      {!musica.youtube_url && musica.audio_url && (
                        <audio controls style={{ width: "100%" }}>
                          <source src={musica.audio_url} type="audio/mpeg" />
                          Seu navegador não suporta reprodução de áudio.
                        </audio>
                      )}
                    </div>
                  </div>
                </dialog>
              )}
            </>
          )}
        </>
      )}

      <style jsx>{`
        @media print {
          .musica-hero-actions,
          .musica-reader-panel--summary,
          .musica-reader-panel--media {
            display: none;
          }
          .musica-reader-top-grid {
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
