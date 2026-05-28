import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowLeft, IconExternalLink } from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Exibição pública - Músicas GEEF",
    description: "Tela de orientação para abrir a exibição pública de músicas do GEEF.",
  };
}

export default async function MusicasExibirPage() {
  return (
    <main className="public-page public-page--animated">
      <section className="content-hero public-hero-shell">
        <div className="musica-catalog-header">
          <div className="musica-toolbar">
            <div className="musica-toolbar-title">
              <h1>Exibição pública</h1>
            </div>

            <div className="musica-toolbar-actions">
              <Link
                href="/musicas"
                className="button button-secondary musica-icon-button"
                aria-label="Voltar ao catálogo"
                title="Voltar ao catálogo"
              >
                <IconArrowLeft size={18} />
              </Link>
              <Link
                href="/admin/reuniao-publica/musicas/sessoes"
                className="button button-secondary musica-icon-button"
                aria-label="Abrir sessões"
                title="Abrir sessões"
              >
                <IconExternalLink size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
