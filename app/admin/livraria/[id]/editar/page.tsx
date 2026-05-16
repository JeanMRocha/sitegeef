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
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Cadastro de produto</p>
            <h1 className="area-hero-title">Editar Produto</h1>
          </div>
          <div className="tag-list">
            <span className="tag">{produto.titulo}</span>
          </div>
        </div>
        <p className="area-subtitle">{produto.autor || 'Autor desconhecido'}</p>
      </section>

      <section className="area-section">
        <div className="table-surface" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <form action={(formData) => handleSubmit(id, formData)}>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Título *</span>
                <input type="text" name="titulo" placeholder="Ex: O Evangelho Segundo o Espiritismo" defaultValue={produto.titulo} required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Autor</span>
                <input type="text" name="autor" placeholder="Ex: Allan Kardec" defaultValue={produto.autor || ''} className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Categoria</span>
                <select name="categoria" defaultValue={produto.categoria || ''} className="profile-form-input">
                  <option value="">— Selecione —</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Quantidade em estoque</span>
                <input type="number" name="qtd_estoque" defaultValue={produto.qtd_estoque} min="0" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Estoque mínimo</span>
                <input type="number" name="estoque_minimo" defaultValue={produto.estoque_minimo} min="0" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Valor de custo (R$)</span>
                <input type="number" name="valor_custo" placeholder="0.00" defaultValue={produto.valor_custo || ''} step="0.01" min="0" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Valor de venda (R$)</span>
                <input type="number" name="valor_venda" placeholder="0.00" defaultValue={produto.valor_venda || ''} step="0.01" min="0" className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>URL da capa</span>
                <input type="url" name="capa_url" placeholder="https://..." defaultValue={produto.capa_url || ''} className="profile-form-input" />
              </label>
            </div>

            {produto.capa_url && (
              <div className="area-panel-item" style={{ marginTop: '1rem' }}>
                <span className="stat-label">Prévia</span>
                <img src={produto.capa_url} alt={produto.titulo} style={{ maxWidth: '200px', borderRadius: '0.8rem', marginTop: '0.5rem' }} />
              </div>
            )}

            <div className="area-panel-grid" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Salvar alterações</button>
              <Link href={`/admin/livraria/${id}`} className="profile-form-btn profile-form-btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </section>
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
