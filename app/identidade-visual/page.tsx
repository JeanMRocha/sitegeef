import type { Metadata } from "next";
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
          lead: "Official versions, usage guidance and download links are shown here in a simple, readable layout.",
          mainLogo: "Primary logo without background",
          altLogo: "Alternative logo with background",
          download: "Download",
          open: "Open file",
          descriptionTitle: "Logo description",
          compositionTitle: "Lettering and composition",
          useTitle: "How to use",
          examplesTitle: "Examples",
        }
      : {
          eyebrow: "Marca oficial",
          title: "Manual de identidade visual",
          summary:
            "Esta página reúne as versões oficiais da logo, o guia de uso e exemplos curtos para manter a marca consistente em todas as áreas.",
          lead: "As versões oficiais, o guia de uso e os links de download ficam reunidos em uma apresentação simples e legível.",
          mainLogo: "Logo principal fundo transparente",
          altLogo: "Logo alternativa com fundo",
          download: "Baixar",
          open: "Abrir arquivo",
          descriptionTitle: "Descritivo da logo",
          compositionTitle: "Letra e composição",
          useTitle: "Como usar",
          examplesTitle: "Exemplos de uso",
        };

  const brandItems = [
    {
      title: copy.mainLogo,
      src: brand.logoSemFundoUrl,
      description:
        locale === "en"
          ? "Preferred version for light backgrounds, headers and documents."
          : "Versão preferencial para fundos claros, cabeçalhos e documentos.",
      previewBackground:
        "repeating-conic-gradient(#e5e7eb 0% 25%, #f8fafc 0% 50%) 0 0 / 22px 22px",
      downloadName: "geef-logo-fundo-transparente",
    },
    {
      title: copy.altLogo,
      src: brand.logoComFundoUrl,
      description:
        locale === "en"
          ? "Alternative version for busy backgrounds or when extra contrast is needed."
          : "Versão alternativa para fundos mais carregados ou quando for preciso mais contraste.",
      previewBackground: "#fff",
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

      <section className="public-showcase" style={{ alignItems: "start" }}>
        <article className="content-card" style={{ alignSelf: "start" }}>
          <p className="eyebrow">{copy.compositionTitle}</p>
          <p>{brand.composicao}</p>
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
                  background: item.previewBackground,
                  overflow: "hidden",
                  boxShadow: item.title === copy.mainLogo ? "inset 0 0 0 1px rgba(255,255,255,0.6)" : "none",
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
