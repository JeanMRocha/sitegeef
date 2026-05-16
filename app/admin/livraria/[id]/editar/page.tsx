import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getProdutoById, updateProduto } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Produto - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateProduto(id, {
      titulo: formData.get('titulo') as string,
      autor: (formData.get('autor') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
      capa_url: (formData.get('capa_url') as string) || undefined,
      qtd_estoque: parseInt((formData.get('qtd_estoque') as string) || '0'),
      estoque_minimo: parseInt((formData.get('estoque_minimo') as string) || '2'),
      valor_custo: formData.get('valor_custo') ? parseFloat((formData.get('valor_custo') as string)) : undefined,
      valor_venda: formData.get('valor_venda') ? parseFloat((formData.get('valor_venda') as string)) : undefined,
    });

    redirect(`/admin/livraria/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

async function EditarContent({ id }: { id: string }) {
  const produto = await getProdutoById(id);
  const categorias = ['Espiritismo', 'Religião', 'Filosofia', 'Autoajuda', 'Infantil', 'Juventude', 'Ficção', 'Outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Produto</h1>
          <p className="admin-page-subtitle">{produto.titulo}</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ex: O Evangelho Segundo o Espiritismo"
              defaultValue={produto.titulo}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Autor</label>
              <input
                type="text"
                name="autor"
                placeholder="Ex: Allan Kardec"
                defaultValue={produto.autor || ''}
              />
            </div>
            <div className="admin-form-group">
              <label>Categoria</label>
              <select
                name="categoria"
                defaultValue={produto.categoria || ''}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Quantidade em Estoque</label>
              <input
                type="number"
                name="qtd_estoque"
                defaultValue={produto.qtd_estoque}
                min="0"
              />
            </div>
            <div className="admin-form-group">
              <label>Estoque Mínimo</label>
              <input
                type="number"
                name="estoque_minimo"
                defaultValue={produto.estoque_minimo}
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Valor de Custo (R$)</label>
              <input
                type="number"
                name="valor_custo"
                placeholder="0.00"
                defaultValue={produto.valor_custo || ''}
                step="0.01"
                min="0"
              />
            </div>
            <div className="admin-form-group">
              <label>Valor de Venda (R$)</label>
              <input
                type="number"
                name="valor_venda"
                placeholder="0.00"
                defaultValue={produto.valor_venda || ''}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>URL da Capa</label>
            <input
              type="url"
              name="capa_url"
              placeholder="https://..."
              defaultValue={produto.capa_url || ''}
            />
          </div>

          {produto.capa_url && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Prévia</p>
              <img
                src={produto.capa_url}
                alt={produto.titulo}
                style={{ maxWidth: '200px', borderRadius: '0.4rem', marginTop: '0.5rem' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href={`/admin/livraria/${id}`} className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function EditarProdutoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditarContent id={resolvedParams.id} />
    </Suspense>
  );
}
