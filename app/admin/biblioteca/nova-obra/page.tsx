import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createObra } from '../actions';

export const metadata = {
  title: 'Nova Obra - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const obra = await createObra({
      titulo: formData.get('titulo') as string,
      autor: (formData.get('autor') as string) || undefined,
      editora: (formData.get('editora') as string) || undefined,
      isbn: (formData.get('isbn') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
      sinopse: (formData.get('sinopse') as string) || undefined,
      capa_url: (formData.get('capa_url') as string) || undefined,
      publico: (formData.get('publico') as string) || 'adulto',
    });

    redirect(`/admin/biblioteca/${obra.id}`);
  } catch (error) {
    console.error('Erro ao criar obra:', error);
    return;
  }
}

export default function NovaObraPage() {
  const categorias = ['Espiritismo', 'Religião', 'Filosofia', 'Autoajuda', 'Infantil', 'Juventude', 'Ficção', 'Outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Obra</h1>
          <p className="admin-page-subtitle">Adicione um novo livro ao acervo</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: O Evangelho Segundo o Espiritismo"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Autor</label>
              <input type="text" name="autor" placeholder="Ex: Allan Kardec" />
            </div>
            <div className="admin-form-group">
              <label>Editora</label>
              <input type="text" name="editora" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>ISBN</label>
              <input type="text" name="isbn" placeholder="978-..." />
            </div>
            <div className="admin-form-group">
              <label>Categoria</label>
              <select
                name="categoria"
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
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Público Alvo</label>
            <select
              name="publico"
              defaultValue="adulto"
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="adulto">Adulto</option>
              <option value="jovem">Jovem</option>
              <option value="infantil">Infantil</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Sinopse</label>
            <textarea
              name="sinopse"
              rows={4}
              placeholder="Descrição do livro..."
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
            <label>URL da Capa</label>
            <input
              type="url"
              name="capa_url"
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Obra
            </button>
            <Link href="/admin/biblioteca" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
