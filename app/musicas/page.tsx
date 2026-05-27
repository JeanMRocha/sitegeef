import type { Metadata } from "next";
import Link from "next/link";
import { getInstitutionBrand } from "@/lib/institution-brand";
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
  const [brand, musicas] = await Promise.all([getInstitutionBrand(), listPublicMusicas(q)]);

  return (
    <main className="public-page public-page--animated">
      <section className="content-hero public-hero-shell">
        <div className="public-hero-grid">
          <div className="content-copy">
            <p className="eyebrow">Institucional</p>
            <h1>Músicas</h1>
            <div className="content-copy-body">
              <p className="content-summary">
                Busque por autor, nome da música ou trecho da letra. A leitura já respeita o mesmo padrão visual da exibição.
              </p>
              <p className="content-intro">
                O catálogo alimenta a área interna e a tela pública de exibição pareada por código.
              </p>
            </div>

            <form action="/musicas" method="get" className="musica-search-bar">
              <input name="q" type="search" defaultValue={q} placeholder="Autor, título ou trecho da letra" />
              <button type="submit" className="button button-primary">
                Buscar
              </button>
            </form>
          </div>

          <aside className="content-panel">
            <p className="content-panel-label">Controle</p>
            <img src={brand.logoSemFundoUrl} alt="Logo GEEF" className="musica-side-logo" />
            <p className="musica-summary-text" style={{ marginTop: "0.9rem" }}>
              Selecione uma música para leitura completa ou abra a exibição pareada em outra tela.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <Link href="/musicas/exibir" className="button button-secondary">
                Painel de exibição
              </Link>
            </div>
          </aside>
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
              <article key={musica.id} className="musica-catalog-card">
                <div>
                  <p className="eyebrow">{musica.autor}</p>
                  <h2>{musica.titulo}</h2>
                  <p className="musica-catalog-meta">
                    {musica.tom ? `Tom ${musica.tom}` : "Tom não definido"}
                    {musica.versao ? ` • ${musica.versao}` : ""}
                  </p>
                </div>

                <p className="musica-catalog-summary">
                  {musica.partes
                    .map((parte) => parte.conteudo)
                    .join(" ")
                    .slice(0, 160) || "Música disponível para leitura e exibição."}
                </p>

                <div className="musica-catalog-actions">
                  <Link href={`/musicas/${musica.slug}`} className="button button-secondary">
                    Ler
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
