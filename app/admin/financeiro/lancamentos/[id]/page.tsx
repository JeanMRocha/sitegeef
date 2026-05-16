import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getMovimentoById, updateMovimento, deleteMovimento, getPlanoContas, getCentrosCusto, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Lançamento - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateMovimento(id, {
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

    redirect(`/admin/financeiro/lancamentos/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error);
    throw error;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteMovimento(id);
    redirect('/admin/financeiro/lancamentos');
  } catch (error) {
    console.error('Erro ao deletar lançamento:', error);
    throw error;
  }
}

async function LancamentoContent({ id }: { id: string }) {
  const movimento = await getMovimentoById(id);
  const contas = await getPlanoContas('ativo');
  const centros = await getCentrosCusto(true);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{movimento.descricao}</h1>
          <p className="admin-page-subtitle">
            {new Date(movimento.data).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <form action={() => handleDelete(id)} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            onClick={(e) => {
              if (!confirm('Tem certeza que deseja deletar este lançamento?')) {
                e.preventDefault();
              }
            }}
          >
            ✕ Deletar
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Tipo</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>
              {movimento.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Valor</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 600, color: movimento.tipo === 'entrada' ? '#22c55e' : '#ef4444' }}>
              {movimento.tipo === 'entrada' ? '+' : '-'} R$ {movimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Conta</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
              {movimento.plano_contas?.codigo} - {movimento.plano_contas?.nome}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Tipo *</label>
              <select
                name="tipo"
                defaultValue={movimento.tipo}
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
                <option value="entrada">📥 Entrada</option>
                <option value="saida">📤 Saída</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Data *</label>
              <input
                type="date"
                name="data"
                defaultValue={movimento.data}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Descrição *</label>
            <input
              type="text"
              name="descricao"
              defaultValue={movimento.descricao}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Conta Contábil *</label>
              <select
                name="conta_id"
                defaultValue={movimento.plano_contas?.id}
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
                defaultValue={movimento.valor}
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
                defaultValue={movimento.centros_custo?.id || ''}
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
                defaultValue={movimento.pessoas?.id || ''}
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
              defaultValue={movimento.categoria}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>URL do Comprovante</label>
            <input
              type="url"
              name="comprovante_url"
              defaultValue={movimento.comprovante_url || ''}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/financeiro/lancamentos" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LancamentoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <LancamentoContent id={params.id} />
    </Suspense>
  );
}
