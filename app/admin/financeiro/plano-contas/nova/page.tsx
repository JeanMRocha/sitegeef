import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createConta } from '../../actions';

export const metadata = {
  title: 'Nova Conta - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const conta = await createConta({
      codigo: formData.get('codigo') as string,
      nome: formData.get('nome') as string,
      tipo: formData.get('tipo') as string,
    });

    redirect(`/admin/financeiro/plano-contas/${conta.id}`);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return;
  }
}

export default function NovaContaPage() {
  const tipos = ['receita', 'despesa', 'ativo', 'passivo'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Conta</h1>
          <p className="admin-page-subtitle">Adicione um novo item ao plano de contas</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Código *</label>
            <input
              type="text"
              name="codigo"
              placeholder="Ex: 1.1.1"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Doações"
              required
            />
          </div>

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
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Conta
            </button>
            <Link href="/admin/financeiro/plano-contas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
