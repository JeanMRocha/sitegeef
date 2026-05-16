import { redirect } from 'next/navigation';
import Link from 'next/link';
import { registrarMovimento, getProdutoById, getPessoasDisponiveis } from '../../actions';

export const metadata = {
  title: 'Registrar Movimento - Admin GEEF',
};

async function handleSubmit(produto_id: string, formData: FormData) {
  'use server';

  try {
    const tipo = formData.get('tipo') as string;
    const quantidade = parseInt(formData.get('quantidade') as string);
    const pessoa_id = (formData.get('pessoa_id') as string) || undefined;
    const valor_unit = formData.get('valor_unit') ? parseFloat(formData.get('valor_unit') as string) : undefined;
    const valor_total = formData.get('valor_total') ? parseFloat(formData.get('valor_total') as string) : undefined;
    const forma_pagamento = (formData.get('forma_pagamento') as string) || undefined;
    const status_pagamento = (formData.get('status_pagamento') as string) || undefined;
    const observacao = (formData.get('observacao') as string) || undefined;

    await registrarMovimento({
      produto_id,
      pessoa_id,
      tipo,
      quantidade,
      valor_unit,
      valor_total,
      forma_pagamento,
      status_pagamento,
      observacao,
    });

    redirect(`/admin/livraria/${produto_id}`);
  } catch (error) {
    console.error('Erro ao registrar movimento:', error);
    throw error;
  }
}

async function MovimentoContent({ produto_id }: { produto_id: string }) {
  const produto = await getProdutoById(produto_id);
  const pessoas = await getPessoasDisponiveis();

  const tiposMovimento = [
    { value: 'venda', label: '💰 Venda' },
    { value: 'doacao_recebida', label: '📥 Doação Recebida' },
    { value: 'doacao_realizada', label: '📤 Doação Realizada' },
    { value: 'entrada', label: '📦 Entrada' },
    { value: 'baixa_perda', label: '❌ Perda' },
    { value: 'baixa_dano', label: '⚠️ Dano' },
    { value: 'transferencia_biblioteca', label: '📚 Transferência p/ Biblioteca' },
  ];

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'pix', label: 'PIX' },
    { value: 'cartao_credito', label: 'Cartão de Crédito' },
    { value: 'cartao_debito', label: 'Cartão de Débito' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'transferencia', label: 'Transferência Bancária' },
  ];

  const statusPagamento = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'parcial', label: 'Pago Parcial' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Registrar Movimento</h1>
          <p className="admin-page-subtitle">{produto.titulo}</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(produto_id, formData)}>
          <div className="admin-form-group">
            <label>Tipo de Movimento *</label>
            <select
              name="tipo"
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
              {tiposMovimento.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Quantidade *</label>
              <input
                type="number"
                name="quantidade"
                placeholder="Ex: 5"
                required
                min="1"
              />
            </div>
            <div className="admin-form-group">
              <label>Pessoa</label>
              <select
                name="pessoa_id"
                style={{
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                }}
              >
                <option value="">— Nenhuma —</option>
                {pessoas.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Valor Unitário (R$)</label>
              <input
                type="number"
                name="valor_unit"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div className="admin-form-group">
              <label>Valor Total (R$)</label>
              <input
                type="number"
                name="valor_total"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Forma de Pagamento</label>
              <select
                name="forma_pagamento"
                style={{
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                }}
              >
                <option value="">— Nenhuma —</option>
                {formasPagamento.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Status do Pagamento</label>
              <select
                name="status_pagamento"
                style={{
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                }}
              >
                <option value="">— Nenhum —</option>
                {statusPagamento.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Observação</label>
            <textarea
              name="observacao"
              placeholder="Notas adicionais sobre este movimento..."
              rows={3}
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

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Movimento
            </button>
            <Link href={`/admin/livraria/${produto_id}`} className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function MovimentoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return <MovimentoContent produto_id={resolvedParams.id} />;
}
