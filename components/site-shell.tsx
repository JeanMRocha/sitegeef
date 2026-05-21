import Link from "next/link";
import { getMultilingualCopy, type Locale } from "@/lib/multilingual";
import { SiteHeader } from "@/components/site-header";
import { LgpdCookieBanner } from "@/components/lgpd/lgpd-cookie-banner";
import type { User } from "@supabase/supabase-js";
import { getPublicContactDataStatic } from "@/lib/site-contact-public";

type SiteShellProps = {
  locale: Locale;
  user: User | null;
  children: React.ReactNode;
};

export async function SiteShell({ locale, user, children }: Readonly<SiteShellProps>) {
  const copy = getMultilingualCopy(locale);
  const contact = getPublicContactDataStatic();
  const userEmail = user?.email || null;
  const normalizedEmail = userEmail?.trim().toLowerCase() || null;
  const nomeCompleto = (user?.user_metadata?.full_name as string) || null;
  const avatarUrl = (user?.user_metadata?.avatar_url as string) || null;
  const appMetadata = (user?.app_metadata ?? {}) as Record<string, unknown>;
  const siteRole =
    typeof appMetadata.site_role === "string" ? appMetadata.site_role.trim().toLowerCase() : null;
  const hasAdminAccess =
    siteRole === "administrador" ||
    normalizedEmail === "contatogeef@gmail.com" ||
    normalizedEmail === "app.jmr@gmail.com";

  return (
    <div className="site-shell">
      <SiteHeader
        locale={locale}
        key={user?.id ?? "anonymous"}
        userEmail={userEmail}
        nomeCompleto={nomeCompleto}
        avatarUrl={avatarUrl}
        hasAdminAccess={hasAdminAccess}
      />

      <LgpdCookieBanner locale={locale} />
      {children}

      <footer className="site-footer">
        <div className="site-footer-content">
          <div className="site-footer-main">
            <strong>{contact.institutionName}</strong>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <span>{contact.address.value}</span>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <span>{contact.email?.value || "contato institucional"}</span>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <Link href="/lgpd" className="footer-link">
              {copy.shell.footer.lgpd}
            </Link>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <Link href="/privacidade" className="footer-link">
              {copy.shell.footer.privacy}
            </Link>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <Link href="/cookies" className="footer-link">
              {copy.shell.footer.cookies}
            </Link>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <Link href="/institucional" className="footer-link">
              {copy.shell.footer.credibility}
            </Link>
          </div>

          <div className="site-footer-badges">
            <a
              href="/institucional"
              title="Filiado à Federação Espírita Brasileira"
              className="footer-badge"
            >
              <span className="footer-badge-label">FEB</span>
            </a>
            <a
              href="/institucional"
              title="Integrado à REUNIR II Serrana"
              className="footer-badge"
            >
              <span className="footer-badge-label">REUNIR</span>
            </a>
            <a
              href="/institucional"
              title="45º CEU"
              className="footer-badge"
            >
              <span className="footer-badge-label">45 CEU</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
