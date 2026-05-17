import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getEmprestimoById, updateEmprestimo, devolverEmprestimo } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Detalhes do Empréstimo - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateEmprestimo(id, {
      prazo_devolucao: (formData.get('prazo_devolucao') as string) || undefined,
      observacao: (formData.get('observacao') as string) || undefined,
    });

    redirect(`/admin/biblioteca/emprestimos/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error);
    return;
  }
}

async function handleDevolver(id: string) {
  'use server';

  try {
    await devolverEmprestimo(id);
    redirect('/admin/biblioteca/emprestimos');
  } catch (error) {
    console.error('Erro ao devolver exemplar:', error);
    return;
  }
}

async function EmprestimoContent({ id }: { id: string }) {
  const emprestimo = await getEmprestimoById(id);
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
        <form action={() => handleDevolver(id)} style={{ display: 'inline' }}>
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
      <div className="admin-card" style={{
        marginBottom: '2rem',
        backgroundColor: vencido ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)',
        borderLeft: `4px solid ${vencido ? '#ef4444' : 'var(--primary)'}`
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Pessoa</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
              {emprestimo.pessoas?.nome}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Código</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
              {emprestimo.exemplares?.codigo}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</p>
            <p style={{ margin: '0.5rem 0' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.35rem 0.7rem',
                backgroundColor: vencido ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 146, 60, 0.1)',
                color: vencido ? '#ef4444' : '#f97316',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
              }}>
                {vencido ? 'Vencido' : 'Em aberto'}
              </span>
            </p>
          </div>
          {vencido && (
            <div>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Dias Atraso</p>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#ef4444' }}>
                {diasAtraso} dias
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Datas */}
      <div className="admin-card" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Datas</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Retirada</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
              {new Date(emprestimo.data_retirada + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Prazo Devolução</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500, color: vencido ? '#ef4444' : 'var(--text)' }}>
              {new Date(emprestimo.prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Editar Empréstimo</h2>

        <form action={(formData) => handleUpdate(id, formData)}>
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
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
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

export default async function EmprestimoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EmprestimoContent id={resolvedParams.id} />
    </Suspense>
  );
}
