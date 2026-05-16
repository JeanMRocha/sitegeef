import Link from "next/link";
import { site } from "@/lib/site-data";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="site-shell">
      <SiteHeader />

      {children}

      <footer className="site-footer">
        <div className="site-footer-content">
          <div className="site-footer-main">
            <strong>{site.name}</strong>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <span>{site.address}</span>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <span>{site.email}</span>
            <span className="site-footer-separator" aria-hidden="true">·</span>
            <Link href="/institucional" className="footer-link">
              Credibilidade e Filiações
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
              title="45º Centro Espírita Unificado"
              className="footer-badge"
            >
              <span className="footer-badge-label">45º</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
