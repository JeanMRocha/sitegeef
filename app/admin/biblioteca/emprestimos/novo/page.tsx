import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createEmprestimo, getPessoasDisponiveis, getExemplaresdisponveisParaEmprestimo } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Empréstimo - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const emprestimo = await createEmprestimo({
      exemplar_id: formData.get('exemplar_id') as string,
      pessoa_id: formData.get('pessoa_id') as string,
      data_retirada: (formData.get('data_retirada') as string) || undefined,
      prazo_devolucao: formData.get('prazo_devolucao') as string,
    });

    redirect(buildFlashNoticeUrl(`/admin/biblioteca/emprestimos/${emprestimo.id}`, { variant: 'success', message: 'Empréstimo criado.' }));
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/emprestimos', { variant: 'error', message: 'Não foi possível criar o empréstimo.' }));
    return;
  }
}

export default async function NovoEmprestimoPage() {
  const pessoas = await getPessoasDisponiveis();
  const exemplares = await getExemplaresdisponveisParaEmprestimo();

  // Calculate default return date (14 days from today)
  const today = new Date();
  const returnDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const defaultReturnDate = returnDate.toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Empréstimo</h1>
          <p className="admin-page-subtitle">Registre um novo empréstimo de exemplar</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <LgpdFormNotice text="Usamos os dados para registrar o empréstimo e manter o controle de devolução." />
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
              required
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="">— Selecione —</option>
              {pessoas.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Exemplar Disponível *</label>
            <select
              name="exemplar_id"
              required
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="">— Selecione —</option>
              {exemplares.map((e: any) => (
                <option key={e.id} value={e.id}>
                  {e.obra?.titulo} ({e.codigo})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Data de Retirada</label>
            <input
              type="date"
              name="data_retirada"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="admin-form-group">
            <label>Prazo de Devolução *</label>
            <input
              type="date"
              name="prazo_devolucao"
              defaultValue={defaultReturnDate}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Empréstimo
            </button>
            <Link href="/admin/biblioteca/emprestimos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
