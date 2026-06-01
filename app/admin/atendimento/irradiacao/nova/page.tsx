import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createIrradiacao, getPessoasDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Nova Irradiação - Admin GEEF',
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const irr = await createIrradiacao({
      solicitante_id: formData.get('solicitante_id') as string,
      nome_irradiacao: formData.get('nome_irradiacao') as string,
      motivo: formData.get('motivo') as string,
      periodo: formData.get('periodo') as string,
      confidencial: formData.get('confidencial') === 'on',
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/irradiacao/${irr.id}`, { variant: 'success', message: 'Irradiação criada.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/irradiacao', { variant: 'error', message: 'Não foi possível criar a irradiação.' }));
    return;
  }
}

async function NovaPage() {
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Solicitação de Irradiação</h1>
          <p className="admin-page-subtitle">Registre uma solicitação de preces irradiadas</p>
        </div>
      </div>

      <div className="admin-card form-panel-centered">
        <LgpdFormNotice
          title="Irradiação"
          text="Usamos os dados apenas para registrar a solicitação e manter o sigilo da equipe responsável."
        />
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Solicitante *</label>
            <select name="solicitante_id" required className="profile-form-input">
              <option value="">— Selecione —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Nome da Irradiação *</label>
            <input
              type="text"
              name="nome_irradiacao"
              placeholder="Ex: Cura espiritual para João"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Motivo *</label>
            <textarea
              name="motivo"
              placeholder="Qual é o motivo da solicitação de irradiação?"
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
              placeholder="Ex: 30 dias, conforme necessário"
              required
            />
          </div>

          <div className="content-surface-note content-surface-note-inline">
            <input
              type="checkbox"
              name="confidencial"
              id="confidencial"
              className="mt-035"
            />
            <label htmlFor="confidencial" className="mb-0">
              🔒 Marcar como confidencial (restrinja acesso)
            </label>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar
            </button>
            <Link href="/admin/atendimento/irradiacao" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaPage;
