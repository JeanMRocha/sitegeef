import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCampanhaById, updateCampanha } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Campanha - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCampanha(id, {
      nome: (formData.get('nome') as string) || undefined,
      descricao: (formData.get('descricao') as string) || undefined,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
      meta: (formData.get('meta') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(`/admin/apse/campanhas/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function CampanhaContent({ id }: { id: string }) {
  const campanha = await getCampanhaById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{campanha.nome}</h1>
          <p className="admin-page-subtitle">
            {campanha.data_inicio ? new Date(campanha.data_inicio).toLocaleDateString('pt-BR') : 'Data não definida'} a {campanha.data_fim ? new Date(campanha.data_fim).toLocaleDateString('pt-BR') : 'Data não definida'}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Campanha</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={campanha.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              defaultValue={campanha.descricao || ''}
              placeholder="Objetivo e detalhes..."
              rows={3}
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
              <label>Data de Início</label>
              <input
                type="date"
                name="data_inicio"
                defaultValue={campanha.data_inicio ? new Date(campanha.data_inicio).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="admin-form-group">
              <label>Data de Término</label>
              <input
                type="date"
                name="data_fim"
                defaultValue={campanha.data_fim ? new Date(campanha.data_fim).toISOString().split('T')[0] : ''}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Meta</label>
            <input
              type="text"
              name="meta"
              defaultValue={campanha.meta || ''}
              placeholder="Ex: 100 famílias..."
            />
          </div>

          <div className="admin-form-group">
            <label>Status</label>
            <select
              name="status"
              defaultValue={campanha.status || 'planejada'}
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
              <option value="em_execucao">▶ Em execução</option>
              <option value="concluida">✓ Concluída</option>
              <option value="cancelada">✕ Cancelada</option>
            </select>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function CampanhaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CampanhaContent id={id} />
    </Suspense>
  );
}
