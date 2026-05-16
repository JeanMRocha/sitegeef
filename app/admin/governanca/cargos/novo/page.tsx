import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createCargo } from '../../actions';

export const metadata = {
  title: 'Novo Cargo - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const cargo = await createCargo({
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      nivel: (formData.get('nivel') as string) || undefined,
    });

    redirect(`/admin/governanca/cargos/${cargo.id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

export default function NovoCargoPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Cargo</h1>
          <p className="admin-page-subtitle">Criar uma nova posição/função</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome do Cargo *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Presidente, Vice-presidente, Secretário..."
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              placeholder="Responsabilidades e atribuições..."
              rows={3}
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

          <div className="admin-form-group">
            <label>Nível Hierárquico</label>
            <select
              name="nivel"
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
              <option value="">Selecione um nível</option>
              <option value="estrategico">🎯 Estratégico</option>
              <option value="operacional">⚙️ Operacional</option>
              <option value="coordenacao">📋 Coordenação</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Cargo
            </button>
            <Link href="/admin/governanca/cargos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
