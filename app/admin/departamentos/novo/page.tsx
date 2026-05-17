import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createDepartamento, getPessoasDisponiveis } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Departamento - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const dept = await createDepartamento({
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      coordenador_id: (formData.get('coordenador_id') as string) || undefined,
      vice_id: (formData.get('vice_id') as string) || undefined,
    });

    if (!dept) {
      return;
    }

    redirect(buildFlashNoticeUrl(`/admin/departamentos/${dept.id}`, { variant: 'success', message: 'Departamento criado.' }));
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    redirect(buildFlashNoticeUrl('/admin/departamentos', { variant: 'error', message: 'Não foi possível criar o departamento.' }));
    return;
  }
}

export default async function NovoDepartamentoPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Departamento</h1>
          <p className="admin-page-subtitle">Crie uma nova área funcional do GEEF</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input type="text" name="nome" required />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              rows={4}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Coordenador</label>
              <select
                name="coordenador_id"
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
              <label>Vice-Coordenador</label>
              <select
                name="vice_id"
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
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Departamento
            </button>
            <Link href="/admin/departamentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
