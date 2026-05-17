import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCursoById, updateCurso, getTurmas } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Curso - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCurso(id, {
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      ativo: formData.get('ativo') === 'on',
    });

    redirect(`/admin/estudos/cursos/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function CursoContent({ id }: { id: string }) {
  const curso = await getCursoById(id);
  const turmas = await getTurmas(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{curso.nome}</h1>
          <p className="admin-page-subtitle">{turmas.length} turma(s)</p>
        </div>
        <Link href="/admin/estudos/turmas/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Turma
        </Link>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome do Curso *</label>
            <input
              type="text"
              name="nome"
              defaultValue={curso.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              defaultValue={curso.descricao || ''}
              rows={3}
              style={{
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

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}>
            <input
              type="checkbox"
              name="ativo"
              id="ativo"
              defaultChecked={curso.ativo}
            />
            <label htmlFor="ativo" style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              ✓ Curso ativo
            </label>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          Turmas ({turmas.length})
        </h2>

        {turmas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Facilitador</th>
                  <th>Horário</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma: any) => (
                  <tr key={turma.id}>
                    <td style={{ fontWeight: 500 }}>
                      {turma.facilitador?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {turma.horario}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {new Date(turma.data_inicio).toLocaleDateString('pt-BR')} a {new Date(turma.data_fim).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: turma.status === 'em_andamento' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: turma.status === 'em_andamento' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {turma.status === 'em_andamento' ? '▶ Em andamento' : '✓ Finalizada'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/estudos/turmas/${turma.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma turma neste curso.</p>
        )}
      </div>
    </div>
  );
}

export default async function CursoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CursoContent id={resolvedParams.id} />
    </Suspense>
  );
}
