import type { ContentPage } from "@/lib/site-data";
import type { Locale } from "@/lib/multilingual";
import type { PublicContactData } from "@/lib/site-contact";
import { ContactMessageForm } from "@/components/contact-message-form";

type ContactPageProps = {
  page: ContentPage;
  locale: Locale;
  contact: PublicContactData;
};

export function ContactPageView({ page, locale, contact }: Readonly<ContactPageProps>) {
  return (
    <main className="content-page contact-page public-page public-page--animated">
      <section className="content-hero contact-hero public-hero-shell">
        <div className="content-hero-top contact-hero-top">
          <div className="content-kicker">
            <p className="eyebrow">GEEF</p>
          </div>
        </div>

        <div className="content-hero-body contact-hero-body">
          <div className="content-copy contact-copy">
            <h1>{page.title}</h1>
            <div className="content-copy-body">
              <p className="content-summary">{page.summary}</p>
              <p className="content-intro">{contact.intro}</p>
            </div>
          </div>
        </div>

        <div className="contact-card-grid" aria-label={locale === "en" ? "Official contact channels" : "Canais oficiais de contato"}>
          {contact.cards.map((card) => (
            <article key={card.title} className="contact-mini-card">
              <span className="contact-mini-card-label">{card.title}</span>
              {card.href ? (
                <a href={card.href} className="contact-mini-card-value">
                  {card.value}
                </a>
              ) : (
                <strong className="contact-mini-card-value">{card.value}</strong>
              )}
              <span className="contact-mini-card-note">{card.note}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-layout" aria-labelledby="contact-message-title">
        <article className="content-card contact-message-panel">
          <div className="section-heading contact-section-heading">
            <div>
              <p className="eyebrow">{locale === "en" ? "Send a message" : "Enviar mensagem"}</p>
              <h2 id="contact-message-title">{locale === "en" ? "Talk to the house" : "Fale com a casa"}</h2>
            </div>
            <p>{locale === "en" ? "The request is recorded in the internal panel and routed to the team." : "O pedido fica registrado no painel interno e segue para a equipe."}</p>
          </div>

          <ContactMessageForm
            sendLabel={locale === "en" ? "Send message" : "Enviar mensagem"}
            sendingLabel={locale === "en" ? "Sending..." : "Enviando..."}
            successTitle={locale === "en" ? "Message sent." : "Mensagem enviada."}
            successText={locale === "en" ? "We received your contact and it is now available internally." : "Recebemos seu contato e ele já está disponível internamente."}
            errorText={locale === "en" ? "We could not send your message. Please try again." : "Não foi possível enviar sua mensagem. Tente novamente."}
            idleText={locale === "en" ? "Your submission is stored in the house's internal panel." : "Seu envio fica registrado no painel interno da casa."}
          />
        </article>

        <aside className="content-card contact-side-panel">
          <div className="section-heading contact-section-heading">
            <div>
              <p className="eyebrow">{locale === "en" ? "Social links" : "Redes sociais"}</p>
              <h2>{locale === "en" ? "Follow the house" : "Siga a casa"}</h2>
            </div>
            <p>{locale === "en" ? "Use the channels below if you prefer social networks." : "Se preferir, use as redes abaixo para acompanhar a casa."}</p>
          </div>

          <div className="contact-social-block">
            <div className="contact-social-links">
              {contact.socials.length > 0 ? (
                contact.socials.map((social) => (
                  <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className="contact-social-link">
                    <span>{social.label}</span>
                    <strong>{social.display}</strong>
                  </a>
                ))
              ) : (
                <>
                  <a href="https://instagram.com/grupoespiritaeliasfrancis" target="_blank" rel="noreferrer" className="contact-social-link">
                    <span>Instagram</span>
                    <strong>@grupoespiritaeliasfrancis</strong>
                  </a>
                  <a href="https://youtube.com/@GrupoEspiritaEliasFrancis" target="_blank" rel="noreferrer" className="contact-social-link">
                    <span>YouTube</span>
                    <strong>Grupo Espírita Elias Francis</strong>
                  </a>
                  <a href="https://facebook.com/grupoespiritaeliasfrancis" target="_blank" rel="noreferrer" className="contact-social-link">
                    <span>Facebook</span>
                    <strong>@grupoespiritaeliasfrancis</strong>
                  </a>
                </>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
