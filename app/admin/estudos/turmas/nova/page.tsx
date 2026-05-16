import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createTurma, getCursos, getPessoasDisponiveis } from '../../actions';

export const metadata = {
  title: 'Nova Turma - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const turma = await createTurma({
      curso_id: formData.get('curso_id') as string,
      facilitador_id: formData.get('facilitador_id') as string,
      horario: formData.get('horario') as string,
      data_inicio: formData.get('data_inicio') as string,
      data_fim: formData.get('data_fim') as string,
    });

    redirect(`/admin/estudos/turmas/${turma.id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

export default async function NovaTurmaPage() {
  const cursos = await getCursos();
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Turma</h1>
          <p className="admin-page-subtitle">Crie uma nova turma de estudo</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Curso *</label>
            <select
              name="curso_id"
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
              <option value="">Selecione um curso</option>
              {cursos.map((curso: any) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Facilitador *</label>
            <select
              name="facilitador_id"
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
              <option value="">Selecione um facilitador</option>
              {pessoas.map((pessoa: any) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Horário *</label>
            <input
              type="text"
              name="horario"
              placeholder="Ex: Segunda 19:30"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Data de Início *</label>
            <input
              type="date"
              name="data_inicio"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Data de Término *</label>
            <input
              type="date"
              name="data_fim"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Turma
            </button>
            <Link href="/admin/estudos/turmas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
