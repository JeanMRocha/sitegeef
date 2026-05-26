"use client";

import { useEffect, useState } from "react";
import type { Musica, MusicaSessao } from "@/lib/musicas";
import { MusicaReader } from "@/components/musicas/musica-reader";

type MusicaDisplayLiveProps = {
  codigo: string;
  logoSrc: string;
  initialSessao: MusicaSessao;
  initialMusica: Musica | null;
};

type SessaoResponse = {
  sessao: MusicaSessao;
  musica: Musica | null;
};

export function MusicaDisplayLive({ codigo, logoSrc, initialSessao, initialMusica }: MusicaDisplayLiveProps) {
  const [data, setData] = useState<SessaoResponse>({ sessao: initialSessao, musica: initialMusica });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      setLoading(true);
      try {
        const response = await fetch(`/api/musicas/sessoes/${encodeURIComponent(codigo)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const nextData = (await response.json()) as SessaoResponse;
        if (!cancelled) {
          setData(nextData);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    refresh();
    const interval = window.setInterval(refresh, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [codigo]);

  const { sessao, musica } = data;

  if (!sessao.ativo) {
    return (
      <main className="musica-display-shell musica-display-shell--idle">
        <div className="musica-display-idle-card">
          <img src={logoSrc} alt="Logo GEEF" className="musica-display-logo" />
          <p className="eyebrow">Exibição desativada</p>
          <h1>Sessão {codigo}</h1>
          <p>Ative a tela novamente na área interna para continuar a apresentação.</p>
        </div>
      </main>
    );
  }

  if (!musica || sessao.modo === "catalogo") {
    return (
      <main className="musica-display-shell musica-display-shell--catalogo">
        <section className="musica-display-stage">
          <div className="musica-display-top">
            <img src={logoSrc} alt="Logo GEEF" className="musica-display-logo" />
            <div className="musica-display-pair">
              <p className="eyebrow">Exibição</p>
              <h1>Catálogo em tela</h1>
              <p>
                {musica ? "A tela está em modo catálogo." : "Aguardando uma música ser vinculada a esta sessão."}
              </p>
            </div>
            <span className="musica-code-pill">Código {codigo}</span>
          </div>

          <div className="musica-display-empty">
            <p className="content-panel-label">Controle</p>
            <p>
              {loading
                ? "Atualizando estado da sessão..."
                : "Use a área interna para escolher a música e alternar o modo para exibição."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <MusicaReader
      musica={musica}
      logoSrc={logoSrc}
      displayCode={codigo}
      mode="exibicao"
      showBackLink={false}
    />
  );
}
