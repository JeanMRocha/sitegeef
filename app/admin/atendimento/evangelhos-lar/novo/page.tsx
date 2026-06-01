import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createEvangelhoNoLar, getPessoasDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Evangelho no Lar - Admin GEEF',
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const ev = await createEvangelhoNoLar({
      pessoa_id: formData.get('pessoa_id') as string,
      endereco: formData.get('endereco') as string,
      equipe: formData.get('equipe') as string,
      data: formData.get('data') as string,
      situacao: formData.get('situacao') as string,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/evangelhos-lar/${ev.id}`, { variant: 'success', message: 'Evangelho no Lar criado.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/evangelhos-lar', { variant: 'error', message: 'Não foi possível criar o Evangelho no Lar.' }));
    return;
  }
}

async function NovoPage() {
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Evangelho no Lar</h1>
          <p className="admin-page-subtitle">Registre uma atividade de evangelização familiar</p>
        </div>
      </div>

      <div className="admin-card form-panel-centered">
        <form action={handleSubmit}>
          <LgpdFormNotice text="Usamos estes dados para organizar a atividade e manter o histórico do atendimento." />
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select name="pessoa_id" required className="profile-form-input">
              <option value="">— Selecione —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Endereço *</label>
            <input
              type="text"
              name="endereco"
              placeholder="Rua, número, bairro"
              required
              className="profile-form-input"
            />
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
              <label>Situação *</label>
              <select name="situacao" required className="profile-form-input">
                <option value="">— Selecione —</option>
                <option value="planejada">Planejada</option>
                <option value="realizada">Realizada</option>
                <option value="adiada">Adiada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Equipe *</label>
            <input
              type="text"
              name="equipe"
              placeholder="Nomes dos evangelizadores"
              required
              className="profile-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              placeholder="Notas sobre a atividade..."
              rows={3}
              className="profile-form-input"
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar
            </button>
            <Link href="/admin/atendimento/evangelhos-lar" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoPage;
