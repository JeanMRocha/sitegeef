import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getProdutoById, toggleProdutoStatus } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Produto - Admin GEEF',
};

async function handleToggleStatus(id: string, ativo: boolean) {
  'use server';

  try {
    await toggleProdutoStatus(id, !ativo);
    redirect(`/admin/livraria/${id}`);
  } catch (error) {
    console.error('Erro ao alternar status:', error);
    return;
  }
}

async function ProdutoContent({ id }: { id: string }) {
  const produto = await getProdutoById(id);

  const tiposMovimento: { [key: string]: string } = {
    'venda': '💰 Venda',
    'doacao_recebida': '📥 Doação Recebida',
    'doacao_realizada': '📤 Doação Realizada',
    'entrada': '📦 Entrada',
    'baixa_perda': '❌ Perda',
    'baixa_dano': '⚠️ Dano',
    'transferencia_biblioteca': '📚 Transferência p/ Biblioteca',
  };

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Detalhe do produto</p>
            <h1 className="area-hero-title">{produto.titulo}</h1>
          </div>
          <div className="tag-list">
            <span className="tag">{produto.ativo ? 'Ativo' : 'Inativo'}</span>
            <span className="tag">{produto.qtd_estoque} em estoque</span>
          </div>
        </div>
        <p className="area-subtitle">{produto.autor || 'Autor desconhecido'}</p>
        <div className="area-panel-grid">
          <Link href={`/admin/livraria/${id}/editar`} className="profile-form-btn profile-form-btn-primary">
            Editar
          </Link>
          <form action={() => handleToggleStatus(id, produto.ativo)}>
            <button
              type="submit"
              className="profile-form-btn profile-form-btn-secondary"
              style={produto.ativo ? { color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.25)' } : { color: 'var(--success)' }}
            >
              {produto.ativo ? 'Desativar' : 'Reativar'}
            </button>
          </form>
          <Link href="/admin/livraria" className="profile-form-btn profile-form-btn-secondary">
            Voltar
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Estoque</span>
          <strong style={{ color: produto.qtd_estoque <= produto.estoque_minimo ? 'var(--danger)' : 'var(--text)' }}>
            {produto.qtd_estoque}
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Mínimo</span>
          <strong>{produto.estoque_minimo}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Valor custo</span>
          <strong>{produto.valor_custo ? `R$ ${produto.valor_custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Valor venda</span>
          <strong>{produto.valor_venda ? `R$ ${produto.valor_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Detalhes</h2>
          <p>Dados cadastrais e imagem da capa.</p>
        </div>
        <div className="table-surface">
          <div className="area-panel-grid">
            <div className="area-panel-item">
              <span className="stat-label">Autor</span>
              <strong>{produto.autor || '—'}</strong>
            </div>
            <div className="area-panel-item">
              <span className="stat-label">Categoria</span>
              <strong>{produto.categoria || '—'}</strong>
            </div>
            {produto.capa_url && (
              <div className="area-panel-item">
                <span className="stat-label">Capa</span>
                <img
                  src={produto.capa_url}
                  alt={produto.titulo}
                  style={{ maxWidth: '200px', borderRadius: '0.8rem', marginTop: '0.5rem' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Movimentações</h2>
          <p>Histórico de entrada, venda e baixa.</p>
        </div>
        <div className="table-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Link href={`/admin/livraria/${id}/movimento`} className="profile-form-btn profile-form-btn-primary">
              Registrar Movimento
            </Link>
          </div>

          {produto.movimentos && produto.movimentos.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Qtd</th>
                  <th>Valor unit.</th>
                  <th>Total</th>
                  <th>Pessoa</th>
                  <th>Forma pag.</th>
                </tr>
              </thead>
              <tbody>
                {produto.movimentos.map((mov: any) => (
                  <tr key={mov.id}>
                    <td>{new Date(mov.criado_em).toLocaleDateString('pt-BR')}</td>
                    <td style={{ fontWeight: 500 }}>{tiposMovimento[mov.tipo] || mov.tipo}</td>
                    <td>{mov.quantidade}</td>
                    <td>{mov.valor_unit ? `R$ ${mov.valor_unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</td>
                    <td style={{ fontWeight: 500 }}>{mov.valor_total ? `R$ ${mov.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{mov.pessoas?.nome || '—'}</td>
                    <td>{mov.forma_pagamento || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="area-empty">Nenhuma movimentação registrada.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default async function ProdutoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ProdutoContent id={resolvedParams.id} />
    </Suspense>
  );
}
