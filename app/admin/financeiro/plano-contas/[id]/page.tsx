import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getContaById, updateConta, toggleContaStatus } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Conta - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateConta(id, {
      codigo: formData.get('codigo') as string,
      nome: formData.get('nome') as string,
      tipo: formData.get('tipo') as string,
    });

    redirect(`/admin/financeiro/plano-contas/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    throw error;
  }
}

async function handleToggle(id: string, ativo: boolean) {
  'use server';

  try {
    await toggleContaStatus(id, ativo);
    redirect(`/admin/financeiro/plano-contas/${id}`);
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    throw error;
  }
}

async function ContaContent({ id }: { id: string }) {
  const conta = await getContaById(id);
  const tipos = ['receita', 'despesa', 'ativo', 'passivo'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{conta.nome}</h1>
          <p className="admin-page-subtitle">Código: {conta.codigo}</p>
        </div>
        <form action={() => handleToggle(id, conta.status === 'ativo')} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: conta.status === 'ativo' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: conta.status === 'ativo' ? '#ef4444' : '#22c55e',
              border: conta.status === 'ativo' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            {conta.status === 'ativo' ? '🗑️ Inativar' : '✓ Ativar'}
          </button>
        </form>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
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
            <select
              name="tipo"
              defaultValue={conta.tipo}
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
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
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

export default async function ContaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ContaContent id={resolvedParams.id} />
    </Suspense>
  );
}
