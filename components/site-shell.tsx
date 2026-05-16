import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { site } from "@/lib/site-data";
import { SiteHeader } from "@/components/site-header";
import { UserMenu } from "@/components/user-menu";
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
      <SiteHeader userEmail={user?.email} nomeCompleto={profile?.nome_completo} avatarUrl={profile?.avatar_url} />

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
