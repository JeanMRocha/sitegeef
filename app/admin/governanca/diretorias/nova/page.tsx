import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createDiretoria } from '../../actions';

export const metadata = {
  title: 'Nova Diretoria - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const diretoria = await createDiretoria({
      nome: formData.get('nome') as string,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
    });

    redirect(`/admin/governanca/diretorias/${diretoria.id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

export default function NovaDiretoriaPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Diretoria</h1>
          <p className="admin-page-subtitle">Criar uma nova gestão/mandato</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome da Diretoria *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Diretoria 2024-2026, Gestão XXV, etc..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Diretoria
            </button>
            <Link href="/admin/governanca/diretorias" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
