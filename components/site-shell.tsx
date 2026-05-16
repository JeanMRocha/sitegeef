import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { navItems, site } from "@/lib/site-data";
import { HeaderCompact } from "@/components/header-compact";
import { UserIcon } from "@/components/site-icons";
import { createClient } from "@/lib/supabase/server";

export async function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  noStore();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("nome_completo, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
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
          {navItems
            .filter((item) => !item.icon)
            .map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          {!user && (
            <Link
              href="/login?next=/perfil"
              className="site-nav-icon"
              aria-label="Perfil do usuário"
              title="Perfil do usuário"
            >
              <UserIcon className="site-nav-icon-svg" />
              <span className="sr-only">Perfil do usuário</span>
            </Link>
          )}
        </nav>
      </header>

      {/* Compact Header Menu (quando autenticado) */}
      {user && (
        <HeaderCompact
          userEmail={user.email}
          nomeCompleto={profile?.nome_completo}
          avatarUrl={profile?.avatar_url}
        />
      )}

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
