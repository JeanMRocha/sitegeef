import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getObraById, updateObra, toggleObraStatus, deleteExemplar } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Editar Obra - Admin GEEF',
};

type ObraExemplar = {
  id: string;
  codigo: string;
  localizacao?: string | null;
  origem?: string | null;
  situacao: 'disponivel' | 'emprestado' | 'reservado' | 'danificado' | 'perdido' | string;
};

type ObraDetalhe = {
  id: string;
  titulo: string;
  autor?: string | null;
  editora?: string | null;
  isbn?: string | null;
  categoria?: string | null;
  sinopse?: string | null;
  capa_url?: string | null;
  publico?: string | null;
  ativo: boolean;
  exemplares?: ObraExemplar[] | null;
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateObra(id, {
      titulo: (formData.get('titulo') as string) || undefined,
      autor: (formData.get('autor') as string) || undefined,
      editora: (formData.get('editora') as string) || undefined,
      isbn: (formData.get('isbn') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
      sinopse: (formData.get('sinopse') as string) || undefined,
      capa_url: (formData.get('capa_url') as string) || undefined,
      publico: (formData.get('publico') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${id}`, { variant: 'success', message: 'Obra salva.' }));
  } catch (error) {
    console.error('Erro ao atualizar obra:', error);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${id}`, { variant: 'error', message: 'Não foi possível salvar a obra.' }));
    return;
  }
}

async function handleToggleStatus(id: string, novoStatus: boolean) {
  'use server';

  try {
    await toggleObraStatus(id, novoStatus);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${id}`, { variant: 'success', message: 'Status da obra atualizado.' }));
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${id}`, { variant: 'error', message: 'Não foi possível alterar o status.' }));
    return;
  }
}

async function handleDeleteExemplar(obraId: string, exemplarId: string) {
  'use server';

  try {
    await deleteExemplar(exemplarId);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${obraId}`, { variant: 'success', message: 'Exemplar removido.' }));
  } catch (error) {
    console.error('Erro ao deletar exemplar:', error);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${obraId}`, { variant: 'error', message: 'Não foi possível remover o exemplar.' }));
    return;
  }
}

