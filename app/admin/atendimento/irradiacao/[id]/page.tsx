import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getIrradiacaoById, updateIrradiacao, toggleIrradiacaoStatus } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Irradiação - Admin GEEF',
};

type IrradiacaoDetalhe = {
  id: string;
  nome_irradiacao: string;
  motivo: string;
  periodo?: string | null;
  status: string;
  confidencial?: boolean | null;
  pessoas?: { nome?: string | null } | null;
};

type IrradiacaoParams = {
  id: string;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateIrradiacao(id, {
      nome_irradiacao: formData.get('nome_irradiacao') as string,
      motivo: formData.get('motivo') as string,
      periodo: formData.get('periodo') as string,
      confidencial: formData.get('confidencial') === 'on',
      status: formData.get('status') as string,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/irradiacao/${id}`, { variant: 'success', message: 'Irradiação salva.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/irradiacao/${id}`, { variant: 'error', message: 'Não foi possível salvar a irradiação.' }));
    return;
  }
}

async function handleToggle(id: string, ativa: boolean) {
  'use server';

  try {
    await toggleIrradiacaoStatus(id, ativa);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/irradiacao/${id}`, { variant: 'success', message: 'Status da irradiação atualizado.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/irradiacao/${id}`, { variant: 'error', message: 'Não foi possível alterar o status.' }));
    return;
  }
}

async function Content({ id }: { id: string }) {
  const irr = (await getIrradiacaoById(id)) as IrradiacaoDetalhe;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{irr.nome_irradiacao}</h1>
          <p className="admin-page-subtitle">{irr.pessoas?.nome}</p>
        </div>
        <form action={() => handleToggle(id, irr.status === 'ativa')} className="inline-form">
          <button
            type="submit"
            className={irr.status === 'ativa' ? 'admin-btn admin-btn-secondary admin-btn-danger' : 'admin-btn admin-btn-secondary status-toggle-btn status-toggle-btn--active'}
          >
            {irr.status === 'ativa' ? '🔒 Encerrar' : '✓ Reativar'}
          </button>
        </form>
      </div>

      <div className="admin-card form-panel-centered">
        <form action={(formData) => handleSubmit(id, formData)}>
          <LgpdFormNotice text="Usamos estes dados para registrar a solicitação e manter o fluxo de acompanhamento." />

          <div className="admin-form-group">
            <label>Nome da Irradiação *</label>
            <input
              type="text"
              name="nome_irradiacao"
              defaultValue={irr.nome_irradiacao}
              required
              className="profile-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Motivo *</label>
            <textarea
              name="motivo"
              defaultValue={irr.motivo}
              rows={3}
              required
              className="profile-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Período *</label>
            <input
              type="text"
              name="periodo"
              defaultValue={irr.periodo || ''}
              required
              className="profile-form-input"
            />
          </div>

          <div className="content-surface-note content-surface-note-inline content-surface-note-danger">
            <input
              type="checkbox"
              name="confidencial"
              id="confidencial"
              defaultChecked={Boolean(irr.confidencial)}
              className="mt-035"
            />
            <label htmlFor="confidencial" className="mb-0">
              🔒 Marcar como confidencial
            </label>
          </div>

          <div className="admin-form-group">
            <label>Status *</label>
            <select
              name="status"
              defaultValue={irr.status}
              required
              className="profile-form-input"
            >
              <option value="ativa">✓ Ativa</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/atendimento/irradiacao" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<IrradiacaoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <Content id={resolvedParams.id} />
    </Suspense>
  );
}
