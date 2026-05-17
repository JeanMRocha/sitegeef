import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTemaDoutrinarioById, updateTemaDoutrinario, toggleTemaDoutrinarioStatus } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Tema Doutrinário - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateTemaDoutrinario(id, {
      titulo: (formData.get('titulo') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
    });

    redirect(`/admin/funcoes/temas/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar tema:', error);
    return;
  }
}

async function handleToggleStatus(id: string, novoStatus: boolean) {
  'use server';

  try {
    await toggleTemaDoutrinarioStatus(id, novoStatus);
    redirect(`/admin/funcoes/temas/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return;
  }
}

async function EditTemaContent({ id }: { id: string }) {
  const tema = await getTemaDoutrinarioById(id);

  const categorias = ['palestra', 'evangelizacao', 'estudo', 'outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Tema</h1>
          <p className="admin-page-subtitle">{tema.titulo}</p>
        </div>
        <form action={() => handleToggleStatus(id, !tema.ativo)}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: tema.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              color: tema.ativo ? '#22c55e' : '#6b7280',
              border: `1px solid ${tema.ativo ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
            }}
          >
            {tema.ativo ? '✓ Ativo' : '○ Inativo'}
          </button>
        </form>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Título do Tema *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={tema.titulo}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Categoria *</label>
            <select
              name="categoria"
              defaultValue={tema.categoria}
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
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/funcoes/temas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function EditTemaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditTemaContent id={resolvedParams.id} />
    </Suspense>
  );
}
