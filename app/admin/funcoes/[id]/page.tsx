import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getFuncaoById, updateFuncao, toggleFuncaoStatus } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Função - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateFuncao(id, {
      nome: (formData.get('nome') as string) || undefined,
      descricao: (formData.get('descricao') as string) || undefined,
    });

    redirect(`/admin/funcoes/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar função:', error);
    throw error;
  }
}

async function handleToggleStatus(id: string, novoStatus: boolean) {
  'use server';

  try {
    await toggleFuncaoStatus(id, novoStatus);
    redirect(`/admin/funcoes/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}

async function EditFuncaoContent({ id }: { id: string }) {
  const funcao = await getFuncaoById(id);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Função</h1>
          <p className="admin-page-subtitle">{funcao.nome}</p>
        </div>
        <form action={() => handleToggleStatus(id, !funcao.ativo)}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: funcao.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              color: funcao.ativo ? '#22c55e' : '#6b7280',
              border: `1px solid ${funcao.ativo ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
            }}
          >
            {funcao.ativo ? '✓ Ativa' : '○ Inativa'}
          </button>
        </form>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Nome da Função *</label>
            <input
              type="text"
              name="nome"
              defaultValue={funcao.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              rows={4}
              defaultValue={funcao.descricao || ''}
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
            <Link href="/admin/funcoes" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditFuncaoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditFuncaoContent id={params.id} />
    </Suspense>
  );
}
