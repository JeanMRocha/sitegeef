"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Musica } from "@/lib/musicas";
import { formatParteTipoLabel, isTituloSameasTipo } from "@/lib/musicas";
import { IconArrowLeft, IconExternalLink, IconPrinter } from "@/components/icons";

function isChordLine(line: string): boolean {
  if (!line || !line.trim()) return false;
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  const chordPattern = /^[A-G][#b]?(m|M|maj|min|dim|aug|sus[24]?|add[0-9]?|[0-9]+|°|ø)*$/;
  return tokens.every((token) => chordPattern.test(token));
}

function CifraLineRenderer({ text, hideChords }: { text: string; hideChords: boolean }) {
  const lines = text.split("\n");

  if (hideChords) {
    // Renderizar só as linhas de letra (sem acordes)
    return (
      <div className="musica-cifra-inline">
        {lines.map((line, idx) => {
          if (isChordLine(line)) return null;
          if (!line.trim()) {
            return <div key={idx} className="musica-lyric-spacer" />;
          }
          return (
            <pre key={idx} className="musica-lyric-row">
              {line}
            </pre>
          );
        })}
      </div>
    );
  }

  // Renderizar com acordes acima das letras
  return (
    <div className="musica-cifra-inline">
      {lines.map((line, idx) => {
        if (isChordLine(line)) {
          return (
            <pre key={idx} className="musica-chord-row">
              {line}
            </pre>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className="musica-lyric-spacer" />;
        }
        return (
          <pre key={idx} className="musica-lyric-row">
            {line}
          </pre>
        );
      })}
    </div>
  );
}

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
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"letra" | "cifra">("letra");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pipExpanded, setPipExpanded] = useState(false);
  const [pipHidden, setPipHidden] = useState(false);
  const [viewport, setViewport] = useState(() => ({
    width: 1366,
    height: 768,
  }));

  const partesComCifra = musica.partes.filter((p) => p.cifra);
  const hasInlineChords = musica.partes.some((p) =>
    p.conteudo.split("\n").some(isChordLine)
  );
  const mostrarCifra = viewMode === "cifra";
  const podeAlternarCifra = partesComCifra.length > 0 || hasInlineChords;

  const hasMedia = musica.youtube_url || musica.audio_url;
  const partesVisiveis = musica.partes.filter((parte) => !mostrarCifra || parte.cifra);
  const displayMetrics = useMemo(() => {
    const totalLines = partesVisiveis.reduce((sum, parte) => sum + parte.conteudo.split("\n").length, 0);
    const totalChars = partesVisiveis.reduce((sum, parte) => sum + parte.conteudo.length, 0);
    const density = totalLines * 24 + totalChars / 22 + partesVisiveis.length * 72;
    const heightFactor = Math.min(1, viewport.height / 900);
    const widthFactor = Math.min(1, viewport.width / 1600);
    const densityFactor = density > 1200 ? 0.78 : density > 900 ? 0.86 : density > 650 ? 0.92 : 1;
    const scale = Math.max(0.78, Math.min(1, heightFactor * widthFactor * densityFactor + 0.08));
    const maxColumnsByWidth = Math.min(4, Math.max(2, Math.floor((viewport.width - 96) / 360)));
    const versesPerColumn = viewport.height < 760 ? 5 : viewport.height < 880 ? 6 : 7;
    const columnsByVerseCount = Math.max(1, Math.ceil(partesVisiveis.length / versesPerColumn));
    const columnsByHeight = Math.max(
      1,
      Math.ceil(
        (totalLines * 17 + partesVisiveis.length * 34) /
          Math.max(380, viewport.height - 260),
      ),
    );
    const columns = viewport.width < 980
      ? 1
      : Math.min(maxColumnsByWidth, Math.max(columnsByVerseCount, columnsByHeight));
    const bodyGap = columns >= 4 ? 0.48 : columns === 3 ? 0.58 : scale < 0.85 ? 0.7 : scale < 0.92 ? 0.8 : 0.9;
    const headerPaddingY = scale < 0.85 ? 0.82 : scale < 0.92 ? 1 : 1.2;
    const headerPaddingX = scale < 0.85 ? 0.75 : scale < 0.92 ? 1 : 1.25;
    const titleSize = columns >= 4 ? 1.55 : columns === 3 ? 2.05 : scale < 0.85 ? 1.7 : scale < 0.92 ? 1.9 : 2.2;
    const subtitleSize = columns >= 4 ? 0.8 : columns === 3 ? 0.92 : scale < 0.85 ? 0.86 : scale < 0.92 ? 0.94 : 1;
    const logoWidth = columns >= 4 ? 62 : columns === 3 ? 78 : scale < 0.85 ? 76 : scale < 0.92 ? 86 : 96;
    const bodyPaddingTop = columns >= 4 ? 0.45 : columns === 3 ? 0.7 : scale < 0.85 ? 0.65 : scale < 0.92 ? 0.9 : 1.15;
    const versePad = columns >= 4 ? 0.58 : columns === 3 ? 0.85 : scale < 0.85 ? 0.8 : scale < 0.92 ? 0.92 : 1.02;
    const verseTitle = columns >= 4 ? 0.9 : columns === 3 ? 1.08 : scale < 0.85 ? 0.98 : scale < 0.92 ? 1.04 : 1.15;
    const verseText = columns >= 4 ? 0.9 : columns === 3 ? 1.08 : scale < 0.85 ? 0.92 : scale < 0.92 ? 1 : 1.08;
    const verseMinHeight =
      totalLines <= 14
        ? 8.8
        : totalLines <= 20
          ? 8
          : totalLines <= 30
            ? 7.1
            : totalLines <= 42
              ? 6.4
              : 5.8;

    return {
      scale,
      columns,
      bodyGap,
      headerPaddingY,
      headerPaddingX,
      titleSize,
      subtitleSize,
      logoWidth,
      bodyPaddingTop,
      versePad,
      verseTitle,
      verseText,
      verseMinHeight,
    };
  }, [partesVisiveis, viewport.height, viewport.width]);
  useEffect(() => {
    if (isDisplay) {
      document.body.classList.add("musica-display-route");
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => {
        clearTimeout(timer);
        document.body.classList.remove("musica-display-route");
      };
    }
    document.body.classList.remove("musica-display-route");
  }, [musica.id, isDisplay]);

  useEffect(() => {
    if (!isDisplay) return;

    function handleResize() {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isDisplay, musica.id]);

  if (isDisplay) {
    let estrofeCount = 0;

    return (
      <main
        className="musica-display-screen musica-display-screen--reader"
        style={
          {
            ["--display-scale" as string]: displayMetrics.scale,
            ["--display-columns" as string]: displayMetrics.columns,
            ["--display-body-gap" as string]: `${displayMetrics.bodyGap}rem`,
            ["--display-header-pad-y" as string]: `${displayMetrics.headerPaddingY}rem`,
            ["--display-header-pad-x" as string]: `${displayMetrics.headerPaddingX}rem`,
            ["--display-title-size" as string]: `${displayMetrics.titleSize}rem`,
            ["--display-subtitle-size" as string]: `${displayMetrics.subtitleSize}rem`,
            ["--display-logo-width" as string]: `${displayMetrics.logoWidth}px`,
            ["--display-body-pad-top" as string]: `${displayMetrics.bodyPaddingTop}rem`,
            ["--display-verse-pad" as string]: `${displayMetrics.versePad}rem`,
            ["--display-verse-title" as string]: `${displayMetrics.verseTitle}rem`,
            ["--display-verse-text" as string]: `${displayMetrics.verseText}rem`,
            ["--display-verse-min-height" as string]: `${displayMetrics.verseMinHeight}rem`,
          } as CSSProperties
        }
      >
        <div className="musica-display-floating-controls">
          <button
            type="button"
            className="musica-display-back-btn"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
                return;
              }
              router.push("/musicas");
            }}
            aria-label="Voltar"
            title="Voltar"
          >
            <IconArrowLeft size={16} />
            <span>Voltar</span>
          </button>
        </div>

        <div className="musica-display-header-16x9">
          <div className="musica-display-header-spacer" aria-hidden="true" />
          <div className="musica-display-header-title">
            <h1>{musica.titulo}</h1>
            <p className="musica-display-header-subtitle">
              {musica.autor}
              {musica.tom ? ` • Tom ${musica.tom}` : ""}
              {musica.versao ? ` • ${musica.versao}` : ""}
            </p>
          </div>

          <div className="musica-display-header-logo-wrap">
            <img src={logoSrc} alt="Logo GEEF" className="musica-display-header-logo" />
          </div>
        </div>

        <div className="musica-display-body-16x9">
          {musica.partes
            .filter((parte) => !mostrarCifra || parte.cifra)
            .map((parte, index) => {
              if (parte.tipo === "estrofe") {
                estrofeCount += 1;
              }

              const tipoLabel = formatParteTipoLabel(parte.tipo);
              const displayLabel =
                parte.tipo === "estrofe" ? `${tipoLabel} ${String(estrofeCount).padStart(2, "0")}` : tipoLabel;

              return (
                <div
                  key={parte.id ?? `${musica.id}-${index}`}
                  className={`musica-display-verse-16x9 musica-display-verse-16x9--reader ${parte.destaque ? "is-highlighted" : ""}`}
                >
                  <div className="musica-display-verse-content musica-display-verse-content--reader">
                    <p className="musica-display-verse-label">{displayLabel}</p>
                    {parte.titulo && !isTituloSameasTipo(parte.titulo, tipoLabel) ? (
                      <h2 className="musica-display-verse-title">{parte.titulo}</h2>
                    ) : null}
                    <pre className="musica-display-verse-text">
                      {mostrarCifra ? parte.cifra : parte.conteudo}
                    </pre>
                  </div>
                </div>
              );
            })}
        </div>
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
                    {mostrarCifra && parte.cifra ? (
                      <pre className="musica-parte-text musica-parte-text--compact">
                        {parte.cifra}
                      </pre>
                    ) : (
                      <CifraLineRenderer text={parte.conteudo} hideChords={mostrarCifra} />
                    )}
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
