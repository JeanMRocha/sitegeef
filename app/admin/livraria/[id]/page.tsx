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
    throw error;
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
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{produto.titulo}</h1>
          <p className="admin-page-subtitle">{produto.autor || 'Autor desconhecido'}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href={`/admin/livraria/${id}/editar`} className="admin-btn admin-btn-primary">
            ✏️ Editar
          </Link>
          <form action={() => handleToggleStatus(id, produto.ativo)} style={{ display: 'inline' }}>
            <button
              type="submit"
              className="admin-btn"
              style={{
                backgroundColor: produto.ativo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: produto.ativo ? '#ef4444' : '#22c55e',
                border: produto.ativo ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              {produto.ativo ? '🗑️ Desativar' : '✓ Reativar'}
            </button>
          </form>
        </div>
      </div>

      {/* Info Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Estoque</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: 600, color: produto.qtd_estoque <= produto.estoque_minimo ? '#ef4444' : 'var(--text)' }}>
              {produto.qtd_estoque}
              {produto.qtd_estoque <= produto.estoque_minimo && ' ⚠️'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Mínimo</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: 600 }}>
              {produto.estoque_minimo}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Valor Custo</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
              {produto.valor_custo ? `R$ ${produto.valor_custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Valor Venda</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
              {produto.valor_venda ? `R$ ${produto.valor_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Detalhes</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Autor</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
              {produto.autor || '—'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Categoria</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
              {produto.categoria || '—'}
            </p>
          </div>
        </div>

        {produto.capa_url && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Capa</p>
            <img
              src={produto.capa_url}
              alt={produto.titulo}
              style={{ maxWidth: '200px', borderRadius: '0.4rem', marginTop: '0.5rem' }}
            />
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</p>
          <span style={{
            display: 'inline-block',
            padding: '0.35rem 0.7rem',
            backgroundColor: produto.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
            color: produto.ativo ? '#22c55e' : '#6b7280',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
          }}>
            {produto.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      {/* Movimentos */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Movimentações</h2>
          <Link href={`/admin/livraria/${id}/movimento`} className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
            ➕ Registrar Movimento
          </Link>
        </div>

        {produto.movimentos && produto.movimentos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Qtd</th>
                  <th>Valor Unit.</th>
                  <th>Total</th>
                  <th>Pessoa</th>
                  <th>Forma Pag.</th>
                </tr>
              </thead>
              <tbody>
                {produto.movimentos.map((mov: any) => (
                  <tr key={mov.id}>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(mov.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {tiposMovimento[mov.tipo] || mov.tipo}
                    </td>
                    <td style={{ fontWeight: 600 }}>{mov.quantidade}</td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {mov.valor_unit ? `R$ ${mov.valor_unit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {mov.valor_total ? `R$ ${mov.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {mov.pessoas?.nome || '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {mov.forma_pagamento || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--admin-bg)',
            borderRadius: '0.6rem',
            color: 'var(--muted)',
          }}>
            <p>Nenhuma movimentação registrada.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/admin/livraria" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>
    </div>
  );
}

export default function ProdutoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ProdutoContent id={params.id} />
    </Suspense>
  );
}
