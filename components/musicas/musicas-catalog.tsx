"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Musica } from "@/lib/musicas";
import { musicaMatchesSearch } from "@/lib/musicas";
import { IconSearch, IconX } from "@/components/icons";

type MusicasCatalogProps = {
  musicas: Musica[];
};

export function MusicasCatalog({ musicas }: MusicasCatalogProps) {
  const [searchText, setSearchText] = useState("");

  const filtered = useMemo(() => {
    return musicas.filter((m) => !searchText || musicaMatchesSearch(m, searchText));
  }, [musicas, searchText]);

  const isEmpty = filtered.length === 0;

  return (
    <>
      <div className="musica-toolbar">
        <div className="musica-toolbar-title">
          <h1>Músicas</h1>
        </div>

        <div className="musica-toolbar-filters">
          <div className="musica-toolbar-search-wrap">
            <IconSearch size={16} />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar título, autor ou trecho..."
              className="musica-toolbar-search-input"
              aria-label="Buscar músicas"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="musica-toolbar-search-clear"
                aria-label="Limpar busca"
              >
                <IconX size={14} />
              </button>
            )}
          </div>

          <div className="musica-toolbar-count">
            {filtered.length} {filtered.length === 1 ? "música" : "músicas"}
          </div>
        </div>
      </div>

      <div className="musica-catalog-grid">
        {isEmpty ? (
          <article className="content-card">
            <h2>Nenhuma música encontrada</h2>
            <p>Tente ajustar o termo de busca.</p>
          </article>
        ) : (
          filtered.map((musica) => {
            const meta = [
              musica.tom ? `Tom ${musica.tom}` : null,
              musica.versao ?? null,
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <article
                key={musica.id}
                className="musica-catalog-card musica-catalog-card--compact"
              >
                <div className="musica-catalog-summary-row">
                  <p
                    className="musica-catalog-line"
                    title={`${musica.autor} • ${musica.titulo}`}
                  >
                    <span className="musica-catalog-author-inline">
                      {musica.autor}
                    </span>
                    <span className="musica-catalog-title-inline">
                      {musica.titulo}
                    </span>
                    {meta && (
                      <span className="musica-catalog-meta-inline">{meta}</span>
                    )}
                  </p>

                  <div className="musica-catalog-actions">
                    <Link
                      href={`/musicas/${musica.slug}`}
                      className="button button-secondary"
                    >
                      Ler
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
