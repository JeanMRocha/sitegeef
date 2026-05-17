import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createTurma } from '../../actions';

export const metadata = {
  title: 'Nova Turma - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const turma = await createTurma({
      nome: formData.get('nome') as string,
      faixa_etaria: formData.get('faixa_etaria') as string,
      horario: formData.get('horario') as string,
      sala: formData.get('sala') as string,
      capacidade: parseInt(formData.get('capacidade') as string),
    });

    redirect(`/admin/evangelizacao/turmas/${turma.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

export default function NovaTurmaPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Turma</h1>
          <p className="admin-page-subtitle">Crie uma turma de evangelização infantil</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome da Turma *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Turma A - Crianças 6-8 anos"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Faixa Etária *</label>
              <input
                type="text"
                name="faixa_etaria"
                placeholder="Ex: 6-8 anos"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Horário *</label>
              <input
                type="text"
                name="horario"
                placeholder="Ex: Sábado 10h"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Sala *</label>
              <input
                type="text"
                name="sala"
                placeholder="Ex: Sala 01"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Capacidade *</label>
              <input
                type="number"
                name="capacidade"
                placeholder="20"
                min="1"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Turma
            </button>
            <Link href="/admin/evangelizacao/turmas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
