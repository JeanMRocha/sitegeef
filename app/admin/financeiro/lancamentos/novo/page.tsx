import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createMovimento, getPlanoContas, getCentrosCusto } from '../../actions';
import { getPessoas } from '../../../pessoas/actions';

export const metadata = {
  title: 'Novo Lançamento - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const movimento = await createMovimento({
      tipo: formData.get('tipo') as string,
      conta_id: formData.get('conta_id') as string,
      categoria: formData.get('categoria') as string,
      descricao: formData.get('descricao') as string,
      valor: parseFloat(formData.get('valor') as string),
      data: formData.get('data') as string,
      centro_custo_id: (formData.get('centro_custo_id') as string) || undefined,
      pessoa_id: (formData.get('pessoa_id') as string) || undefined,
      comprovante_url: (formData.get('comprovante_url') as string) || undefined,
    });

    redirect(`/admin/financeiro/lancamentos/${movimento.id}`);
  } catch (error) {
    console.error('Erro ao criar lançamento:', error);
    throw error;
  }
}

async function NovoLancamentoPage() {
  const contas = await getPlanoContas('ativo');
  const centros = await getCentrosCusto(true);
  const { pessoas } = await getPessoas();
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Lançamento</h1>
          <p className="admin-page-subtitle">Registre uma entrada ou saída financeira</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Tipo *</label>
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
                <option value="entrada">📥 Entrada</option>
                <option value="saida">📤 Saída</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Data *</label>
              <input
                type="date"
                name="data"
                defaultValue={hoje}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Descrição *</label>
            <input
              type="text"
              name="descricao"
              placeholder="Ex: Doação de Ana Silva"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Conta Contábil *</label>
              <select
                name="conta_id"
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
                {contas.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} - {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Valor (R$) *</label>
              <input
                type="number"
                name="valor"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Centro de Custo</label>
              <select
                name="centro_custo_id"
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
                {centros.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
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

          <div className="admin-form-group">
            <label>Categoria *</label>
            <input
              type="text"
              name="categoria"
              placeholder="Ex: Doação, Pagamento, Venda"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>URL do Comprovante</label>
            <input
              type="url"
              name="comprovante_url"
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Lançamento
            </button>
            <Link href="/admin/financeiro/lancamentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoLancamentoPage;
