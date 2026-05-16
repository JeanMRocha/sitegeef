import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCargoById, updateCargo } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Cargo - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCargo(id, {
      nome: (formData.get('nome') as string) || undefined,
      descricao: (formData.get('descricao') as string) || undefined,
      nivel: (formData.get('nivel') as string) || undefined,
    });

    redirect(`/admin/governanca/cargos/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function CargoContent({ id }: { id: string }) {
  const cargo = await getCargoById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{cargo.nome}</h1>
          <p className="admin-page-subtitle">
            {cargo.nivel ? (cargo.nivel === 'estrategico' ? '🎯 Nível Estratégico' : cargo.nivel === 'operacional' ? '⚙️ Nível Operacional' : '📋 Nível Coordenação') : 'Nível não definido'}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Cargo</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={cargo.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              defaultValue={cargo.descricao || ''}
              placeholder="Responsabilidades..."
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
              defaultValue={cargo.nivel || ''}
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

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CargoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CargoContent id={params.id} />
    </Suspense>
  );
}
