import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/multilingual/server";
import { getInstitutionBrand } from "@/lib/institution-brand";
import { BrandLogoDisclosure } from "@/components/brand-logo-disclosure";

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
          expand: "Expand",
          compact: "Compact preview",
          descriptionTitle: "Logo description",
          lettersTitle: "Lettering description",
          visualTitle: "Visual description",
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
          expand: "Expandir",
          compact: "Prévia compacta",
          descriptionTitle: "Descritivo da logo",
          lettersTitle: "Descrição das letras",
          visualTitle: "Descrição visual",
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
    <main className="public-page public-page--animated">
      <style>{`
        .brand-disclosure {
          border: 1px solid var(--line);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.55);
        }

        .brand-disclosure > summary {
          list-style: none;
          cursor: pointer;
        }

        .brand-disclosure > summary::-webkit-details-marker {
          display: none;
        }

        .brand-disclosure-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding-bottom: 0.1rem;
          font-weight: 700;
        }

        .brand-disclosure-hint {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--muted);
          white-space: nowrap;
        }

        .brand-disclosure-indicator {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 999px;
          border: 1px solid var(--line);
          color: var(--muted);
          background: rgba(255, 255, 255, 0.45);
          flex: 0 0 auto;
          font-size: 0.8rem;
        }

        .brand-disclosure-summary:hover .brand-disclosure-indicator,
        .brand-disclosure-summary:focus-visible .brand-disclosure-indicator {
          color: var(--uva);
          border-color: rgba(138, 0, 90, 0.2);
          background: rgba(138, 0, 90, 0.06);
        }

        .brand-disclosure:not([open]) .brand-disclosure-expanded {
          display: none;
        }

        .brand-disclosure[open] .brand-disclosure-summary {
          padding-bottom: 0.4rem;
        }

        .brand-disclosure[open] {
          gap: 0.85rem;
        }
      `}</style>
      <section className="content-hero public-hero-shell">
        <div className="public-hero-grid">
          <div className="content-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <div className="content-copy-body">
              <p className="content-summary">{copy.summary}</p>
              <p className="content-intro">{copy.lead}</p>
            </div>
          </div>

          <aside className="content-panel">
            <p className="content-panel-label">{copy.descriptionTitle}</p>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{brand.descricao}</p>
          </aside>
        </div>
      </section>

      <section className="public-showcase" style={{ alignItems: "start", gap: "1.25rem" }}>
        <div
          className="public-trust-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          <article className="content-card" style={{ alignSelf: "start" }}>
            <p className="eyebrow">{copy.lettersTitle}</p>
            <p>{brand.letrasDescricao}</p>
          </article>

          <article className="content-card" style={{ alignSelf: "start" }}>
            <p className="eyebrow">{copy.visualTitle}</p>
            <p>{brand.visualDescricao}</p>
          </article>

          <article className="content-card" style={{ alignSelf: "start" }}>
            <p className="eyebrow">{copy.compositionTitle}</p>
            <p>{brand.composicao}</p>
          </article>
        </div>

        <div
          className="public-trust-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {brandItems.map((item) => (
            <BrandLogoDisclosure
              key={item.title}
              title={item.title}
              src={item.src}
              description={item.description}
              previewBackground={item.previewBackground}
              downloadName={item.downloadName}
              downloadLabel={copy.download}
              openLabel={copy.open}
              expandLabel={copy.expand}
              compactLabel={copy.compact}
              accentPreview={item.title === copy.mainLogo}
            />
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
