import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createMeta, getPessoasDisponiveis } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Nova Meta - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const meta = await createMeta({
      diretriz: (formData.get('diretriz') as string) || undefined,
      objetivo: formData.get('objetivo') as string,
      meta: (formData.get('meta') as string) || undefined,
      acao: (formData.get('acao') as string) || undefined,
      responsavel_id: (formData.get('responsavel_id') as string) || undefined,
      prazo: (formData.get('prazo') as string) || undefined,
      indicador: (formData.get('indicador') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/planejamento/${meta.id}`, { variant: 'success', message: 'Meta criada.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/planejamento', { variant: 'error', message: 'Não foi possível criar a meta.' }));
    return;
  }
}

export default async function NovaMetaPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Meta</h1>
          <p className="admin-page-subtitle">Criar uma nova meta estratégica</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Diretriz</label>
            <input
              type="text"
              name="diretriz"
              placeholder="Ex: Expansão do atendimento espiritual"
            />
          </div>

          <div className="admin-form-group">
            <label>Objetivo *</label>
            <textarea
              name="objetivo"
              placeholder="Qual é o objetivo dessa meta?..."
              rows={2}
              required
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
            <label>Meta (Descrição)</label>
            <textarea
              name="meta"
              placeholder="Descreva a meta específica..."
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
              placeholder="Qual é a ação necessária para alcançar essa meta?..."
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
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Indicador de Desempenho</label>
            <input
              type="text"
              name="indicador"
              placeholder="Ex: Aumentar participação em 20%, Reduzir tempo de atendimento em 30%..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Meta
            </button>
            <Link href="/admin/planejamento" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
