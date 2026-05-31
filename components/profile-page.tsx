import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { type Locale } from "@/lib/multilingual";
import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/admin/safe-supabase";
import { updateProfile, uploadAvatar } from "@/app/login/actions";
import { LgpdFormNotice } from "@/components/lgpd/lgpd-form-notice";

type ProfilePageViewProps = {
  locale?: Locale;
};

function getInitials(value?: string | null) {
  if (!value) {
    return "GE";
  }

  const parts = value.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join("");
  return (initials || value.slice(0, 2)).toUpperCase();
}

export async function ProfilePageView({ locale = "pt" }: Readonly<ProfilePageViewProps>) {
  noStore();

  const supabase = await createClient();

  const { data: { user } } = await withTimeout(
    supabase.auth.getUser() as Promise<any>,
    4500,
    { data: { user: null }, error: null } as any,
  );

  if (!user) {
    redirect("/login?next=/perfil");
  }

  const avatarUrl = (user.user_metadata?.avatar_url as string) || null;
  const nomeCompleto = (user.user_metadata?.full_name as string) || null;
  const siteRole = (user.app_metadata?.site_role as string) || null;
  const isAdmin = siteRole === "administrador";
  const roleLabel =
    locale === "en"
      ? isAdmin
        ? "Administrator"
        : siteRole || "public"
      : isAdmin
        ? "Administrador"
        : siteRole || "público";
  const displayName = nomeCompleto || (locale === "en" ? "User" : "Usuário");
  const initials = getInitials(displayName);

  return (
    <main className="profile-page-compact profile-page-modern">
      <div className="profile-compact-container profile-shell">
        <section className="profile-shell-hero">
          <div className="profile-compact-header">
            <div className="profile-compact-avatar">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="profile-compact-avatar-img"
                />
              ) : (
                <div className="profile-compact-avatar-placeholder">{initials}</div>
              )}
            </div>
            <div className="profile-compact-header-info">
              <span className="profile-section-kicker">
                {locale === "en" ? "Account" : "Minha conta"}
              </span>
              <h1>{displayName}</h1>
              <p>{user.email}</p>
              <div className="tag-list profile-role-row">
                <span className="tag">{roleLabel}</span>
                <span className="tag">{locale === "en" ? "Secure access" : "Acesso seguro"}</span>
              </div>
            </div>
          </div>

          <div className="profile-shell-intro">
            <p>
              {locale === "en"
                ? "Keep your identity clean and current. Update only what changes, in a simple and readable flow."
                : "Mantenha sua identidade limpa e atualizada. Edite só o que mudar, em um fluxo simples e legível."}
            </p>
            <div className="profile-chip-row">
              <span className="profile-chip">{locale === "en" ? "Name" : "Nome"}</span>
              <span className="profile-chip">{locale === "en" ? "Avatar" : "Avatar"}</span>
              <span className="profile-chip">{locale === "en" ? "Privacy" : "Privacidade"}</span>
            </div>
          </div>
        </section>

        <div className="profile-shell-grid">
          <section className="profile-shell-main">
            <div className="profile-section-heading">
              <span className="profile-section-kicker">
                {locale === "en" ? "Quick update" : "Atualização rápida"}
              </span>
              <h2>{locale === "en" ? "Basic data" : "Dados básicos"}</h2>
              <p>
                {locale === "en"
                  ? "Use the fields below to keep your account aligned with the current record."
                  : "Use os campos abaixo para manter seu cadastro alinhado com o registro atual."}
              </p>
            </div>

            <div className="profile-compact-forms">
              <LgpdFormNotice
                text={
                  locale === "en"
                    ? "We use your data to update your profile and keep the user area secure."
                    : "Usamos seus dados para atualizar seu cadastro e manter a área do usuário segura."
                }
              />

              <form action={updateProfile} className="profile-compact-form">
                <div className="profile-form-field">
                  <label htmlFor="nome_completo">{locale === "en" ? "Full name" : "Nome Completo"}</label>
                  <div className="profile-form-row">
                    <input
                      id="nome_completo"
                      name="nome_completo"
                      type="text"
                      defaultValue={nomeCompleto || ""}
                      placeholder={locale === "en" ? "Your name" : "Seu nome"}
                      className="profile-form-input"
                    />
                    <button type="submit" className="profile-form-btn profile-form-btn-primary">
                      {locale === "en" ? "Save" : "Salvar"}
                    </button>
                  </div>
                </div>
              </form>

              <form action={uploadAvatar} className="profile-compact-form">
                <div className="profile-form-field">
                  <label htmlFor="avatar">{locale === "en" ? "Profile picture" : "Foto de Perfil"}</label>
                  <div className="profile-form-row">
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="profile-form-input"
                    />
                    <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                      {locale === "en" ? "Upload" : "Upload"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <aside className="profile-shell-aside">
            <div className="profile-summary-card profile-summary-card--highlight">
              <p className="profile-summary-kicker">
                {locale === "en" ? "Profile snapshot" : "Resumo do perfil"}
              </p>
              <h3>{displayName}</h3>
              <p>{user.email}</p>
              <div className="profile-chip-row">
                <span className="profile-chip">{roleLabel}</span>
                <span className="profile-chip">{user.user_metadata?.avatar_url ? (locale === "en" ? "Photo on" : "Foto ativa") : (locale === "en" ? "Photo missing" : "Foto ausente")}</span>
              </div>
            </div>

            <div className="profile-summary-card">
              <p className="profile-summary-kicker">
                {locale === "en" ? "How it works" : "Como funciona"}
              </p>
              <ul className="profile-flow">
                <li>
                  <span className="profile-flow-step">1</span>
                  <div>
                    <span className="profile-flow-title">{locale === "en" ? "Edit name" : "Editar nome"}</span>
                    <span className="profile-flow-text">
                      {locale === "en"
                        ? "Keep the display name consistent across internal screens."
                        : "Mantenha o nome exibido consistente nas telas internas."}
                    </span>
                  </div>
                </li>
                <li>
                  <span className="profile-flow-step">2</span>
                  <div>
                    <span className="profile-flow-title">{locale === "en" ? "Update photo" : "Atualizar foto"}</span>
                    <span className="profile-flow-text">
                      {locale === "en"
                        ? "Use a clear avatar to make the account easier to identify."
                        : "Use uma foto clara para identificar a conta com mais rapidez."}
                    </span>
                  </div>
                </li>
                <li>
                  <span className="profile-flow-step">3</span>
                  <div>
                    <span className="profile-flow-title">{locale === "en" ? "Protect access" : "Proteger acesso"}</span>
                    <span className="profile-flow-text">
                      {locale === "en"
                        ? "Logout and session handling remain in the floating menu."
                        : "Logout e sessão continuam no menu flutuante."}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="profile-compact-info">
              <p>
                {locale === "en"
                  ? "💡 Use the floating menu in the upper-right corner for settings, theme and logout."
                  : "💡 Use o menu flutuante no canto superior direito para configurações, tema e logout."}
              </p>
            </div>

            <div className="profile-compact-info profile-compact-info--action">
              <Link href="/minha-area" className="profile-form-btn profile-form-btn-secondary profile-aside-link">
                {locale === "en" ? "Open user area" : "Abrir área do usuário"}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
