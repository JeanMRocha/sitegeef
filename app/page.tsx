import Link from "next/link";
import {
  ArrowIcon,
  BookIcon,
  CalendarIcon,
  GroupIcon,
  HeartIcon,
  LiveIcon,
  MailIcon,
  UserIcon,
} from "@/components/site-icons";
import { featureCards, publicHref, schedule, site } from "@/lib/site-data";

const iconMap = {
  group: GroupIcon,
  calendar: CalendarIcon,
  heart: HeartIcon,
  live: LiveIcon,
  book: BookIcon,
  mail: MailIcon,
  user: UserIcon,
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">GEEF · site público</p>
          <h1>{site.name}</h1>
          <p className="hero-lead">
            Casa de estudo, acolhimento e serviço fraterno. Um ponto de contato
            simples para quem busca informação, agenda, atendimento e
            transmissões.
          </p>
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

        <aside className="hero-visual" aria-label="Resumo do site">
          <div className="hero-panel">
            <div className="hero-brand">
              <img
                src="/brand/logo-oficial-transparent.png"
                alt="Logo oficial do GEEF"
                width={320}
                height={138}
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="hero-panel-top">
              <span className="pill pill-primary">Acolhimento</span>
              <span className="pill">Agenda aberta</span>
            </div>
            <h2>Estudo, escuta e presença.</h2>
            <p>
              O site começa enxuto, legível e pronto para crescer com novas
              páginas e conteúdos.
            </p>
            <ul className="hero-panel-list">
              <li>
                <span className="mini-dot" aria-hidden="true" />
                Reuniões públicas e estudos
              </li>
              <li>
                <span className="mini-dot" aria-hidden="true" />
                Atendimento fraterno
              </li>
              <li>
                <span className="mini-dot" aria-hidden="true" />
                Vídeos e transmissões
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Serviços</p>
            <h2 id="services-title">O que o visitante encontra</h2>
          </div>
          <p>
            Conteúdo inicial estruturado para celular e desktop, com navegação
            clara e páginas diretas.
          </p>
        </div>

        <div className="feature-grid">
          {featureCards.map((card) => {
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

      <section className="section" aria-labelledby="agenda-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Agenda</p>
            <h2 id="agenda-title">Rotina inicial da casa</h2>
          </div>
          <p>Uma base simples para visitação rápida e atualização futura.</p>
        </div>

        <div className="schedule-grid">
          {schedule.map((item) => (
            <article key={item.title} className="schedule-card">
              <h3>{item.title}</h3>
              <p className="schedule-meta">{item.when}</p>
              <p>{item.description}</p>
            </article>
          ))}
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
