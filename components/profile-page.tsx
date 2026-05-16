import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile, uploadAvatar } from "@/app/login/actions";
import { getUserPermissions } from "@/lib/auth/permissions";

export async function ProfilePageView() {
  noStore();

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/perfil");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const permissions = await getUserPermissions();
  const hasAdminAccess = Boolean(
    permissions?.pode_escalas ||
      permissions?.pode_biblioteca ||
      permissions?.pode_livraria ||
      permissions?.pode_financeiro ||
      permissions?.pode_pessoas ||
      permissions?.pode_publicar ||
      permissions?.pode_mediunidade ||
      permissions?.pode_atendimento ||
      permissions?.pode_apse,
  );

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-header-new">
          <h1>👤 Seu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </header>

        <div className="profile-grid">
          {/* Avatar e Informações Principais */}
          <section className="profile-section profile-section-avatar">
            <div className="profile-avatar-wrapper">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar do usuário"
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {profile?.nome_completo?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-email-badge">
              <span className="profile-email-label">Email</span>
              <p className="profile-email-value">{user.email}</p>
            </div>
          </section>

          {/* Formulários */}
          <section className="profile-section profile-section-forms">
            <form action={updateProfile} className="profile-form-group">
              <div className="form-field-wrapper">
                <label htmlFor="nome_completo" className="form-label">Nome Completo</label>
                <div className="form-field-row">
                  <input
                    id="nome_completo"
                    name="nome_completo"
                    type="text"
                    defaultValue={profile?.nome_completo || ""}
                    placeholder="Digite seu nome completo"
                    className="form-input"
                  />
                  <button type="submit" className="button button-primary-compact">
                    ✓ Salvar
                  </button>
                </div>
              </div>
            </form>

            <form action={uploadAvatar} className="profile-form-group">
              <div className="form-field-wrapper">
                <label htmlFor="avatar" className="form-label">Foto de Perfil</label>
                <div className="form-field-row">
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="form-input"
                  />
                  <button type="submit" className="button button-secondary-compact">
                    ↑ Upload
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Navegação Rápida */}
        <nav className="profile-nav-section">
          <h2 className="profile-nav-title">Navegação Rápida</h2>
          <div className="profile-nav-grid">
            <Link href="/" className="profile-nav-button profile-nav-button-home">
              <span className="nav-icon">🏠</span>
              <span className="nav-label">Home</span>
              <span className="nav-hint">Voltar à página inicial</span>
            </Link>

            {hasAdminAccess ? (
              <Link href="/admin" className="profile-nav-button profile-nav-button-admin">
                <span className="nav-icon">📊</span>
                <span className="nav-label">Dashboard</span>
                <span className="nav-hint">Painel administrativo</span>
              </Link>
            ) : (
              <Link href="/contato" className="profile-nav-button profile-nav-button-contact">
                <span className="nav-icon">💬</span>
                <span className="nav-label">Contato</span>
                <span className="nav-hint">Fale com a casa</span>
              </Link>
            )}

            <Link href="/minha-area" className="profile-nav-button profile-nav-button-area">
              <span className="nav-icon">👥</span>
              <span className="nav-label">Minha Área</span>
              <span className="nav-hint">Seus dados e atividades</span>
            </Link>
          </div>
        </nav>

        <footer className="profile-footer">
          <p className="profile-footer-hint">
            💡 Dica: Use o menu superior para fazer logout de sua conta.
          </p>
        </footer>
      </div>
    </main>
  );
}
