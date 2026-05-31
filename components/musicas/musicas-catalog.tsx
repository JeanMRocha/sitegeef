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
  const [filterAuthor, setFilterAuthor] = useState("");

  // Derive unique authors sorted alphabetically
  const autores = useMemo(
    () =>
      [...new Set(musicas.map((m) => m.autor).filter(Boolean))].sort(),
    [musicas]
  );

  // Filter client-side
  const filtered = useMemo(() => {
    return musicas.filter((m) => {
      const matchSearch = !searchText || musicaMatchesSearch(m, searchText);
      const matchAuthor = !filterAuthor || m.autor === filterAuthor;
      return matchSearch && matchAuthor;
    });
  }, [musicas, searchText, filterAuthor]);

  const isEmpty = filtered.length === 0;

  return (
    <>
      {/* Toolbar with filters */}
      <div className="musica-toolbar">
        <div className="musica-toolbar-title">
          <h1>Músicas</h1>
        </div>

        <div className="musica-toolbar-filters">
          {/* Author filter select */}
          <select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="musica-toolbar-select"
            aria-label="Filtrar por autor"
          >
            <option value="">Todos os autores</option>
            {autores.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          {/* Text search input */}
          <div className="musica-toolbar-search-wrap">
            <IconSearch size={16} />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar título ou trecho..."
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

          {/* Result counter */}
          <div className="musica-toolbar-count">
            {filtered.length} {filtered.length === 1 ? "música" : "músicas"}
          </div>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="musica-catalog-grid">
        {isEmpty ? (
          <article className="content-card">
            <h2>Nenhuma música encontrada</h2>
            <p>Tente ajustar o filtro ou o termo de busca.</p>
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
                      href={`/musicas/exibir/${musica.slug}`}
                      className="button button-secondary"
                    >
                      Ver
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
