import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getEvangelhoNoLarById, updateEvangelhoNoLar, deleteEvangelhoNoLar, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Evangelho no Lar - Admin GEEF',
};

type EvangelhoDetalhe = {
  id: string;
  endereco?: string | null;
  data: string;
  situacao?: string | null;
  equipe?: string | null;
  observacoes?: string | null;
  pessoas?: { id?: string | null; nome?: string | null } | null;
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

type EvangelhoParams = {
  id: string;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateEvangelhoNoLar(id, {
      pessoa_id: formData.get('pessoa_id') as string,
      endereco: formData.get('endereco') as string,
      equipe: formData.get('equipe') as string,
      data: formData.get('data') as string,
      situacao: formData.get('situacao') as string,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/evangelhos-lar/${id}`, { variant: 'success', message: 'Evangelho no Lar salvo.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/evangelhos-lar/${id}`, { variant: 'error', message: 'Não foi possível salvar o Evangelho no Lar.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteEvangelhoNoLar(id);
    redirect(buildFlashNoticeUrl('/admin/atendimento/evangelhos-lar', { variant: 'success', message: 'Evangelho no Lar removido.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/evangelhos-lar', { variant: 'error', message: 'Não foi possível remover o Evangelho no Lar.' }));
    return;
  }
}

async function Content({ id }: { id: string }) {
  const ev = (await getEvangelhoNoLarById(id)) as EvangelhoDetalhe;
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{ev.endereco}</h1>
          <p className="admin-page-subtitle">{ev.pessoas?.nome}</p>
        </div>
        <form action={() => handleDelete(id)} className="inline-form">
          <button
            type="submit"
            className="admin-btn admin-btn-secondary admin-btn-danger"
            onClick={(e) => {
              if (!confirm('Deletar?')) e.preventDefault();
            }}
          >
            ✕ Deletar
          </button>
        </form>
      </div>

      <div className="admin-card form-panel-centered">
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
              defaultValue={ev.pessoas?.id || ''}
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
            <label>Endereço *</label>
            <input
              type="text"
              name="endereco"
              defaultValue={ev.endereco || ''}
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
                defaultValue={ev.data}
                required
                className="profile-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Situação *</label>
              <select
                name="situacao"
                defaultValue={ev.situacao || ''}
                required
                className="profile-form-input"
              >
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
              defaultValue={ev.equipe || ''}
              required
              className="profile-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              defaultValue={ev.observacoes || ''}
              rows={3}
              className="profile-form-input"
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/atendimento/evangelhos-lar" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<EvangelhoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <Content id={resolvedParams.id} />
    </Suspense>
  );
}
