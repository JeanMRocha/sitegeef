import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createCentroCusto } from '../../actions';

export const metadata = {
  title: 'Novo Centro de Custo - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const centro = await createCentroCusto({
      nome: formData.get('nome') as string,
    });

    redirect(`/admin/financeiro/centros-custo/${centro.id}`);
  } catch (error) {
    console.error('Erro ao criar centro:', error);
    return;
  }
}

export default function NovoCentroPage() {
  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Centro de Custo</h1>
          <p className="admin-page-subtitle">Adicione um departamento ou área de atuação</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Biblioteca"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Centro
            </button>
            <Link href="/admin/financeiro/centros-custo" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
