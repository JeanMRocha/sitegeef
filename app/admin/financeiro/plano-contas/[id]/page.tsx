import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getContaById, updateConta, toggleContaStatus } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Conta - Admin GEEF',
};

type ContaPageParams = {
  id: string;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateConta(id, {
      codigo: formData.get('codigo') as string,
      nome: formData.get('nome') as string,
      tipo: formData.get('tipo') as string,
    });

    redirect(buildFlashNoticeUrl(`/admin/financeiro/plano-contas/${id}`, { variant: 'success', message: 'Conta salva.' }));
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/plano-contas/${id}`, { variant: 'error', message: 'Não foi possível salvar a conta.' }));
    return;
  }
}

async function handleToggle(id: string, ativo: boolean) {
  'use server';

  try {
    await toggleContaStatus(id, ativo);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/plano-contas/${id}`, { variant: 'success', message: 'Status da conta atualizado.' }));
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/plano-contas/${id}`, { variant: 'error', message: 'Não foi possível alterar o status.' }));
    return;
  }
}

async function ContaContent({ id }: { id: string }) {
  const conta = await getContaById(id);
  const tipos = ['receita', 'despesa', 'ativo', 'passivo'];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{conta.nome}</h1>
          <p className="admin-page-subtitle">Código: {conta.codigo}</p>
        </div>
        <form action={() => handleToggle(id, conta.status === 'ativo')}>
          <button
            type="submit"
            className={`admin-btn status-toggle-btn ${conta.status === 'ativo' ? 'status-toggle-btn--active' : 'status-toggle-btn--inactive'}`}
          >
            {conta.status === 'ativo' ? '🗑️ Inativar' : '✓ Ativar'}
          </button>
        </form>
      </div>

      <div className="admin-card form-panel-centered">
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Código *</label>
            <input
              type="text"
              name="codigo"
              defaultValue={conta.codigo}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={conta.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Tipo *</label>
            <select name="tipo" defaultValue={conta.tipo} required>
              <option value="">— Selecione —</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/financeiro/plano-contas" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function ContaPage({ params }: { params: Promise<ContaPageParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <ContaContent id={resolvedParams.id} />
    </Suspense>
  );
}
