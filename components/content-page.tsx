import Link from "next/link";
import { ArrowIcon } from "@/components/site-icons";
import { publicHref } from "@/lib/site-data";
import { type ContentPage } from "@/lib/site-data";

export function ContentPageView({ page }: Readonly<{ page: ContentPage }>) {
  return (
    <main className="content-page">
      <section className="content-hero">
        <div className="content-hero-top">
          <div className="content-brand">
            <img
              src="/brand/logo-oficial.jpg"
              alt="Logo oficial do GEEF"
              width={280}
              height={121}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="content-badge">
            <span className="content-badge-label">Identidade oficial</span>
            <span className="content-badge-text">GEEF · Grupo Espírita Elias Francis</span>
          </div>
        </div>

        <div className="content-hero-body">
          <div className="content-copy">
            <p className="eyebrow">GEEF</p>
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
              <li>
                <span className="mini-dot" aria-hidden="true" />
                Identidade visual alinhada ao manual
              </li>
            </ul>
          </div>
        </div>

        <div className="content-actions">
          <Link href={page.ctaHref} className="button button-primary">
            {page.ctaLabel}
            <ArrowIcon className="button-icon" />
          </Link>
          <Link href={publicHref("/")} className="button button-secondary">
            Voltar ao início
          </Link>
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
