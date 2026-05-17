import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createProduto } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Produto - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const produto = await createProduto({
      titulo: formData.get('titulo') as string,
      autor: (formData.get('autor') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
      capa_url: (formData.get('capa_url') as string) || undefined,
      qtd_estoque: parseInt((formData.get('qtd_estoque') as string) || '0'),
      estoque_minimo: parseInt((formData.get('estoque_minimo') as string) || '2'),
      valor_custo: parseFloat((formData.get('valor_custo') as string) || '0'),
      valor_venda: parseFloat((formData.get('valor_venda') as string) || '0'),
    });

    redirect(buildFlashNoticeUrl(`/admin/livraria/${produto.id}`, { variant: 'success', message: 'Produto criado.' }));
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    redirect(buildFlashNoticeUrl('/admin/livraria', { variant: 'error', message: 'Não foi possível criar o produto.' }));
    return;
  }
}

export default function NovoProdutoPage() {
  const categorias = ['Espiritismo', 'Religião', 'Filosofia', 'Autoajuda', 'Infantil', 'Juventude', 'Ficção', 'Outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Produto</h1>
          <p className="admin-page-subtitle">Adicione um novo livro/produto ao catálogo</p>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Quantidade em Estoque</label>
              <input
                type="number"
                name="qtd_estoque"
                defaultValue="0"
                min="0"
              />
            </div>
            <div className="admin-form-group">
              <label>Estoque Mínimo</label>
              <input
                type="number"
                name="estoque_minimo"
                defaultValue="2"
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
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Produto
            </button>
            <Link href="/admin/livraria" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
