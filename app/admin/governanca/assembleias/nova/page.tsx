import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAssembleia } from '../../actions';

export const metadata = {
  title: 'Nova Assembleia - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const assembleia = await createAssembleia({
      tipo: formData.get('tipo') as string,
      data: formData.get('data') as string,
      pauta: (formData.get('pauta') as string) || undefined,
    });

    redirect(`/admin/governanca/assembleias/${assembleia.id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

export default function NovaAssembleiaPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Assembleia</h1>
          <p className="admin-page-subtitle">Registrar uma nova assembleia ou reunião</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Tipo *</label>
            <select
              name="tipo"
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                backgroundColor: '#fff',
              }}
            >
              <option value="">Selecione o tipo</option>
              <option value="AGO">📊 AGO (Assembleia Geral Ordinária)</option>
              <option value="AGE">📋 AGE (Assembleia Geral Extraordinária)</option>
              <option value="reuniao_diretoria">👔 Reunião de Diretoria</option>
              <option value="reuniao_departamento">🏢 Reunião de Departamento</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Data *</label>
            <input
              type="date"
              name="data"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Pauta</label>
            <textarea
              name="pauta"
              placeholder="Assuntos a serem discutidos..."
              rows={4}
              style={{
                width: '100%',
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
              ✅ Criar Assembleia
            </button>
            <Link href="/admin/governanca/assembleias" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
