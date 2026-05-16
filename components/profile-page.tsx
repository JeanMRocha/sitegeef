import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut, updateProfile, uploadAvatar } from "@/app/login/actions";
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
      <section className="profile-hero">
        <div className="profile-header">
          <h1>Seu Perfil</h1>
          <p>Gerencie seus dados e preferências</p>
        </div>

        <div className="profile-card" style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Navegação</h2>
          <p style={{ margin: "0.5rem 0 1rem", color: "var(--muted)" }}>
            Acesse rapidamente a home ou o painel administrativo.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/" className="button button-secondary">
              Ir para a home
            </Link>

            {hasAdminAccess ? (
              <Link href="/admin" className="button button-primary">
                Abrir dashboard
              </Link>
            ) : (
              <Link href="/contato" className="button button-secondary">
                Falar com a casa
              </Link>
            )}
          </div>
        </div>

        <article className="profile-card profile-main">
          <div className="profile-avatar-section">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar do usuário"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <span className="profile-avatar-initial">
                  {profile?.nome_completo?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-field">
              <label>Email</label>
              <p className="profile-value">{user.email}</p>
            </div>

            <form
              action={updateProfile}
              className="profile-form"
            >
              <div className="profile-field">
                <label htmlFor="nome_completo">Nome completo</label>
                <input
                  id="nome_completo"
                  name="nome_completo"
                  type="text"
                  defaultValue={profile?.nome_completo || ""}
                  placeholder="Seu nome"
                  className="profile-input"
                />
              </div>
              <button type="submit" className="button button-secondary">
                Salvar nome
              </button>
            </form>

            <form
              action={uploadAvatar}
              className="profile-form"
            >
              <div className="profile-field">
                <label htmlFor="avatar">Foto de perfil</label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="profile-input"
                />
              </div>
              <button type="submit" className="button button-secondary">
                Enviar foto
              </button>
            </form>
          </div>
        </article>

        <form
          action={signOut}
          className="profile-logout"
        >
          <button type="submit" className="button button-secondary">
            Sair
          </button>
        </form>
      </section>
    </main>
  );
}
