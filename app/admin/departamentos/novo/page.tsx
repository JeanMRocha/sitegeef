import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createDepartamento, getPessoasDisponiveis } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Departamento - Admin GEEF',
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const dept = await createDepartamento({
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      coordenador_id: (formData.get('coordenador_id') as string) || undefined,
      vice_id: (formData.get('vice_id') as string) || undefined,
    });

    if (!dept) {
      return;
    }

    redirect(buildFlashNoticeUrl(`/admin/departamentos/${dept.id}`, { variant: 'success', message: 'Departamento criado.' }));
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    redirect(buildFlashNoticeUrl('/admin/departamentos', { variant: 'error', message: 'Não foi possível criar o departamento.' }));
    return;
  }
}

export default async function NovoDepartamentoPage() {
  const pessoas = (await getPessoasDisponiveis()) as PessoaDisponivel[];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Departamento</h1>
          <p className="admin-page-subtitle">Crie uma nova área funcional do GEEF</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered">
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input type="text" name="nome" required />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea name="descricao" rows={4} />
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Coordenador</label>
              <select name="coordenador_id">
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Vice-Coordenador</label>
              <select name="vice_id">
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Departamento
            </button>
            <Link href="/admin/departamentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
