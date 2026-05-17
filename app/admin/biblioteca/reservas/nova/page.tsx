import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createReserva, getPessoasDisponiveis, getObrasDisponiveis } from '../actions';

export const metadata = {
  title: 'Nova Reserva - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    await createReserva({
      pessoa_id: formData.get('pessoa_id') as string,
      obra_id: formData.get('obra_id') as string,
    });

    redirect('/admin/biblioteca/reservas');
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return;
  }
}

export default async function NovaReservaPage() {
  const pessoas = await getPessoasDisponiveis();
  const obras = await getObrasDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Reserva</h1>
          <p className="admin-page-subtitle">Adicione pessoa à fila de espera</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={handleSubmit}>
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
            <label>Obra *</label>
            <select
              name="obra_id"
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
              {obras.map((o: any) => (
                <option key={o.id} value={o.id}>
                  {o.titulo} {o.autor ? `- ${o.autor}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Reserva
            </button>
            <Link href="/admin/biblioteca/reservas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
