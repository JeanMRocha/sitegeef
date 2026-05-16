import { redirect } from 'next/navigation';
import Link from 'next/link';
import { addPasseEscalon, getPessoasDisponiveis } from '../../../../actions';

export const metadata = {
  title: 'Adicionar Passe - Admin GEEF',
};

async function handleSubmit(formData: FormData, escalaId: string, reuniaoId: string) {
  'use server';

  try {
    await addPasseEscalon(
      reuniaoId,
      formData.get('pessoa_id') as string,
      parseInt(formData.get('posicao') as string)
    );

    redirect(`/admin/escalas/${escalaId}`);
  } catch (error) {
    console.error('Erro ao adicionar passe:', error);
    throw error;
  }
}

export default async function NovoPassePage({
  params,
}: {
  params: Promise<any>;
}) {
  const resolvedParams = await params;
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Adicionar Passe</h1>
          <p className="admin-page-subtitle">Escale uma pessoa para o passe magnético</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(formData, resolvedParams.id, resolvedParams.reuniao_id)}>
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
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
              {pessoas.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Posição na Escala *</label>
            <input
              type="number"
              name="posicao"
              placeholder="1, 2, 3..."
              min="1"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Adicionar Passe
            </button>
            <Link href={`/admin/escalas/${resolvedParams.id}`} className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
