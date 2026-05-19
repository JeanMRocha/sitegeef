import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowIcon,
  CalendarIcon,
  GroupIcon,
  HeartIcon,
  MailIcon,
  ShieldIcon,
} from "@/components/site-icons";
import { publicHref, site } from "@/lib/site-data";
import { getMultilingualCopy, getRequestLocale } from "@/lib/multilingual";
import { normalizeInternalPath } from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getMultilingualCopy(locale);

  return {
    title: `GEEF | ${copy.home.title}`,
    description: copy.home.lead,
  };
}

type HomePageProps = {
  searchParams?: Promise<{
    code?: string;
    next?: string;
  }>;
};

const iconMap = {
  group: GroupIcon,
  calendar: CalendarIcon,
  heart: HeartIcon,
  mail: MailIcon,
  privacy: ShieldIcon,
};

export default async function Home({ searchParams }: HomePageProps) {
  const locale = await getRequestLocale();
  const copy = getMultilingualCopy(locale);
  const resolvedSearchParams = await searchParams;
  const authCode = resolvedSearchParams?.code;

  if (authCode) {
    const nextUrl = normalizeInternalPath(resolvedSearchParams?.next, "/perfil");
    const search = new URLSearchParams({
      code: authCode,
      next: nextUrl,
    });

    redirect(`/auth/callback?${search.toString()}`);
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1>{copy.home.title}</h1>
          <p className="hero-lead">{copy.home.lead}</p>
          <ul className="hero-highlights" aria-label={locale === "en" ? "Page highlights" : "Destaques da página"}>
            {copy.home.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link href={publicHref("/contato")} className="button button-primary">
              {copy.home.primaryCta}
              <ArrowIcon className="button-icon" />
            </Link>
            <Link href={publicHref("/agenda")} className="button button-secondary">
              {copy.home.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="quick-links-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{locale === "en" ? "Quick access" : "Acesso rápido"}</p>
            <h2 id="quick-links-title">{copy.home.quickLinksTitle}</h2>
          </div>
          <p>{copy.home.quickLinksLead}</p>
        </div>

        <div className="feature-grid">
          {copy.home.quickLinks.map((card) => {
            const Icon = iconMap[card.icon];
            return (
              <Link key={card.href} href={card.href} className="feature-card">
                <div className="feature-card-top">
                  <Icon className="feature-icon" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section" aria-labelledby="contact-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{locale === "en" ? "Contact" : "Contato"}</p>
            <h2 id="contact-title">{copy.home.contactTitle}</h2>
          </div>
          <p>{copy.home.contactLead}</p>
        </div>

        <div className="contact-grid">
          <article className="contact-card">
            <h3>{locale === "en" ? "Address" : "Endereço"}</h3>
            <p>{site.address}</p>
          </article>
          <article className="contact-card">
            <h3>{locale === "en" ? "Connections" : "Conexões"}</h3>
            <ul className="contact-list">
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a>
              </li>
              <li>
                <a href={`https://${site.youtube}`} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${site.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
