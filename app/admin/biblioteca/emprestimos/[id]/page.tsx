import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getEmprestimoById, updateEmprestimo, devolverEmprestimo } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Detalhes do Empréstimo - Admin GEEF',
};

type EmprestimoDetalhe = {
  id: string;
  data_retirada: string;
  prazo_devolucao: string;
  data_devolucao?: string | null;
  observacao?: string | null;
  pessoas?: {
    nome?: string | null;
    email?: string | null;
  } | null;
  exemplares?: {
    codigo?: string | null;
    obra?: {
      titulo?: string | null;
    } | null;
  } | null;
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateEmprestimo(id, {
      prazo_devolucao: (formData.get('prazo_devolucao') as string) || undefined,
      observacao: (formData.get('observacao') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/biblioteca/emprestimos/${id}`, { variant: 'success', message: 'Empréstimo salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/emprestimos/${id}`, { variant: 'error', message: 'Não foi possível salvar o empréstimo.' }));
    return;
  }
}

async function handleDevolver(id: string) {
  'use server';

  try {
    await devolverEmprestimo(id);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/emprestimos', { variant: 'success', message: 'Devolução registrada.' }));
  } catch (error) {
    console.error('Erro ao devolver exemplar:', error);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/emprestimos/${id}`, { variant: 'error', message: 'Não foi possível registrar a devolução.' }));
    return;
  }
}

async function EmprestimoContent({ id }: { id: string }) {
  const emprestimo = (await getEmprestimoById(id)) as EmprestimoDetalhe | null;
  if (!emprestimo) {
    notFound();
  }
  const today = new Date().toISOString().split('T')[0];
  const vencido = emprestimo.prazo_devolucao < today;

  const diasAtraso = vencido
    ? Math.floor((new Date(today).getTime() - new Date(emprestimo.prazo_devolucao).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Empréstimo</h1>
          <p className="admin-page-subtitle">{emprestimo.exemplares?.obra?.titulo}</p>
        </div>
        <form action={() => handleDevolver(id)}>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            onClick={(e) => {
              if (!confirm('Confirmar devolução do exemplar?')) {
                e.preventDefault();
              }
            }}
          >
            📥 Registrar Devolução
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className={`admin-card panel-accent-card ${vencido ? 'content-surface-note-danger' : ''}`}>
        <div className="area-panel-grid grid-auto-220 align-start">
          <div>
            <p className="text-xs-muted">Pessoa</p>
            <p className="text-sm-500">
              {emprestimo.pessoas?.nome}
            </p>
          </div>
          <div>
            <p className="text-xs-muted">Código</p>
            <p className="text-sm-500">
              {emprestimo.exemplares?.codigo}
            </p>
          </div>
          <div>
            <p className="text-xs-muted">Status</p>
            <p>
              <span className={vencido ? 'inline-status inline-status-danger' : 'inline-status inline-status-warning'}>
                {vencido ? 'Vencido' : 'Em aberto'}
              </span>
            </p>
          </div>
          {vencido && (
            <div>
              <p className="text-xs-muted">Dias Atraso</p>
              <p className="text-sm-500 text-danger">
                {diasAtraso} dias
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Datas */}
      <div className="admin-card form-panel-centered-sm">
        <h2 className="form-card-title">Datas</h2>

        <div className="area-panel-grid grid-auto-220">
          <div>
            <p className="text-xs-muted">Retirada</p>
            <p className="text-sm-500">
              {new Date(emprestimo.data_retirada + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs-muted">Prazo Devolução</p>
            <p className={vencido ? 'text-sm-500 text-danger' : 'text-sm-500'}>
              {new Date(emprestimo.prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="admin-card form-panel-centered-sm">
        <h2 className="form-card-title">Editar Empréstimo</h2>

        <form action={(formData) => handleUpdate(id, formData)}>
          <LgpdFormNotice text="Usamos estes dados para controlar a devolução e o histórico do empréstimo." />
          <div className="admin-form-group">
            <label>Novo Prazo de Devolução</label>
            <input
              type="date"
              name="prazo_devolucao"
              defaultValue={emprestimo.prazo_devolucao}
            />
          </div>

          <div className="admin-form-group">
            <label>Observação</label>
            <textarea
              name="observacao"
              rows={3}
              defaultValue={emprestimo.observacao || ''}
              placeholder="Ex: Renovação de prazo, motivo atraso, etc."
              className="profile-input"
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/biblioteca/emprestimos" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

type EmprestimoParams = {
  id: string;
};

export default async function EmprestimoPage({ params }: { params: Promise<EmprestimoParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EmprestimoContent id={resolvedParams.id} />
    </Suspense>
  );
}
