import type { Metadata } from "next";
import Link from "next/link";
import { getInstitutionBrand } from "@/lib/institution-brand";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Exibição pública - Músicas GEEF",
    description: "Tela de orientação para abrir a exibição pública de músicas do GEEF.",
  };
}

export default async function MusicasExibirPage() {
  const brand = await getInstitutionBrand();

  return (
    <main className="public-page public-page--animated">
      <section className="content-hero public-hero-shell">
        <div className="public-hero-grid">
          <div className="content-copy">
            <p className="eyebrow">Exibição pública</p>
            <h1>Abra a sessão manualmente</h1>
            <div className="content-copy-body">
              <p className="content-summary">
                Esta página não cria mais sessão automaticamente ao carregar. A exibição deve ser iniciada pela área
                interna, escolhendo uma sessão já cadastrada ou criando uma nova de forma explícita.
              </p>
              <p className="content-intro">
                Quando a tela fica sem acesso por mais de 1 hora, a sessão é encerrada na próxima leitura de estado.
              </p>
            </div>

            <div className="hero-actions">
              <Link href="/admin/reuniao-publica/musicas/sessoes" className="button button-primary">
                Abrir sessões
              </Link>
              <Link href="/musicas" className="button button-secondary">
                Voltar ao catálogo
              </Link>
            </div>
          </div>

          <aside className="content-panel">
            <p className="content-panel-label">Controle</p>
            <img src={brand.logoSemFundoUrl} alt="Logo GEEF" className="musica-side-logo" />
            <p className="musica-summary-text" style={{ marginTop: "0.9rem" }}>
              Use a área interna para escolher a sessão, vincular a música e ativar a exibição.
            </p>
            <p className="musica-summary-text" style={{ marginTop: "0.75rem" }}>
              A rota pública agora funciona como orientação, sem gerar sessão por visita.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
