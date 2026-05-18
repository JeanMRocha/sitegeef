import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowIcon,
  CalendarIcon,
  GroupIcon,
  HeartIcon,
  MailIcon,
} from "@/components/site-icons";
import { contentPages, publicHref, site } from "@/lib/site-data";
import { normalizeInternalPath } from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
};

const quickLinks = [
  {
    href: publicHref("/quem-somos"),
    title: contentPages["quem-somos"].title,
    description: contentPages["quem-somos"].summary,
    icon: "group",
  },
  {
    href: publicHref("/agenda"),
    title: contentPages["agenda"].title,
    description: contentPages["agenda"].summary,
    icon: "calendar",
  },
  {
    href: publicHref("/atendimento-fraterno"),
    title: contentPages["atendimento-fraterno"].title,
    description: contentPages["atendimento-fraterno"].summary,
    icon: "heart",
  },
  {
    href: publicHref("/contato"),
    title: contentPages["contato"].title,
    description: contentPages["contato"].summary,
    icon: "mail",
  },
] as const;

export default async function Home({ searchParams }: HomePageProps) {
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
          <p className="eyebrow">GEEF · site público</p>
          <h1>{site.name}</h1>
          <p className="hero-lead">
            Casa de estudo, acolhimento e serviço fraterno. Um ponto de
            contato claro para agenda, atendimento, transmissão e informação.
          </p>
          <ul className="hero-highlights" aria-label="Destaques da página">
            <li>Agenda, estudos e atendimento em foco</li>
            <li>Leitura rápida no celular e no desktop</li>
          </ul>
          <div className="hero-actions">
            <Link href={publicHref("/contato")} className="button button-primary">
              Falar com a casa
              <ArrowIcon className="button-icon" />
            </Link>
            <Link href={publicHref("/agenda")} className="button button-secondary">
              Ver agenda
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="quick-links-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Acesso rápido</p>
            <h2 id="quick-links-title">O que já está pronto no site</h2>
          </div>
          <p>
            As páginas abaixo levam direto para o conteúdo real que já pode ser
            consultado pelo visitante.
          </p>
        </div>

        <div className="feature-grid">
          {quickLinks.map((card) => {
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
            <p className="eyebrow">Contato</p>
            <h2 id="contact-title">Informações para chegar até a casa</h2>
          </div>
          <p>
            Tudo o que importa para contato rápido já fica visível na página
            inicial.
          </p>
        </div>

        <div className="contact-grid">
          <article className="contact-card">
            <h3>Endereço</h3>
            <p>{site.address}</p>
          </article>
          <article className="contact-card">
            <h3>Conexões</h3>
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
