import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTermoById, updateTermo, revogaTermo } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Editar Termo Assinado - Admin GEEF',
};

type TermoDetalhe = {
  id: string;
  status: string;
  criado_em: string;
  data_assinatura?: string | null;
  validade?: string | null;
  arquivo_url?: string | null;
  responsavel_id?: string | null;
  pessoas?: { nome?: string | null } | null;
  documentos_modelo?: {
    tipo?: string | null;
    titulo?: string | null;
    conteudo?: string | null;
  } | null;
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateTermo(id, {
      data_assinatura: (formData.get('data_assinatura') as string) || undefined,
      validade: (formData.get('validade') as string) || undefined,
      arquivo_url: (formData.get('arquivo_url') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/termos/${id}`, { variant: 'success', message: 'Termo salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar termo:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/termos/${id}`, { variant: 'error', message: 'Não foi possível salvar o termo.' }));
    return;
  }
}

async function handleRevoke(id: string) {
  'use server';

  try {
    await revogaTermo(id);
    redirect(buildFlashNoticeUrl(`/admin/documentos/termos/${id}`, { variant: 'success', message: 'Termo revogado.' }));
  } catch (error) {
    console.error('Erro ao revogar termo:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/termos/${id}`, { variant: 'error', message: 'Não foi possível revogar o termo.' }));
    return;
  }
}

async function EditTermoContent({ id }: { id: string }) {
  const termo = (await getTermoById(id)) as TermoDetalhe | null;

  if (!termo) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Termo Assinado</h1>
            <p className="admin-page-subtitle">Registro não encontrado.</p>
          </div>
        </div>

        <div className="admin-card">
          <p className="text-muted">
            O termo pode ter sido removido ou você não tem acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Termo Assinado</h1>
          <p className="admin-page-subtitle">{termo.pessoas?.nome}</p>
        </div>
        {termo.status === 'ativo' && (
          <form action={() => handleRevoke(id)} className="inline-form">
            <button
              type="submit"
              className="admin-btn admin-btn-secondary admin-btn-danger"
              onClick={(e) => {
                if (!confirm('Tem certeza que deseja revogar este termo?')) {
                  e.preventDefault();
                }
              }}
            >
              ✕ Revogar
            </button>
          </form>
        )}
      </div>

      <div className="admin-card panel-accent-card">
        <div className="content-surface-note">
          Mantenha vigência e arquivo coerentes. Se houver revogação, deixe a evidência visível.
        </div>
        <div className="grid-auto-300">
          <div>
            <p className="text-sm-muted">
              <strong>Documento:</strong> {termo.documentos_modelo?.tipo || '—'}
            </p>
            <p className="text-sm-muted">
              <strong>Título:</strong> {termo.documentos_modelo?.titulo || '—'}
            </p>
            <p className="text-sm-muted">
              <strong>Status:</strong>{' '}
              <span className={termo.status === 'ativo' ? 'inline-status inline-status-success' : 'inline-status inline-status-danger'}>
                {termo.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm-muted">
              <strong>Criado em:</strong> {new Date(termo.criado_em).toLocaleDateString('pt-BR')}
            </p>
            {termo.responsavel_id && (
              <p className="text-sm-muted">
                <strong>Responsável:</strong> {termo.responsavel_id}
              </p>
            )}
          </div>
        </div>
      </div>

      {termo.status === 'ativo' && (
        <div className="admin-card form-panel-centered">
          <h2 className="form-card-title">Editar Informações</h2>

          <form action={(formData) => handleUpdate(id, formData)}>
            <div className="admin-form-group">
              <label>Pessoa</label>
              <input
                type="text"
                value={termo.pessoas?.nome || ''}
                disabled
                className="profile-input form-control-full"
              />
            </div>

            <div className="grid-auto-300 mb-1-5">
              <div className="admin-form-group">
                <label>Data de Assinatura</label>
                <input
                  type="date"
                  name="data_assinatura"
                  defaultValue={termo.data_assinatura || ''}
                />
              </div>
              <div className="admin-form-group">
                <label>Validade</label>
                <input
                  type="date"
                  name="validade"
                  defaultValue={termo.validade || ''}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>URL do arquivo</label>
              <input
                type="url"
                name="arquivo_url"
                defaultValue={termo.arquivo_url || ''}
                placeholder="https://..."
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Salvar
              </button>
              <Link href="/admin/documentos/termos" className="admin-btn admin-btn-secondary">
                ❌ Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}

      {termo.documentos_modelo?.conteudo && (
        <div className="admin-card form-panel-centered-lg mt-2">
          <h2 className="form-card-title">Conteúdo do Documento</h2>
          <div className="content-surface-note details-box text-pre-wrap">
            {termo.documentos_modelo.conteudo}
          </div>
        </div>
      )}
    </div>
  );
}

type TermoParams = {
  id: string;
};

export default async function EditTermoPage({ params }: { params: Promise<TermoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EditTermoContent id={resolvedParams.id} />
    </Suspense>
  );
}
