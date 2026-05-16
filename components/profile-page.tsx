import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut, updateProfile, uploadAvatar } from "@/app/login/actions";

export async function ProfilePageView() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/perfil");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-header">
          <h1>Seu Perfil</h1>
          <p>Gerencie seus dados e preferências</p>
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
              action={async (formData) => {
                await updateProfile(formData);
              }}
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
              action={async (formData) => {
                await uploadAvatar(formData);
              }}
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
          action={async () => {
            await signOut();
          }}
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
