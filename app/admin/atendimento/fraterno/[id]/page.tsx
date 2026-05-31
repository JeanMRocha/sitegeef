import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAtendimentoFraternoById, updateAtendimentoFraterno, deleteAtendimentoFraterno, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Atendimento Fraterno - Admin GEEF',
};

type AtendimentoFraternoParams = {
  id: string;
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateAtendimentoFraterno(id, {
      pessoa_id: formData.get('pessoa_id') as string,
      atendente_id: formData.get('atendente_id') as string,
      data: formData.get('data') as string,
      tipo: formData.get('tipo') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      sigilo: formData.get('sigilo') === 'on',
      status: formData.get('status') as string,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/fraterno/${id}`, { variant: 'success', message: 'Atendimento salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/fraterno/${id}`, { variant: 'error', message: 'Não foi possível salvar o atendimento.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteAtendimentoFraterno(id);
    redirect(buildFlashNoticeUrl('/admin/atendimento/fraterno', { variant: 'success', message: 'Atendimento removido.' }));
  } catch (error) {
    console.error('Erro ao deletar:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/fraterno', { variant: 'error', message: 'Não foi possível remover o atendimento.' }));
    return;
  }
}

async function AtendimentoContent({ id }: { id: string }) {
  const atend = await getAtendimentoFraternoById(id);
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];
  const tipos = ['consolo', 'esclarecimento', 'orientação espiritual', 'apoio emocional', 'outro'];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{atend.pessoas?.nome}</h1>
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
          <LgpdFormNotice text="Usamos estes dados para manter o registro do atendimento e o encaminhamento seguro." />

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Pessoa Atendida *</label>
              <select name="pessoa_id" defaultValue={atend.pessoas?.id} required>
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Atendente *</label>
              <select name="atendente_id" defaultValue={atend.atendente?.id} required>
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Data *</label>
              <input type="date" name="data" defaultValue={atend.data} required />
            </div>

            <div className="admin-form-group">
              <label>Tipo de Atendimento *</label>
              <select name="tipo" defaultValue={atend.tipo} required>
                <option value="">— Selecione —</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Encaminhamento</label>
            <input type="text" name="encaminhamento" defaultValue={atend.encaminhamento || ''} />
          </div>

          <div className="admin-form-group">
            <label>Observações (Sigiloso)</label>
            <textarea name="observacoes" defaultValue={atend.observacoes || ''} rows={3} />
          </div>

          <div className="content-surface-note content-surface-note-inline content-surface-note-danger mb-2">
            <input
              type="checkbox"
              name="sigilo"
              id="sigilo"
              defaultChecked={atend.sigilo}
            />
            <label htmlFor="sigilo" className="mb-0">
              🔒 Marcar este atendimento como sigiloso
            </label>
          </div>

          <div className="admin-form-group">
            <label>Status *</label>
            <select name="status" defaultValue={atend.status} required>
              <option value="em_aberto">🔓 Em Aberto</option>
              <option value="encerrado">✓ Encerrado</option>
            </select>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function AtendimentoPage({ params }: { params: Promise<AtendimentoFraternoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <AtendimentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
