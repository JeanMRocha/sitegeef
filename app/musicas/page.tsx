import type { Metadata } from "next";
import Link from "next/link";
import { MusicasToolbar } from "@/components/musicas/musicas-toolbar";
import { listPublicMusicas } from "@/lib/musicas";

type PageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Músicas - GEEF",
    description: "Catálogo de músicas do GEEF com busca por autor, título e trecho da letra.",
  };
}

export default async function MusicasPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = typeof params.q === "string" ? params.q : "";
  const musicas = await listPublicMusicas(q);

  return (
    <main className="public-page public-page--animated">
      <section className="content-hero public-hero-shell">
        <div className="musica-catalog-header">
          <MusicasToolbar initialQuery={q} />
        </div>
      </section>

      <section className="public-showcase">
        <div className="musica-catalog-grid">
          {musicas.length === 0 ? (
            <article className="content-card">
              <h2>Nenhuma música encontrada</h2>
              <p>Tente outro termo de busca ou cadastre a primeira música na área interna.</p>
            </article>
          ) : (
            musicas.map((musica) => (
              <article key={musica.id} className="musica-catalog-card musica-catalog-card--compact">
                {(() => {
                  const meta = [musica.tom ? `Tom ${musica.tom}` : null, musica.versao ?? null].filter(Boolean).join(" • ");

                  return (
                <div className="musica-catalog-summary-row">
                  <p className="musica-catalog-line" title={`${musica.autor} • ${musica.titulo}`}>
                    <span className="musica-catalog-author-inline">{musica.autor}</span>
                    <span className="musica-catalog-title-inline">{musica.titulo}</span>
                    {meta ? <span className="musica-catalog-meta-inline">{meta}</span> : null}
                  </p>

                  <div className="musica-catalog-actions">
                    <Link href={`/musicas/exibir/${musica.slug}`} className="button button-secondary">
                      Ver
                    </Link>
                  </div>
                </div>
                  );
                })()}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
