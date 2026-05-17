import Link from 'next/link';
import { redirect } from 'next/navigation';
import { addContato, deleteContato, getContatos } from '../actions';

export const metadata = {
  title: 'Contatos Institucionais - Admin GEEF',
};

export const dynamic = 'force-dynamic';

async function handleAddContato(formData: FormData) {
  'use server';

  await addContato({
    tipo: (formData.get('tipo') as string) || 'Contato',
    telefone: (formData.get('telefone') as string) || undefined,
    whatsapp: (formData.get('whatsapp') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    instagram: (formData.get('instagram') as string) || undefined,
    facebook: (formData.get('facebook') as string) || undefined,
    youtube: (formData.get('youtube') as string) || undefined,
    site: (formData.get('site') as string) || undefined,
    responsavel_id: (formData.get('responsavel_id') as string) || undefined,
  });

  redirect('/admin/instituicao/contatos');
}

async function handleDeleteContato(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id === 'string' && id) {
    await deleteContato(id);
  }

  redirect('/admin/instituicao/contatos');
}

export default async function ContatosInstituicaoPage() {
  const contatos = await getContatos();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Contatos</h1>
          </div>
          <Link href="/admin/instituicao" className="profile-form-btn profile-form-btn-secondary">
            Voltar
          </Link>
        </div>
        <p className="area-subtitle">Telefones, e-mails e redes oficiais.</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {contatos.length > 0 ? (
            <div className="module-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {contatos.map((contato: any) => (
                <div key={contato.id} className="area-panel-item">
                  <strong>{contato.tipo || 'Contato'}</strong>
                  <p style={{ marginTop: '0.5rem' }}>
                    {contato.telefone && <>☎️ {contato.telefone}<br /></>}
                    {contato.whatsapp && <>💬 {contato.whatsapp}<br /></>}
                    {contato.email && <>📧 {contato.email}<br /></>}
                    {contato.site && <>🌐 {contato.site}<br /></>}
                    {contato.instagram && <>📸 {contato.instagram}<br /></>}
                    {contato.facebook && <>📘 {contato.facebook}<br /></>}
                    {contato.youtube && <>▶️ {contato.youtube}</>}
                  </p>
                  <form action={handleDeleteContato} style={{ marginTop: '0.75rem' }}>
                    <input type="hidden" name="id" value={contato.id} />
                    <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                      Remover
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="area-empty">Nenhum contato registrado.</div>
          )}
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface" style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="area-section-title">
            <h2>Novo contato</h2>
            <p>Cadastre um canal oficial de atendimento.</p>
          </div>

          <form action={handleAddContato}>
            <div className="module-grid">
              <label className="profile-form-field">
                <span>Tipo *</span>
                <input name="tipo" className="profile-form-input" placeholder="Ex: WhatsApp" required />
              </label>
              <label className="profile-form-field">
                <span>Telefone</span>
                <input name="telefone" className="profile-form-input" placeholder="(00) 0000-0000" />
              </label>
              <label className="profile-form-field">
                <span>WhatsApp</span>
                <input name="whatsapp" className="profile-form-input" placeholder="(00) 00000-0000" />
              </label>
              <label className="profile-form-field">
                <span>Email</span>
                <input type="email" name="email" className="profile-form-input" placeholder="contato@..." />
              </label>
              <label className="profile-form-field">
                <span>Instagram</span>
                <input name="instagram" className="profile-form-input" placeholder="@perfil" />
              </label>
              <label className="profile-form-field">
                <span>Facebook</span>
                <input name="facebook" className="profile-form-input" placeholder="URL ou página" />
              </label>
              <label className="profile-form-field">
                <span>YouTube</span>
                <input name="youtube" className="profile-form-input" placeholder="URL do canal" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Site</span>
                <input name="site" className="profile-form-input" placeholder="https://..." />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Responsável (ID da pessoa)</span>
                <input name="responsavel_id" className="profile-form-input" placeholder="UUID opcional" />
              </label>
            </div>

            <div className="area-panel-grid" style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">
                Salvar contato
              </button>
              <Link href="/admin/instituicao" className="profile-form-btn profile-form-btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
