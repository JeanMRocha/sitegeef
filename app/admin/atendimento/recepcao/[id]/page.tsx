import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getRecepcaoById, updateRecepcao, deleteRecepcao } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Atendimento Recepção - Admin GEEF',
};

type AtendimentoRecepcaoParams = {
  id: string;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateRecepcao(id, {
      data: formData.get('data') as string,
      pessoas_atendidas: parseInt(formData.get('pessoas_atendidas') as string),
      motivo_geral: formData.get('motivo_geral') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/recepcao/${id}`, { variant: 'success', message: 'Atendimento salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/recepcao/${id}`, { variant: 'error', message: 'Não foi possível salvar o atendimento.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteRecepcao(id);
    redirect(buildFlashNoticeUrl('/admin/atendimento/recepcao', { variant: 'success', message: 'Atendimento excluído.' }));
  } catch (error) {
    console.error('Erro ao deletar:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/recepcao/${id}`, { variant: 'error', message: 'Não foi possível excluir o atendimento.' }));
    return;
  }
}

async function AtendimentoContent({ id }: { id: string }) {
  const atend = await getRecepcaoById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Atendimento Recepção</h1>
          <p className="admin-page-subtitle">{new Date(atend.data).toLocaleDateString('pt-BR')}</p>
        </div>
        <form action={() => handleDelete(id)}>
          <button
            type="submit"
            className="admin-btn status-toggle-btn status-toggle-btn--active"
            onClick={(e) => {
              if (!confirm('Tem certeza que deseja deletar este atendimento?')) {
                e.preventDefault();
              }
            }}
          >
            ✕ Deletar
          </button>
        </form>
      </div>

      <div className="admin-card form-panel-centered">
        <form action={(formData) => handleSubmit(id, formData)}>
          <LgpdFormNotice text="Usamos estes dados para manter o histórico do atendimento e o acompanhamento interno." />

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Data *</label>
              <input type="date" name="data" defaultValue={atend.data} required />
            </div>
            <div className="admin-form-group">
              <label>Pessoas Atendidas *</label>
              <input type="number" name="pessoas_atendidas" defaultValue={atend.pessoas_atendidas} min="0" required />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Motivo Geral *</label>
            <input type="text" name="motivo_geral" defaultValue={atend.motivo_geral} required />
          </div>

          <div className="admin-form-group">
            <label>Encaminhamento</label>
            <input type="text" name="encaminhamento" defaultValue={atend.encaminhamento || ''} />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea name="observacoes" defaultValue={atend.observacoes || ''} rows={3} />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/atendimento/recepcao" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function AtendimentoPage({ params }: { params: Promise<AtendimentoRecepcaoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <AtendimentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
