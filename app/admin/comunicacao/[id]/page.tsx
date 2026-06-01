import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicacaoById, updatePublicacao, deletePublicacao } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Publicação - Admin GEEF',
};

type PublicacaoDetalhe = {
  id: string;
  titulo: string;
  tipo?: string | null;
  conteudo?: string | null;
  status?: string | null;
  publicado_em?: string | null;
  autor?: {
    nome?: string | null;
  } | null;
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

    redirect(buildFlashNoticeUrl(`/admin/comunicacao/${id}`, { variant: 'success', message: 'Publicação salva.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/comunicacao/${id}`, { variant: 'error', message: 'Não foi possível salvar a publicação.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deletePublicacao(id);
    redirect(buildFlashNoticeUrl('/admin/comunicacao', { variant: 'success', message: 'Publicação excluída.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/comunicacao/${id}`, { variant: 'error', message: 'Não foi possível excluir a publicação.' }));
    return;
  }
}

async function PublicacaoContent({ id }: { id: string }) {
  const publicacao = (await getPublicacaoById(id)) as PublicacaoDetalhe | null;
  if (!publicacao) {
    notFound();
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{publicacao.titulo}</h1>
          <p className="admin-page-subtitle">Por {publicacao.autor?.nome}</p>
        </div>
      </div>

      <div className="admin-card form-panel-centered-lg mb-2">
        <h2 className="form-card-title">Editar Publicação</h2>
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

          <div className="grid-auto-300">
            <div className="admin-form-group">
              <label>Tipo</label>
              <select
                name="tipo"
                defaultValue={publicacao.tipo || ''}
                className="profile-form-input form-control-full"
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
                className="profile-form-input form-control-full"
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
              className="profile-input form-control-full"
            />
          </div>

          {publicacao.publicado_em && (
            <div className="admin-form-group panel-accent-card content-surface-note-danger">
              <p className="text-sm-muted">
                ✓ Publicado em {new Date(publicacao.publicado_em).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/comunicacao" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>

      <div className="admin-card form-panel-centered-lg content-surface-note-danger">
        <h2 className="form-card-title text-danger">Zona de Perigo</h2>
        <form action={() => handleDelete(id)}>
          <p className="text-sm-muted">
            Excluir esta publicação permanentemente.
          </p>
          <button type="submit" className="admin-btn admin-btn-secondary admin-btn-danger">
            🗑️ Excluir Publicação
          </button>
        </form>
      </div>
    </div>
  );
}

type PublicacaoParams = {
  id: string;
};

export default async function PublicacaoPage({ params }: { params: Promise<PublicacaoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <PublicacaoContent id={resolvedParams.id} />
    </Suspense>
  );
}
