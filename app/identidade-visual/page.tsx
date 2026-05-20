import type { Metadata } from "next";
import Link from "next/link";
import { getRequestLocale } from "@/lib/multilingual/server";
import { getInstitutionBrand } from "@/lib/institution-brand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "en" ? "Visual identity | GEEF" : "Identidade visual - GEEF",
    description:
      locale === "en"
        ? "GEEF brand manual, logo usage guide and download links for the official versions."
        : "Manual da marca do GEEF, guia de uso da logo e links para download das versões oficiais.",
  };
}

export default async function IdentidadeVisualPage() {
  const locale = await getRequestLocale();
  const brand = await getInstitutionBrand();

  const copy =
    locale === "en"
      ? {
          eyebrow: "Official brand",
          title: "Visual identity manual",
          summary:
            "This page gathers the official logo versions, usage guidelines and short examples so the brand stays consistent in every area.",
          lead:
            "The admin area is the source of truth. If a logo changes there, this page reflects the same reference automatically.",
          mainLogo: "Primary logo without background",
          altLogo: "Alternative logo with background",
          download: "Download",
          open: "Open file",
          descriptionTitle: "Logo description",
          compositionTitle: "Lettering and composition",
          useTitle: "How to use",
          examplesTitle: "Examples",
          adminLink: "Update in admin",
          adminHint: "The institutional editor keeps the official assets and text up to date.",
        }
      : {
          eyebrow: "Marca oficial",
          title: "Manual de identidade visual",
          summary:
            "Esta página reúne as versões oficiais da logo, o guia de uso e exemplos curtos para manter a marca consistente em todas as áreas.",
          lead:
            "A área administrativa é a fonte da verdade. Se a logo mudar lá, esta página reflete a mesma referência automaticamente.",
          mainLogo: "Logo principal sem fundo",
          altLogo: "Logo alternativa com fundo",
          download: "Baixar",
          open: "Abrir arquivo",
          descriptionTitle: "Descritivo da logo",
          compositionTitle: "Letra e composição",
          useTitle: "Como usar",
          examplesTitle: "Exemplos de uso",
          adminLink: "Atualizar no admin",
          adminHint: "O editor da instituição mantém os ativos oficiais e os textos atualizados.",
        };

  const brandItems = [
    {
      title: copy.mainLogo,
      src: brand.logoSemFundoUrl,
      description:
        locale === "en"
          ? "Preferred version for light backgrounds, headers and documents."
          : "Versão preferencial para fundos claros, cabeçalhos e documentos.",
      downloadName: "geef-logo-sem-fundo",
    },
    {
      title: copy.altLogo,
      src: brand.logoComFundoUrl,
      description:
        locale === "en"
          ? "Alternative version for busy backgrounds or when extra contrast is needed."
          : "Versão alternativa para fundos mais carregados ou quando for preciso mais contraste.",
      downloadName: "geef-logo-com-fundo",
    },
  ];

  return (
    <main className="public-page">
      <section className="content-hero public-hero-shell">
        <div className="public-hero-grid">
          <div className="content-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="content-summary">{copy.summary}</p>
            <p className="content-intro">{copy.lead}</p>
          </div>

          <aside className="content-panel">
            <p className="content-panel-label">{copy.descriptionTitle}</p>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{brand.descricao}</p>
          </aside>
        </div>
      </section>

      <section className="public-showcase">
        <article className="content-card">
          <p className="eyebrow">{copy.compositionTitle}</p>
          <p>{brand.composicao}</p>
          <div className="hero-actions" style={{ marginTop: "1.25rem", flexWrap: "wrap" }}>
            <Link href="/admin/instituicao/editar?tab=identidade_visual" className="button button-secondary">
              {copy.adminLink}
            </Link>
            <span style={{ alignSelf: "center", color: "var(--muted)", fontSize: "0.9rem" }}>{copy.adminHint}</span>
          </div>
        </article>

        <div className="public-trust-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {brandItems.map((item) => (
            <article key={item.title} className="public-trust-item" style={{ padding: "1rem", display: "grid", gap: "0.85rem" }}>
              <strong>{item.title}</strong>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "180px",
                  borderRadius: "1rem",
                  border: "1px solid var(--line)",
                  background: item.title === copy.altLogo ? "#fff" : "rgba(255,255,255,0.8)",
                  overflow: "hidden",
                }}
              >
                <img src={item.src} alt={item.title} style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "contain" }} />
              </div>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>{item.description}</p>
              <div className="hero-actions" style={{ marginTop: "0.15rem", flexWrap: "wrap" }}>
                <a href={item.src} download={item.downloadName} className="button button-secondary">
                  {copy.download}
                </a>
                <a href={item.src} target="_blank" rel="noreferrer" className="button button-secondary">
                  {copy.open}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid" aria-label={locale === "en" ? "Brand usage" : "Uso da marca"}>
        <article className="content-card">
          <h2>{copy.useTitle}</h2>
          <p>{brand.uso}</p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Prefer clear, readable backgrounds." : "Prefira fundos claros e legíveis."}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Keep the logo proportion and spacing." : "Mantenha proporção e respiro da logo."}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Do not distort, crop or add effects." : "Não distorça, corte ou aplique efeitos."}
            </li>
          </ul>
        </article>

        <article className="content-card">
          <h2>{copy.examplesTitle}</h2>
          <p>{brand.exemplos}</p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Website header and institutional pages." : "Cabeçalho do site e páginas institucionais."}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "PDFs, documents and cover pages." : "PDFs, documentos e capas de apresentação."}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Social media and official communication." : "Redes sociais e comunicação oficial."}
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
