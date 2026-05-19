import { type ContentPage } from "@/lib/site-data";
import { type Locale } from "@/lib/multilingual";

type ContentPageViewProps = {
  page: ContentPage;
  locale: Locale;
  slug: string;
};

export function ContentPageView({ page, locale, slug }: Readonly<ContentPageViewProps>) {
  const isAgenda = slug === "agenda";

  return (
    <main className={`content-page${isAgenda ? " content-page--compact" : ""}`}>
      <section className="content-hero">
        <div className="content-hero-top">
          <div className="content-kicker">
            <p className="eyebrow">GEEF</p>
            <span className="content-badge-text">
              {locale === "en" ? "Grupo Espírita Elias Francis" : "Grupo Espírita Elias Francis"}
            </span>
          </div>
          <div className="content-badge">
            <span className="content-badge-label">
              {locale === "en" ? "Official identity" : "Identidade oficial"}
            </span>
          </div>
        </div>

        <div className="content-hero-body">
          <div className="content-copy">
            <h1>{page.title}</h1>
            <p className="content-summary">{page.summary}</p>
            <p className="content-intro">{page.intro}</p>
          </div>

          {!isAgenda ? (
            <div className="content-panel">
              <p className="content-panel-label">
                {locale === "en" ? "Page summary" : "Resumo da página"}
              </p>
              <ul className="content-panel-list">
                <li>
                  <span className="mini-dot" aria-hidden="true" />
                  {locale === "en" ? "Content prepared for quick reading" : "Conteúdo preparado para leitura rápida"}
                </li>
                <li>
                  <span className="mini-dot" aria-hidden="true" />
                  {locale === "en" ? "Structure compatible with mobile and desktop" : "Estrutura compatível com celular e desktop"}
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="content-grid" aria-label={locale === "en" ? `Sections of ${page.title}` : `Seções de ${page.title}`}>
        {page.sections.map((section) => (
          <article key={section.heading} className="content-card">
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
