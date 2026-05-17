import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMetaById, updateMeta, deleteMeta, getPessoasDisponiveis } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Meta - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateMeta(id, {
      diretriz: (formData.get('diretriz') as string) || undefined,
      objetivo: (formData.get('objetivo') as string) || undefined,
      meta: (formData.get('meta') as string) || undefined,
      acao: (formData.get('acao') as string) || undefined,
      responsavel_id: (formData.get('responsavel_id') as string) || undefined,
      prazo: (formData.get('prazo') as string) || undefined,
      indicador: (formData.get('indicador') as string) || undefined,
      andamento: formData.get('andamento') ? parseInt(formData.get('andamento') as string) : undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/planejamento/${id}`, { variant: 'success', message: 'Meta salva.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/planejamento/${id}`, { variant: 'error', message: 'Não foi possível salvar a meta.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteMeta(id);
    redirect(buildFlashNoticeUrl('/admin/planejamento', { variant: 'success', message: 'Meta excluída.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/planejamento/${id}`, { variant: 'error', message: 'Não foi possível excluir a meta.' }));
    return;
  }
}

async function MetaContent({ id }: { id: string }) {
  const meta = await getMetaById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{meta.objetivo}</h1>
          <p className="admin-page-subtitle">Responsável: {meta.responsavel?.nome || 'Não definido'}</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Meta</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Diretriz</label>
            <input
              type="text"
              name="diretriz"
              defaultValue={meta.diretriz || ''}
              placeholder="Ex: Expansão do atendimento espiritual"
            />
          </div>

          <div className="admin-form-group">
            <label>Objetivo *</label>
            <textarea
              name="objetivo"
              defaultValue={meta.objetivo}
              required
              rows={2}
              style={{
                width: '100%',
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
            <label>Meta</label>
            <textarea
              name="meta"
              defaultValue={meta.meta || ''}
              rows={2}
              style={{
                width: '100%',
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
            <label>Ação</label>
            <textarea
              name="acao"
              defaultValue={meta.acao || ''}
              rows={2}
              style={{
                width: '100%',
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Responsável</label>
              <select
                name="responsavel_id"
                defaultValue={meta.responsavel_id || ''}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione um responsável</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Prazo</label>
              <input
                type="date"
                name="prazo"
                defaultValue={meta.prazo ? new Date(meta.prazo).toISOString().split('T')[0] : ''}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Indicador</label>
            <input
              type="text"
              name="indicador"
              defaultValue={meta.indicador || ''}
              placeholder="Ex: Aumentar participação em 20%..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Andamento (%)</label>
              <input
                type="number"
                name="andamento"
                defaultValue={meta.andamento || '0'}
                min="0"
                max="100"
                step="5"
              />
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                name="status"
                defaultValue={meta.status || 'planejada'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="planejada">📋 Planejada</option>
                <option value="em_execucao">▶ Em Execução</option>
                <option value="atrasada">⚠️ Atrasada</option>
                <option value="concluida">✓ Concluída</option>
                <option value="cancelada">✕ Cancelada</option>
                <option value="suspensa">⏸️ Suspensa</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#3b82f6', width: `${meta.andamento || 0}%` }} />
              </div>
              <span style={{ fontWeight: 700, minWidth: '50px' }}>{meta.andamento || 0}%</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Progresso da meta</p>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '2rem' }}>
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#ef4444' }}>Zona de Perigo</h2>
        <form action={() => handleDelete(id)}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Excluir esta meta permanentemente.
          </p>
          <button type="submit" className="admin-btn" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
            🗑️ Excluir Meta
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function MetaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <MetaContent id={resolvedParams.id} />
    </Suspense>
  );
}
