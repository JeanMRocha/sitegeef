import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createEscala } from '../actions';

export const metadata = {
  title: 'Nova Escala - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const escala = await createEscala({
      mes: parseInt(formData.get('mes') as string),
      ano: parseInt(formData.get('ano') as string),
    });

    redirect(`/admin/escalas/${escala.id}`);
  } catch (error) {
    console.error('Erro ao criar escala:', error);
    return;
  }
}

export default function NovaEscalaPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { num: 1, name: 'Janeiro' },
    { num: 2, name: 'Fevereiro' },
    { num: 3, name: 'Março' },
    { num: 4, name: 'Abril' },
    { num: 5, name: 'Maio' },
    { num: 6, name: 'Junho' },
    { num: 7, name: 'Julho' },
    { num: 8, name: 'Agosto' },
    { num: 9, name: 'Setembro' },
    { num: 10, name: 'Outubro' },
    { num: 11, name: 'Novembro' },
    { num: 12, name: 'Dezembro' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Escala</h1>
          <p className="admin-page-subtitle">Crie uma nova escala mensal</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', color: 'var(--muted)' }}>
            Selecione o mês e ano para gerar uma nova escala. As reuniões de quinta-feira serão criadas automaticamente.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Mês *</label>
              <select
                name="mes"
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
                {months.map((month) => (
                  <option key={month.num} value={month.num}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Ano *</label>
              <select
                name="ano"
                required
                defaultValue={currentYear}
                style={{
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Escala
            </button>
            <Link href="/admin/escalas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
