import type { ContentPage } from "@/lib/site-data";
import type { Locale } from "@/lib/multilingual";
import type { PublicContactData } from "@/lib/site-contact";
import { ContactMessageForm } from "@/components/contact-message-form";

type ContactPageProps = {
  page: ContentPage;
  locale: Locale;
  contact: PublicContactData;
};

function buildMapEmbedSrc(addressHref?: string, addressValue?: string) {
  const query = encodeURIComponent(addressValue?.trim() || "");
  if (query) {
    return `https://www.google.com/maps?q=${query}&z=15&output=embed`;
  }

  return addressHref || "";
}

function SocialIcon({ label }: { label: string }) {
  const iconClassName = "contact-social-icon";

  switch (label.toLowerCase()) {
    case "instagram":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8.8a3 3 0 0 0-2.1-2.1C17.2 6.3 12 6.3 12 6.3s-5.2 0-6.9.4A3 3 0 0 0 3 8.8 31 31 0 0 0 3 12a31 31 0 0 0 .1 3.2 3 3 0 0 0 2.1 2.1c1.7.4 6.9.4 6.9.4s5.2 0 6.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 21 12a31 31 0 0 0 0-3.2Z" />
          <path d="m10 9.7 5 2.3-5 2.3z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 8.5H16V5.8c-.4 0-1.4-.2-2.2-.2-2.4 0-4 1.4-4 4V12H7v3h2.8v6H13v-6h2.6l.4-3H13V9.9c0-.8.2-1.4 1.5-1.4Z" />
        </svg>
      );
    case "site":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 8.5H16V5.8c-.4 0-1.4-.2-2.2-.2-2.4 0-4 1.4-4 4V12H7v3h2.8v6H13v-6h2.6l.4-3H13V9.9c0-.8.2-1.4 1.5-1.4Z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 0 0 0 18" />
          <path d="M12 3a9 9 0 1 1 0 18" />
          <path d="M3 12h18" />
        </svg>
      );
  }
}

export function ContactPageView({ page, locale, contact }: Readonly<ContactPageProps>) {
  const socials = contact.socials.length > 0 ? contact.socials : [];
  const mapEmbedSrc = buildMapEmbedSrc(contact.address.href, contact.address.value);
  const contactFormId = "contact-message-form";
  return (
    <main className="content-page contact-page public-page public-page--animated">
      <section className="content-hero contact-hero public-hero-shell">
        <div className="content-hero-body contact-hero-body">
          <div className="content-copy contact-copy">
            <h1>{page.title}</h1>
            <div className="content-copy-body">
              <p className="content-summary">{page.summary}</p>
              <p className="content-intro">{contact.intro}</p>
            </div>
          </div>
        </div>

        {socials.length > 0 ? (
          <div className="contact-social-rail" aria-label={locale === "en" ? "Social channels" : "Canais sociais"}>
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="contact-social-rail-link"
                aria-label={`${social.label}: ${social.display}`}
                title={`${social.label}: ${social.display}`}
              >
                <span className="contact-social-rail-icon">
                  <SocialIcon label={social.label} />
                </span>
              </a>
            ))}
          </div>
        ) : null}

        <div className="contact-card-grid contact-card-grid--official" aria-label={locale === "en" ? "Official contact channels" : "Canais oficiais de contato"}>
          <details className="contact-mini-card contact-mini-card--address">
            <summary className="contact-mini-card-summary">
              <div className="contact-mini-card-summary-copy">
                <span className="contact-mini-card-label">{contact.address.title}</span>
                <strong className="contact-mini-card-value">{contact.address.value}</strong>
                <span className="contact-mini-card-note">{contact.address.note}</span>
              </div>
              <span className="contact-mini-card-toggle">
                <span className="contact-mini-card-toggle-label">{locale === "en" ? "Open map" : "Abrir mapa"}</span>
                <span aria-hidden="true">+</span>
              </span>
            </summary>
            <div className="contact-map-frame">
              {mapEmbedSrc ? (
                <iframe
                  title={locale === "en" ? "Map preview" : "Prévia do mapa"}
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
              {contact.address.href ? (
                <a href={contact.address.href} target="_blank" rel="noreferrer" className="contact-map-link">
                  {locale === "en" ? "Open in Maps" : "Abrir no Maps"}
                </a>
              ) : null}
            </div>
          </details>

          {(contact.phone || contact.email) ? (
            <div className="contact-card-row contact-card-row--direct">
              {contact.phone ? (
                <article className="contact-mini-card contact-mini-card--compact contact-mini-card--phone">
                  <span className="contact-mini-card-label">{contact.phone.title}</span>
                  {contact.phone.href ? (
                    <a href={contact.phone.href} className="contact-mini-card-value">
                      {contact.phone.value}
                    </a>
                  ) : (
                    <strong className="contact-mini-card-value">{contact.phone.value}</strong>
                  )}
                  <span className="contact-mini-card-note">{locale === "en" ? "WhatsApp" : "WhatsApp"}</span>
                </article>
              ) : null}

              {contact.email ? (
                <article className="contact-mini-card contact-mini-card--compact contact-mini-card--email">
                  <span className="contact-mini-card-label">{contact.email.title}</span>
                  {contact.email.href ? (
                    <a href={contact.email.href} className="contact-mini-card-value">
                      {contact.email.value}
                    </a>
                  ) : (
                    <strong className="contact-mini-card-value">{contact.email.value}</strong>
                  )}
                  <span className="contact-mini-card-note">{locale === "en" ? "Reply by email" : "Resposta por e-mail"}</span>
                </article>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="contact-layout" aria-labelledby="contact-message-title">
        <article className="content-card contact-message-panel">
          <div className="contact-message-panel-head">
            <div className="contact-message-panel-head-copy">
              <p className="eyebrow">{locale === "en" ? "Send a message" : "Enviar mensagem"}</p>
              <h2 id="contact-message-title">{locale === "en" ? "Talk to the house" : "Fale com a casa"}</h2>
            </div>
            <div className="contact-message-panel-head-side">
              <button type="submit" form={contactFormId} className="button button-primary contact-form-submit" disabled={false}>
                {locale === "en" ? "Send message" : "Enviar mensagem"}
              </button>
            </div>
          </div>

          <div className="contact-message-panel-body">
            <ContactMessageForm
              formId={contactFormId}
              sendingLabel={locale === "en" ? "Sending..." : "Enviando..."}
              successTitle={locale === "en" ? "Message sent." : "Mensagem enviada."}
              successText={locale === "en" ? "We received your contact." : "Recebemos seu contato."}
              errorText={locale === "en" ? "Please try again." : "Tente novamente."}
            />
          </div>
        </article>
      </section>
    </main>
  );
}
