import Link from "next/link";
import { navItems, site } from "@/lib/site-data";
import { UserIcon } from "@/components/site-icons";
import { createClient } from "@/lib/supabase/server";

export async function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("nome_completo, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label={site.name}>
          <span className="brand-logo">
            <img
              src="/brand/logo-oficial-transparent.png"
              alt=""
              width={260}
              height={112}
              loading="eager"
              decoding="async"
            />
          </span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.icon ? "site-nav-icon" : undefined}
              aria-label={item.icon ? item.label : undefined}
              title={item.icon ? item.label : undefined}
            >
              {item.icon === "user" ? (
                <>
                  {user && profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.nome_completo || "Avatar"}
                      className="site-nav-avatar"
                      width={24}
                      height={24}
                    />
                  ) : user ? (
                    <span className="site-nav-avatar-initial">
                      {profile?.nome_completo?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  ) : (
                    <UserIcon className="site-nav-icon-svg" />
                  )}
                  <span className="sr-only">{item.label}</span>
                </>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <div className="site-footer-content">
          <div className="site-footer-main">
            <p><strong>{site.name}</strong></p>
            <p>
              {site.address} · {site.email}
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              <Link href="/institucional" className="footer-link">
                Credibilidade e Filiações
              </Link>
            </p>
          </div>

          <div className="site-footer-badges">
            <a
              href="/institucional"
              title="Filiado à Federação Espírita Brasileira"
              className="footer-badge"
            >
              <span className="footer-badge-label">FEB</span>
              <span className="footer-badge-sub">Federação Espírita</span>
            </a>
            <a
              href="/institucional"
              title="Integrado à REUNIR II Serrana"
              className="footer-badge"
            >
              <span className="footer-badge-label">REUNIR</span>
              <span className="footer-badge-sub">Serrana</span>
            </a>
            <a
              href="/institucional"
              title="45º Centro Espírita Unificado"
              className="footer-badge"
            >
              <span className="footer-badge-label">45º</span>
              <span className="footer-badge-sub">CEU</span>
            </a>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} {site.name} · Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
