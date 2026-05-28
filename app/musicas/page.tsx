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
              <details key={musica.id} className="musica-catalog-card musica-catalog-compact">
                <summary className="musica-catalog-summary-row">
                  <div className="musica-catalog-summary-main">
                    <span className="musica-catalog-author">{musica.autor}</span>
                    <strong className="musica-catalog-title">{musica.titulo}</strong>
                    <span className="musica-catalog-meta">
                      {musica.tom ? `Tom ${musica.tom}` : "Tom não definido"}
                      {musica.versao ? ` • ${musica.versao}` : ""}
                      <span className="musica-catalog-partes">{` • ${musica.partes.length} partes`}</span>
                    </span>
                  </div>
                  <span className="musica-catalog-summary-cta">Ler</span>
                </summary>

                <div className="musica-catalog-expanded">
                  <p className="musica-catalog-summary">
                    {musica.partes
                      .map((parte) => parte.conteudo)
                      .join(" ")
                      .slice(0, 160) || "Música disponível para leitura e exibição."}
                  </p>

                  <div className="musica-catalog-actions">
                    <Link href={`/musicas/${musica.slug}`} className="button button-secondary">
                      Ler completo
                    </Link>
                  </div>
                </div>
              </details>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
