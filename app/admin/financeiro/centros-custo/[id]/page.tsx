import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCentroCustoById, updateCentroCusto, toggleCentroCustoStatus } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Centro de Custo - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCentroCusto(id, {
      nome: formData.get('nome') as string,
    });

    redirect(buildFlashNoticeUrl(`/admin/financeiro/centros-custo/${id}`, { variant: 'success', message: 'Centro de custo salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar centro:', error);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/centros-custo/${id}`, { variant: 'error', message: 'Não foi possível salvar o centro de custo.' }));
    return;
  }
}

async function handleToggle(id: string, ativo: boolean) {
  'use server';

  try {
    await toggleCentroCustoStatus(id, ativo);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/centros-custo/${id}`, { variant: 'success', message: 'Status do centro atualizado.' }));
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    redirect(buildFlashNoticeUrl(`/admin/financeiro/centros-custo/${id}`, { variant: 'error', message: 'Não foi possível alterar o status.' }));
    return;
  }
}

async function CentroContent({ id }: { id: string }) {
  const centro = await getCentroCustoById(id);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{centro.nome}</h1>
          <p className="admin-page-subtitle">Centro de Custo</p>
        </div>
        <form action={() => handleToggle(id, centro.ativo)} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: centro.ativo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: centro.ativo ? '#ef4444' : '#22c55e',
              border: centro.ativo ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            {centro.ativo ? '🗑️ Inativar' : '✓ Ativar'}
          </button>
        </form>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={centro.nome}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/financeiro/centros-custo" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function CentroPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CentroContent id={resolvedParams.id} />
    </Suspense>
  );
}
