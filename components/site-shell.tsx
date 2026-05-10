import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/lib/site-data";

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label={site.name}>
          <span className="brand-logo">
            <Image
              src="/brand/logo-oficial.jpg"
              alt=""
              width={260}
              height={112}
              priority
            />
          </span>
          <span className="brand-text">
            <strong>Site público</strong>
            <span>{site.shortName}</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <p>{site.name}</p>
        <p>
          {site.address} · {site.email}
        </p>
      </footer>
    </div>
  );
}
