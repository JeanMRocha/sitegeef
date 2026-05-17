import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createPublicacao, getPessoasDisponiveis } from '../actions';

export const metadata = {
  title: 'Nova Publicação - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const publicacao = await createPublicacao({
      titulo: formData.get('titulo') as string,
      tipo: (formData.get('tipo') as string) || undefined,
      conteudo: (formData.get('conteudo') as string) || undefined,
      autor_id: formData.get('autor_id') as string,
    });

    redirect(`/admin/comunicacao/${publicacao.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

export default async function NovaPublicacaoPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Publicação</h1>
          <p className="admin-page-subtitle">Criar uma nova publicação</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Título da publicação..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Tipo</label>
              <select
                name="tipo"
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
                <option value="">Selecione um tipo</option>
                <option value="noticia">📰 Notícia</option>
                <option value="aviso">📢 Aviso</option>
                <option value="evento">📅 Evento</option>
                <option value="devotional">📖 Devocional</option>
                <option value="testemunho">💭 Testemunho</option>
                <option value="outro">📄 Outro</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Autor *</label>
              <select
                name="autor_id"
                required
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
                <option value="">Selecione um autor</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Conteúdo</label>
            <textarea
              name="conteudo"
              placeholder="Conteúdo da publicação..."
              rows={8}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>

          <div className="admin-form-group" style={{
            padding: '1rem',
            backgroundColor: 'rgba(107, 114, 128, 0.05)',
            borderRadius: '0.6rem',
            borderLeft: '4px solid #6b7280',
          }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>
              ℹ️ Esta publicação será criada como rascunho. Você poderá revisar e publicar depois.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Rascunho
            </button>
            <Link href="/admin/comunicacao" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
