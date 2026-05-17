import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getIrradiacaoById, updateIrradiacao, toggleIrradiacaoStatus, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Irradiação - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateIrradiacao(id, {
      nome_irradiacao: formData.get('nome_irradiacao') as string,
      motivo: formData.get('motivo') as string,
      periodo: formData.get('periodo') as string,
      confidencial: formData.get('confidencial') === 'on',
      status: formData.get('status') as string,
    });

    redirect(`/admin/atendimento/irradiacao/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function handleToggle(id: string, ativa: boolean) {
  'use server';

  try {
    await toggleIrradiacaoStatus(id, ativa);
    redirect(`/admin/atendimento/irradiacao/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function Content({ id }: { id: string }) {
  const irr = await getIrradiacaoById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{irr.nome_irradiacao}</h1>
          <p className="admin-page-subtitle">{irr.pessoas?.nome}</p>
        </div>
        <form action={() => handleToggle(id, irr.status === 'ativa')} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: irr.status === 'ativa' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: irr.status === 'ativa' ? '#ef4444' : '#22c55e',
              border: irr.status === 'ativa' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            {irr.status === 'ativa' ? '🔒 Encerrar' : '✓ Reativar'}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome da Irradiação *</label>
            <input
              type="text"
              name="nome_irradiacao"
              defaultValue={irr.nome_irradiacao}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Motivo *</label>
            <textarea
              name="motivo"
              defaultValue={irr.motivo}
              rows={3}
              required
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

          <div className="admin-form-group">
            <label>Período *</label>
            <input
              type="text"
              name="periodo"
              defaultValue={irr.periodo}
              required
            />
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(249, 115, 22, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}>
            <input
              type="checkbox"
              name="confidencial"
              id="confidencial"
              defaultChecked={irr.confidencial}
              style={{ marginTop: '0.3rem' }}
            />
            <label htmlFor="confidencial" style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              🔒 Marcar como confidencial
            </label>
          </div>

          <div className="admin-form-group">
            <label>Status *</label>
            <select
              name="status"
              defaultValue={irr.status}
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
              <option value="ativa">✓ Ativa</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/atendimento/irradiacao" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <Content id={resolvedParams.id} />
    </Suspense>
  );
}