async function EditObraContent({ id }: { id: string }) {
  const obra = (await getObraById(id)) as ObraDetalhe | null;
  if (!obra) {
    notFound();
  }
  const categorias = ['Espiritismo', 'Religião', 'Filosofia', 'Autoajuda', 'Infantil', 'Juventude', 'Ficção', 'Outro'];

  const exemplares = obra.exemplares ?? [];
  const disponiveis = exemplares.filter((e) => e.situacao === 'disponivel').length;
  const emprestados = exemplares.filter((e) => e.situacao === 'emprestado').length;
  const reservados = exemplares.filter((e) => e.situacao === 'reservado').length;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Obra</h1>
          <p className="admin-page-subtitle">{obra.titulo}</p>
        </div>
        <form action={() => handleToggleStatus(id, !obra.ativo)} className="inline-form">
          <button
            type="submit"
            className={`admin-btn ${obra.ativo ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            {obra.ativo ? '✓ Ativo' : '○ Inativo'}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="admin-card panel-accent-card">
        <div className="area-panel-grid grid-auto-220">
          <div>
            <p className="text-xs-muted">Total</p>
            <p className="text-sm-500">{exemplares.length}</p>
          </div>
          <div>
            <p className="text-xs-muted">Disponíveis</p>
            <p className="text-sm-500 text-success">{disponiveis}</p>
          </div>
          <div>
            <p className="text-xs-muted">Emprestados</p>
            <p className="text-sm-500 text-warning">{emprestados}</p>
          </div>
          <div>
            <p className="text-xs-muted">Reservados</p>
            <p className="text-sm-500 text-primary">{reservados}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered">
        <h2 className="form-card-title">Informações da Obra</h2>

        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={obra.titulo}
              required
            />
          </div>

          <div className="grid-auto-300 mb-1-5">
            <div className="admin-form-group">
              <label>Autor</label>
              <input type="text" name="autor" defaultValue={obra.autor || ''} />
            </div>
            <div className="admin-form-group">
              <label>Editora</label>
              <input type="text" name="editora" defaultValue={obra.editora || ''} />
            </div>
          </div>

          <div className="grid-auto-300 mb-1-5">
            <div className="admin-form-group">
              <label>ISBN</label>
              <input type="text" name="isbn" defaultValue={obra.isbn || ''} />
            </div>
            <div className="admin-form-group">
              <label>Categoria</label>
              <select
                name="categoria"
                defaultValue={obra.categoria || ''}
                className="profile-form-input form-control-full"
              >
                <option value="">— Selecione —</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Público Alvo</label>
            <select
              name="publico"
              defaultValue={obra.publico || 'adulto'}
              className="profile-form-input form-control-full"
            >
              <option value="adulto">Adulto</option>
              <option value="jovem">Jovem</option>
              <option value="infantil">Infantil</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Sinopse</label>
            <textarea
              name="sinopse"
              rows={4}
              defaultValue={obra.sinopse || ''}
              className="profile-input form-control-full"
            />
          </div>

          <div className="admin-form-group">
            <label>URL da Capa</label>
            <input
              type="url"
              name="capa_url"
              defaultValue={obra.capa_url || ''}
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/biblioteca" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Exemplares */}
      <div className="admin-card">
        <div className="area-top-line">
          <h2 className="form-card-title">
            📚 Exemplares ({obra.exemplares?.length || 0})
          </h2>
          <Link href={`/admin/biblioteca/${id}/novo-exemplar`} className="admin-btn admin-btn-small">
            ➕ Novo Exemplar
          </Link>
        </div>

        {exemplares.length > 0 ? (
          <div className="atendimento-list">
            {exemplares.map((exemplar) => (
              <div
                key={exemplar.id}
                className="profile-panel admin-exemplar-row"
              >
                <div>
                  <p className="text-xs-muted mt-035">Código</p>
                  <p className="text-sm-500">{exemplar.codigo}</p>
                </div>
                <div>
                  <p className="text-xs-muted mt-035">Localização</p>
                  <p className="text-sm-muted">{exemplar.localizacao || '—'}</p>
                </div>
                <div>
                  <p className="text-xs-muted mt-035">Origem</p>
                  <p className="text-sm-muted">{exemplar.origem || '—'}</p>
                </div>
                <div>
                  <p className="text-xs-muted mt-035">Situação</p>
                  <span className={`inline-status ${
                    exemplar.situacao === 'disponivel'
                      ? 'inline-status-success'
                      : exemplar.situacao === 'emprestado'
                        ? 'inline-status-warning'
                        : exemplar.situacao === 'reservado'
                          ? 'inline-status-primary'
                          : exemplar.situacao === 'danificado'
                            ? 'inline-status-danger'
                            : 'inline-status-neutral'
                  }`}>
                    {exemplar.situacao}
                  </span>
                </div>
                <div className="form-actions-row mt-075">
                  <Link href={`/admin/biblioteca/${id}/exemplar/${exemplar.id}`} className="admin-btn admin-btn-small">
                    ✏️
                  </Link>
                  <form action={() => handleDeleteExemplar(id, exemplar.id)} className="inline-form">
                    <button
                      type="submit"
                      className="admin-btn admin-btn-danger admin-btn-small"
                      onClick={(e) => {
                        if (!confirm('Tem certeza que deseja deletar este exemplar?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Nenhum exemplar cadastrado.</p>
        )}
      </div>
    </div>
  );
}

type ObraParams = {
  id: string;
};

export default async function EditObraPage({ params }: { params: Promise<ObraParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EditObraContent id={resolvedParams.id} />
    </Suspense>
  );
}
