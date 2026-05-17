import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile, uploadAvatar } from "@/app/login/actions";

export async function ProfilePageView() {
  noStore();

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/perfil");
  }

  const avatarUrl = (user.user_metadata?.avatar_url as string) || null;
  const nomeCompleto = (user.user_metadata?.full_name as string) || null;
  const siteRole = (user.app_metadata?.site_role as string) || null;
  const isAdmin = siteRole === "administrador";
  const roleLabel = isAdmin ? "Administrador" : siteRole || "público";

  return (
    <main className="profile-page-compact">
      <div className="profile-compact-container">
        <header className="profile-compact-header">
          <div className="profile-compact-avatar">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="profile-compact-avatar-img"
              />
            ) : (
              <div className="profile-compact-avatar-placeholder">👤</div>
            )}
          </div>
          <div className="profile-compact-header-info">
            <h1>{nomeCompleto || "Usuário"}</h1>
            <p>{user.email}</p>
            <div className="tag-list" style={{ marginTop: "0.75rem" }}>
              <span className="tag">{roleLabel}</span>
            </div>
          </div>
        </header>

        <div className="profile-compact-forms">
          <form action={updateProfile} className="profile-compact-form">
            <div className="profile-form-field">
              <label htmlFor="nome_completo">Nome Completo</label>
              <div className="profile-form-row">
                <input
                  id="nome_completo"
                  name="nome_completo"
                  type="text"
                  defaultValue={nomeCompleto || ""}
                  placeholder="Seu nome"
                  className="profile-form-input"
                />
                <button type="submit" className="profile-form-btn profile-form-btn-primary">
                  Salvar
                </button>
              </div>
            </div>
          </form>

          <form action={uploadAvatar} className="profile-compact-form">
            <div className="profile-form-field">
              <label htmlFor="avatar">Foto de Perfil</label>
              <div className="profile-form-row">
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="profile-form-input"
                />
                <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                  Upload
                </button>
              </div>
            </div>
          </form>

        </div>

        <div className="profile-compact-info">
          <p>💡 Use o menu flutuante no canto superior direito para configurações, tema e logout.</p>
        </div>
      </div>
    </main>
  );
}
