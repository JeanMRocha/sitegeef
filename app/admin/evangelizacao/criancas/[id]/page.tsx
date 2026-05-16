import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCriancaById, updateCrianca, deleteCrianca, getTurmas } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Criança - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCrianca(id, {
      turma_id: formData.get('turma_id') as string,
      restricoes: (formData.get('restricoes') as string) || undefined,
      autorizacoes: (formData.get('autorizacoes') as string) || undefined,
      status: formData.get('status') as string,
    });

    redirect(`/admin/evangelizacao/criancas/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteCrianca(id);
    redirect('/admin/evangelizacao/criancas');
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function CriancaContent({ id }: { id: string }) {
  const crianca = await getCriancaById(id);
  const turmas = await getTurmas();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{crianca.pessoa?.nome}</h1>
          <p className="admin-page-subtitle">Responsável: {crianca.responsavel?.nome}</p>
        </div>
        <form action={() => handleDelete(id)} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            onClick={(e) => {
              if (!confirm('Deletar?')) e.preventDefault();
            }}
          >
            ✕ Deletar
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Turma *</label>
            <select
              name="turma_id"
              defaultValue={crianca.turma?.id}
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
              {turmas.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Restrições</label>
            <textarea
              name="restricoes"
              defaultValue={crianca.restricoes || ''}
              rows={2}
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
            <label>Autorizações</label>
            <textarea
              name="autorizacoes"
              defaultValue={crianca.autorizacoes || ''}
              rows={2}
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
              defaultValue={crianca.status}
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
              <option value="inativa">Inativa</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/evangelizacao/criancas" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CriancaPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CriancaContent id={params.id} />
    </Suspense>
  );
}
