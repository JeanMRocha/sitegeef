import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createTemaDoutrinario } from '../../actions';

export const metadata = {
  title: 'Novo Tema Doutrinário - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const tema = await createTemaDoutrinario({
      titulo: formData.get('titulo') as string,
      categoria: formData.get('categoria') as string,
    });

    redirect(`/admin/funcoes/temas/${tema.id}`);
  } catch (error) {
    console.error('Erro ao criar tema:', error);
    return;
  }
}

export default function NovoTemaPage() {
  const categorias = ['palestra', 'evangelizacao', 'estudo', 'outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Tema Doutrinário</h1>
          <p className="admin-page-subtitle">Crie um novo tema para palestras, evangelização ou estudos</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Título do Tema *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: O Evangelho Segundo o Espiritismo"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Categoria *</label>
            <select
              name="categoria"
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
              ✅ Criar Tema
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
