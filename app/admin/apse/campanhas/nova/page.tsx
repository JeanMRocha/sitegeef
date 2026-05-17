import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createCampanha } from '../../actions';

export const metadata = {
  title: 'Nova Campanha - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const campanha = await createCampanha({
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
      meta: (formData.get('meta') as string) || undefined,
    });

    redirect(`/admin/apse/campanhas/${campanha.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

export default function NovaCampanhaPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Campanha</h1>
          <p className="admin-page-subtitle">Criar uma nova campanha APSE</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome da Campanha *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Cesta Básica Junho, Campanha de Doações..."
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              placeholder="Objetivo e detalhes da campanha..."
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

          <div className="admin-form-group">
            <label>Data de Início</label>
            <input
              type="date"
              name="data_inicio"
            />
          </div>

          <div className="admin-form-group">
            <label>Data de Término</label>
            <input
              type="date"
              name="data_fim"
            />
          </div>

          <div className="admin-form-group">
            <label>Meta</label>
            <input
              type="text"
              name="meta"
              placeholder="Ex: 100 famílias, 500 alimentos..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Campanha
            </button>
            <Link href="/admin/apse/campanhas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
