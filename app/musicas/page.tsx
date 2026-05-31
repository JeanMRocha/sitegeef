import type { Metadata } from "next";
import { MusicasCatalog } from "@/components/musicas/musicas-catalog";
import { listPublicMusicas } from "@/lib/musicas";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Músicas - GEEF",
    description: "Catálogo de músicas do GEEF com busca por autor, título e trecho da letra.",
  };
}

export default async function MusicasPage() {
  const musicas = await listPublicMusicas();

  return (
    <main className="public-page public-page--animated">
      <section className="content-hero public-hero-shell">
        <div className="musica-catalog-header">
          <MusicasCatalog musicas={musicas} />
        </div>
      </section>

      <section className="public-showcase">
        {/* Conteúdo renderizado pelo MusicasCatalog */}
      </section>
    </main>
  );
}
