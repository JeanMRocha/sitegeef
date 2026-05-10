import Link from "next/link";
import { ArrowIcon } from "@/components/site-icons";
import { type ContentPage } from "@/lib/site-data";

export function ContentPageView({ page }: Readonly<{ page: ContentPage }>) {
  return (
    <main className="content-page">
      <section className="content-hero">
        <p className="eyebrow">GEEF</p>
        <h1>{page.title}</h1>
        <p className="content-summary">{page.summary}</p>
        <p className="content-intro">{page.intro}</p>
        <div className="content-actions">
          <Link href={page.ctaHref} className="button button-primary">
            {page.ctaLabel}
            <ArrowIcon className="button-icon" />
          </Link>
          <Link href="/" className="button button-secondary">
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
