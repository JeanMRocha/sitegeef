import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getModeloById, updateModelo, toggleModeloStatus } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Editar Modelo de Documento - Admin GEEF',
};

type ModeloPageParams = {
  id: string;
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateModelo(id, {
      tipo: (formData.get('tipo') as string) || undefined,
      titulo: (formData.get('titulo') as string) || undefined,
      versao: (formData.get('versao') as string) || undefined,
      conteudo: (formData.get('conteudo') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/${id}`, { variant: 'success', message: 'Documento salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar modelo:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/${id}`, { variant: 'error', message: 'Não foi possível salvar o documento.' }));
    return;
  }
}

async function handleToggleStatus(id: string, novoStatus: boolean) {
  'use server';

  try {
    await toggleModeloStatus(id, novoStatus);
    redirect(buildFlashNoticeUrl(`/admin/documentos/${id}`, { variant: 'success', message: 'Status atualizado.' }));
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/${id}`, { variant: 'error', message: 'Não foi possível atualizar o status.' }));
    return;
  }
}

async function EditModeloContent({ id }: { id: string }) {
  const modelo = await getModeloById(id);

  const tipos = [
    'termo_imagem_adulto',
    'termo_imagem_menor',
    'voluntariado',
    'privacidade',
    'consentimento_geral',
    'outro',
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Modelo</h1>
          <p className="admin-page-subtitle">{modelo.titulo}</p>
        </div>
        <div className="table-actions-inline">
          <form action={() => handleToggleStatus(id, !modelo.ativo)}>
            <button
              type="submit"
              className={`admin-btn status-toggle-btn ${modelo.ativo ? 'status-toggle-btn--active' : 'status-toggle-btn--inactive'}`}
            >
              {modelo.ativo ? '✓ Ativo' : '○ Inativo'}
            </button>
          </form>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered">
        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Tipo de Documento *</label>
            <select name="tipo" defaultValue={modelo.tipo} required>
              <option value="">— Selecione —</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.replace(/_/g, ' ').charAt(0).toUpperCase() + tipo.replace(/_/g, ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={modelo.titulo}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Versão</label>
            <input
              type="text"
              name="versao"
              defaultValue={modelo.versao || ''}
            />
          </div>

          <div className="admin-form-group">
            <label>Conteúdo do Documento</label>
            <textarea
              name="conteudo"
              rows={12}
              defaultValue={modelo.conteudo || ''}
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/documentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>

        {/* Info */}
        <div className="content-surface-note content-surface-note-bordered">
          <p className="mt-1 text-xs-muted">
            <strong>Criado em:</strong> {new Date(modelo.criado_em).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function EditModeloPage({ params }: { params: Promise<ModeloPageParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EditModeloContent id={resolvedParams.id} />
    </Suspense>
  );
}
