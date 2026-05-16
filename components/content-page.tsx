import { type ContentPage } from "@/lib/site-data";

export function ContentPageView({ page }: Readonly<{ page: ContentPage }>) {
  return (
    <main className="content-page">
      <section className="content-hero">
        <div className="content-hero-top">
          <div className="content-kicker">
            <p className="eyebrow">GEEF</p>
            <span className="content-badge-text">Grupo Espírita Elias Francis</span>
          </div>
          <div className="content-badge">
            <span className="content-badge-label">Identidade oficial</span>
          </div>
        </div>

        <div className="content-hero-body">
          <div className="content-copy">
            <h1>{page.title}</h1>
            <p className="content-summary">{page.summary}</p>
            <p className="content-intro">{page.intro}</p>
          </div>

          <div className="content-panel">
            <p className="content-panel-label">Resumo da página</p>
            <ul className="content-panel-list">
              <li>
                <span className="mini-dot" aria-hidden="true" />
                Conteúdo preparado para leitura rápida
              </li>
              <li>
                <span className="mini-dot" aria-hidden="true" />
                Estrutura compatível com celular e desktop
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-grid" aria-label={`Seções de ${page.title}`}>
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
