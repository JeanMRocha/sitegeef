"use client";

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
            {displayCode ? <span className="musica-code-pill">Pareamento {displayCode}</span> : null}
            {showBackLink ? (
              <Link href="/musicas" className="button button-secondary">
                Voltar ao catálogo
              </Link>
            ) : null}
          </div>
        </div>
      </section>

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
        </article>

        <article className="musica-reader-panel musica-reader-panel--lyrics">
          <div className="musica-partes-grid">
            {musica.partes.map((parte, index) => (
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

                <pre className="musica-parte-text">{parte.conteudo}</pre>

                {parte.cifra ? (
                  <div className="musica-cifra-block">
                    <span className="musica-cifra-label">Cifra</span>
                    <pre>{parte.cifra}</pre>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
