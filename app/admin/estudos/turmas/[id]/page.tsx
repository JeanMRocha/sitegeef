import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTurmaById, updateTurma, getFrequencias, registrarFrequencia, updateFrequencia, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Turma - Admin GEEF',
};

async function handleSubmitTurma(id: string, formData: FormData) {
  'use server';

  try {
    await updateTurma(id, {
      facilitador_id: (formData.get('facilitador_id') as string) || undefined,
      horario: (formData.get('horario') as string) || undefined,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(`/admin/estudos/turmas/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleRegistrarFrequencia(id: string, formData: FormData) {
  'use server';

  try {
    await registrarFrequencia({
      turma_id: id,
      pessoa_id: formData.get('pessoa_id') as string,
      data: formData.get('data') as string,
      presente: formData.get('presente') === 'on',
    });

    redirect(`/admin/estudos/turmas/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleToggleFrequencia(id: string, presente: boolean) {
  'use server';

  try {
    await updateFrequencia(id, !presente);
    redirect(new URL(document.referrer).pathname);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function TurmaContent({ id }: { id: string }) {
  const turma = await getTurmaById(id);
  const frequencias = await getFrequencias(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{turma.curso?.nome}</h1>
          <p className="admin-page-subtitle">Facilitador: {turma.facilitador?.nome}</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Turma</h2>
        <form action={(formData) => handleSubmitTurma(id, formData)}>
          <div className="admin-form-group">
            <label>Facilitador</label>
            <select
              name="facilitador_id"
              defaultValue={turma.facilitador_id || ''}
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
            <label>Horário</label>
            <input
              type="text"
              name="horario"
              defaultValue={turma.horario || ''}
              placeholder="Ex: Segunda 19:30"
            />
          </div>

          <div className="admin-form-group">
            <label>Data de Início</label>
            <input
              type="date"
              name="data_inicio"
              defaultValue={turma.data_inicio ? new Date(turma.data_inicio).toISOString().split('T')[0] : ''}
            />
          </div>

          <div className="admin-form-group">
            <label>Data de Término</label>
            <input
              type="date"
              name="data_fim"
              defaultValue={turma.data_fim ? new Date(turma.data_fim).toISOString().split('T')[0] : ''}
            />
          </div>

          <div className="admin-form-group">
            <label>Status</label>
            <select
              name="status"
              defaultValue={turma.status || 'em_andamento'}
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
              <option value="em_andamento">▶ Em andamento</option>
              <option value="finalizada">✓ Finalizada</option>
            </select>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          Frequências ({frequencias.length})
        </h2>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '0.6rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #3b82f6',
        }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Registrar Frequência</h3>
          <form action={(formData) => handleRegistrarFrequencia(id, formData)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Pessoa</label>
              <select
                name="pessoa_id"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Data</label>
              <input
                type="date"
                name="data"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="presente"
                id="presente"
                defaultChecked
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="presente" style={{ fontSize: '0.85rem', margin: 0, cursor: 'pointer' }}>Presente</label>
            </div>
            <button type="submit" className="admin-btn admin-btn-small">
              ➕ Adicionar
            </button>
          </form>
        </div>

        {frequencias.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pessoa</th>
                  <th>Data</th>
                  <th>Presença</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {frequencias.map((freq: any) => (
                  <tr key={freq.id}>
                    <td style={{ fontWeight: 500 }}>
                      {freq.pessoa?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(freq.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: freq.presente ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: freq.presente ? '#22c55e' : '#ef4444',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {freq.presente ? '✓ Presente' : '✕ Ausente'}
                      </span>
                    </td>
                    <td>
                      <form action={() => handleToggleFrequencia(freq.id, freq.presente)} style={{ display: 'inline' }}>
                        <button type="submit" className="admin-btn admin-btn-small">
                          🔄 Alterar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma frequência registrada.</p>
        )}
      </div>
    </div>
  );
}

export default async function TurmaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <TurmaContent id={resolvedParams.id} />
    </Suspense>
  );
}
