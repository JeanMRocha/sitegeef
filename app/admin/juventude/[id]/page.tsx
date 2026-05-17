import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getGrupoById, updateGrupo, toggleGrupoStatus, getPessoasDisponiveis } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Grupo - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateGrupo(id, {
      nome: formData.get('nome') as string,
      coordenador_id: formData.get('coordenador_id') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      status: formData.get('status') as string,
    });

    redirect(`/admin/juventude/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function handleToggle(id: string, ativo: boolean) {
  'use server';

  try {
    await toggleGrupoStatus(id, ativo);
    redirect(`/admin/juventude/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function GrupoContent({ id }: { id: string }) {
  const grupo = await getGrupoById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{grupo.nome}</h1>
          <p className="admin-page-subtitle">Coordenador: {grupo.coordenador?.nome}</p>
        </div>
        <form action={() => handleToggle(id, grupo.status === 'ativo')} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: grupo.status === 'ativo' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: grupo.status === 'ativo' ? '#ef4444' : '#22c55e',
              border: grupo.status === 'ativo' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            {grupo.status === 'ativo' ? '🗑️ Inativar' : '✓ Ativar'}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome do Grupo *</label>
            <input
              type="text"
              name="nome"
              defaultValue={grupo.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Coordenador *</label>
            <select
              name="coordenador_id"
              defaultValue={grupo.coordenador?.id}
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
            <label>Descrição</label>
            <textarea
              name="descricao"
              defaultValue={grupo.descricao || ''}
              rows={3}
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
            <label>Status *</label>
            <select
              name="status"
              defaultValue={grupo.status}
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
              <option value="ativo">✓ Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/juventude" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function GrupoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <GrupoContent id={resolvedParams.id} />
    </Suspense>
  );
}
