import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPublicacaoById, updatePublicacao, deletePublicacao } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Publicação - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updatePublicacao(id, {
      titulo: (formData.get('titulo') as string) || undefined,
      tipo: (formData.get('tipo') as string) || undefined,
      conteudo: (formData.get('conteudo') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(`/admin/comunicacao/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deletePublicacao(id);
    redirect('/admin/comunicacao');
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function PublicacaoContent({ id }: { id: string }) {
  const publicacao = await getPublicacaoById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{publicacao.titulo}</h1>
          <p className="admin-page-subtitle">Por {publicacao.autor?.nome}</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Publicação</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={publicacao.titulo}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Tipo</label>
              <select
                name="tipo"
                defaultValue={publicacao.tipo || ''}
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
              <label>Status</label>
              <select
                name="status"
                defaultValue={publicacao.status || 'rascunho'}
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
                <option value="rascunho">📝 Rascunho</option>
                <option value="revisao">🔍 Revisão</option>
                <option value="aprovado">✓ Aprovado</option>
                <option value="publicado">🔔 Publicado</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Conteúdo</label>
            <textarea
              name="conteudo"
              defaultValue={publicacao.conteudo || ''}
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

          {publicacao.publicado_em && (
            <div className="admin-form-group" style={{
              padding: '1rem',
              backgroundColor: 'rgba(34, 197, 94, 0.05)',
              borderRadius: '0.6rem',
              borderLeft: '4px solid #22c55e',
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                ✓ Publicado em {new Date(publicacao.publicado_em).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/comunicacao" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#ef4444' }}>Zona de Perigo</h2>
        <form action={() => handleDelete(id)}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Excluir esta publicação permanentemente.
          </p>
          <button type="submit" className="admin-btn" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
            🗑️ Excluir Publicação
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function PublicacaoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <PublicacaoContent id={resolvedParams.id} />
    </Suspense>
  );
}
