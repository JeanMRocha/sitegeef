import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAtendimentoFraterno, getPessoasDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Atendimento Fraterno - Admin GEEF',
};

export const dynamic = 'force-dynamic';

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const atend = await createAtendimentoFraterno({
      pessoa_id: formData.get('pessoa_id') as string,
      atendente_id: formData.get('atendente_id') as string,
      data: formData.get('data') as string,
      tipo: formData.get('tipo') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      sigilo: formData.get('sigilo') === 'on',
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/fraterno/${atend.id}`, { variant: 'success', message: 'Atendimento fraterno criado.' }));
  } catch (error) {
    console.error('Erro ao criar atendimento:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/fraterno', { variant: 'error', message: 'Não foi possível criar o atendimento.' }));
    return;
  }
}

async function NovoAtendimentoPage() {
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];
  const hoje = new Date().toISOString().split('T')[0];
  const tipos = ['consolo', 'esclarecimento', 'orientação espiritual', 'apoio emocional', 'outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Atendimento Fraterno</h1>
          <p className="admin-page-subtitle">Registre um atendimento fraterno</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered">
        <LgpdFormNotice
          title="Atendimento fraterno"
          text="Os dados informados serão usados para acolhimento, encaminhamento e registro seguro do atendimento."
        />
        <form action={handleSubmit}>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Pessoa Atendida *</label>
              <select
                name="pessoa_id"
                required
                className="profile-form-input"
              >
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
              <select
                name="atendente_id"
                required
                className="profile-form-input"
              >
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
              <input
                type="date"
                name="data"
                defaultValue={hoje}
                required
                className="profile-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Tipo de Atendimento *</label>
              <select
                name="tipo"
                required
                className="profile-form-input"
              >
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
            <input
              type="text"
              name="encaminhamento"
              placeholder="Ex: Passe, atendimento medico"
              className="profile-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Observações (Sigiloso)</label>
            <textarea
              name="observacoes"
              placeholder="Notas sobre o atendimento... (este campo é sigiloso)"
              rows={3}
              className="profile-form-input"
            />
          </div>

          <div className="content-surface-note content-surface-note-inline content-surface-note-danger">
            <input
              type="checkbox"
              name="sigilo"
              id="sigilo"
              className="mt-035"
            />
            <label htmlFor="sigilo" className="mb-0">
              🔒 Marcar este atendimento como sigiloso (só visível para pode_atendimento)
            </label>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Atendimento
            </button>
            <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoAtendimentoPage;
