import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createReuniao, getPessoasDisponiveis } from '../actions';

export const metadata = {
  title: 'Nova Reunião Virtual - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const reuniao = await createReuniao({
      titulo: formData.get('titulo') as string,
      plataforma: (formData.get('plataforma') as string) || undefined,
      link: (formData.get('link') as string) || undefined,
      senha: (formData.get('senha') as string) || undefined,
      anfitriao_id: (formData.get('anfitriao_id') as string) || undefined,
      data_hora: (formData.get('data_hora') as string) || undefined,
    });

    redirect(`/admin/reunioes-virtuais/${reuniao.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

export default async function NovaReuniao() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Reunião Virtual</h1>
          <p className="admin-page-subtitle">Registrar uma nova reunião online</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: Reunião de Diretoria, Aula IEE, Palestra..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Plataforma</label>
              <select
                name="plataforma"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione uma plataforma</option>
                <option value="zoom">🎥 Zoom</option>
                <option value="google-meet">📹 Google Meet</option>
                <option value="teams">💬 Microsoft Teams</option>
                <option value="jitsi">🔗 Jitsi Meet</option>
                <option value="outra">📡 Outra</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Anfitrião</label>
              <select
                name="anfitriao_id"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione um anfitrião</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Link de Acesso (URL)</label>
            <input
              type="url"
              name="link"
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-group">
            <label>Senha/PIN de Acesso</label>
            <input
              type="text"
              name="senha"
              placeholder="Ex: 123456"
            />
          </div>

          <div className="admin-form-group">
            <label>Data e Hora</label>
            <input
              type="datetime-local"
              name="data_hora"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Reunião
            </button>
            <Link href="/admin/reunioes-virtuais" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
