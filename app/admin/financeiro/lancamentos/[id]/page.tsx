import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMovimentoById, updateMovimento, deleteMovimento, getPlanoContas, getCentrosCusto } from '../../actions';
import { getPessoas } from '../../../pessoas/actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Lançamento - Admin GEEF',
};

type PlanoItem = {
  id: string;
  codigo?: string | null;
  nome?: string | null;
};

type CentroItem = {
  id: string;
  nome?: string | null;
};

type PessoaItem = {
  id: string;
  nome?: string | null;
};

type MovimentoDetalhe = {
  id: string;
  tipo: 'entrada' | 'saida';
  conta_id?: string | null;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  comprovante_url?: string | null;
  plano_contas?: { id?: string | null; codigo?: string | null; nome?: string | null } | null;
  centros_custo?: { id?: string | null; nome?: string | null } | null;
  pessoas?: { id?: string | null; nome?: string | null } | null;
};

type FinanceParams = {
  id: string;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateMovimento(id, {
      tipo: formData.get('tipo') as string,
      conta_id: formData.get('conta_id') as string,
      categoria: formData.get('categoria') as string,
      descricao: formData.get('descricao') as string,
      valor: parseFloat(formData.get('valor') as string),
      data: formData.get('data') as string,
      centro_custo_id: (formData.get('centro_custo_id') as string) || undefined,
      pessoa_id: (formData.get('pessoa_id') as string) || undefined,
      comprovante_url: (formData.get('comprovante_url') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/financeiro/lancamentos/${id}`, { variant: 'success', message: 'Lançamento salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/lancamentos/${id}`, { variant: 'error', message: 'Não foi possível salvar o lançamento.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteMovimento(id);
    redirect(buildFlashNoticeUrl('/admin/financeiro/lancamentos', { variant: 'success', message: 'Lançamento removido.' }));
  } catch (error) {
    console.error('Erro ao deletar lançamento:', error);
    redirect(buildFlashNoticeUrl('/admin/financeiro/lancamentos', { variant: 'error', message: 'Não foi possível remover o lançamento.' }));
    return;
  }
}

async function LancamentoContent({ id }: { id: string }) {
  const movimento = (await getMovimentoById(id)) as MovimentoDetalhe;
  const contas = (await getPlanoContas('ativo')) as PlanoItem[];
  const centros = (await getCentrosCusto(true)) as CentroItem[];
  const { pessoas } = await getPessoas();
  const people = pessoas as PessoaItem[];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Lançamento financeiro</p>
            <h1 className="area-hero-title">{movimento.descricao}</h1>
          </div>
          <div className="tag-list">
            <span className="tag">{movimento.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
            <span className="tag">R$ {movimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <p className="area-subtitle">{new Date(movimento.data).toLocaleDateString('pt-BR')}</p>
        <div className="area-panel-grid">
          <form action={() => handleDelete(id)}>
            <button type="submit" className="profile-form-btn profile-form-btn-secondary text-danger">
              Deletar
            </button>
          </form>
          <Link href="/admin/financeiro/lancamentos" className="profile-form-btn profile-form-btn-secondary">
            Voltar
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Tipo</span>
          <strong>{movimento.tipo === 'entrada' ? 'Entrada' : 'Saída'}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Valor</span>
          <strong className={movimento.tipo === 'entrada' ? 'text-success' : 'text-danger'}>
            {movimento.tipo === 'entrada' ? '+' : '-'} R$ {movimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Conta</span>
          <strong>{movimento.plano_contas?.codigo} - {movimento.plano_contas?.nome}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Editar lançamento</h2>
          <p>Atualize tipo, conta, centro de custo e anexos.</p>
        </div>
        <div className="table-surface form-panel-centered">
          <form action={(formData) => handleSubmit(id, formData)}>
            <div className="module-grid">
              <label className="profile-form-field">
                <span>Tipo *</span>
                <select name="tipo" defaultValue={movimento.tipo} required className="profile-form-input">
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </label>
              <label className="profile-form-field">
                <span>Data *</span>
                <input type="date" name="data" defaultValue={movimento.data} required className="profile-form-input" />
              </label>
              <label className="profile-form-field form-field-full">
                <span>Descrição *</span>
                <input type="text" name="descricao" defaultValue={movimento.descricao} required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Conta contábil *</span>
                <select name="conta_id" defaultValue={movimento.plano_contas?.id || ''} required className="profile-form-input">
                  <option value="">— Selecione —</option>
                  {contas.map((c) => (
                    <option key={c.id} value={c.id}>{c.codigo} - {c.nome}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Valor (R$) *</span>
                <input type="number" name="valor" defaultValue={movimento.valor} step="0.01" min="0" required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Centro de custo</span>
                <select name="centro_custo_id" defaultValue={movimento.centros_custo?.id || ''} className="profile-form-input">
                  <option value="">— Nenhum —</option>
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Pessoa</span>
                <select name="pessoa_id" defaultValue={movimento.pessoas?.id || ''} className="profile-form-input">
                  <option value="">— Nenhuma —</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Categoria *</span>
                <input type="text" name="categoria" defaultValue={movimento.categoria} required className="profile-form-input" />
              </label>
              <label className="profile-form-field form-field-full">
                <span>URL do comprovante</span>
                <input type="url" name="comprovante_url" defaultValue={movimento.comprovante_url || ''} className="profile-form-input" />
              </label>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Salvar alterações</button>
              <Link href="/admin/financeiro/lancamentos" className="profile-form-btn profile-form-btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default async function LancamentoPage({ params }: { params: Promise<FinanceParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <LancamentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
