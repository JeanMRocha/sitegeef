import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site-data";
import { getLocalizedNavItems, type Locale } from "@/lib/multilingual";
import { SiteHeaderActions } from "@/components/site-header-actions";

type SiteHeaderProps = {
  locale: Locale;
  userEmail: string | null;
  nomeCompleto: string | null;
  avatarUrl: string | null;
  hasAdminAccess: boolean;
};

export function SiteHeader({
  locale,
  userEmail,
  nomeCompleto,
  avatarUrl,
  hasAdminAccess,
}: SiteHeaderProps) {
  const primaryLinks = getLocalizedNavItems(locale).filter((item) => item.primary);

  return (
    <header className="site-header">
      <Link href="/" className="site-header-brand" aria-label={site.name}>
        <span className="site-header-brand-logo">
          <Image
            src="/brand/logo-oficial-transparent.png"
            alt=""
            width={360}
            height={156}
            decoding="async"
            priority
          />
        </span>
      </Link>

      <nav className="site-nav-primary" aria-label="Navegação principal">
        {primaryLinks.map((item) => (
          <Link key={item.href} href={item.href} className="site-nav-link">
            {item.label}
          </Link>
        ))}
      </nav>

      <SiteHeaderActions
        locale={locale}
        userEmail={userEmail}
        nomeCompleto={nomeCompleto}
        avatarUrl={avatarUrl}
        hasAdminAccess={hasAdminAccess}
      />
    </header>
  );
}
