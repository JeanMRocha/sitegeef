import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCursoById, updateCurso, getTurmas } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Curso - Admin GEEF',
};

type CursoPageParams = {
  id: string;
};

type TurmaCursoItem = {
  id: string;
  facilitador?: { nome?: string | null } | null;
  horario?: string | null;
  data_inicio: string;
  data_fim: string;
  status?: string | null;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCurso(id, {
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      ativo: formData.get('ativo') === 'on',
    });

    redirect(buildFlashNoticeUrl(`/admin/estudos/cursos/${id}`, { variant: 'success', message: 'Curso salvo.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/estudos/cursos/${id}`, { variant: 'error', message: 'Não foi possível salvar o curso.' }));
    return;
  }
}

async function CursoContent({ id }: { id: string }) {
  const curso = await getCursoById(id);
  const turmas = (await getTurmas(id)) as TurmaCursoItem[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{curso.nome}</h1>
          <p className="admin-page-subtitle">{turmas.length} turma(s)</p>
        </div>
        <Link href="/admin/estudos/turmas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Turma
        </Link>
      </div>

      <div className="admin-card form-panel-centered mb-2">
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
            />
          </div>

          <div className="content-surface-note content-surface-note-inline">
            <input
              type="checkbox"
              name="ativo"
              id="ativo"
              defaultChecked={curso.ativo}
            />
            <label htmlFor="ativo" className="mb-0">
              ✓ Curso ativo
            </label>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="form-card-title-lg">Turmas ({turmas.length})</h2>

        {turmas.length > 0 ? (
          <div className="overflow-x-auto">
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
                {turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td className="text-sm-500">{turma.facilitador?.nome}</td>
                    <td className="text-sm-muted">{turma.horario}</td>
                    <td className="text-xs-muted">
                      {new Date(turma.data_inicio).toLocaleDateString('pt-BR')} a {new Date(turma.data_fim).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <span className={turma.status === 'em_andamento' ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
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
          <p className="text-center-muted">Nenhuma turma neste curso.</p>
        )}
      </div>
    </div>
  );
}

export default async function CursoPage({ params }: { params: Promise<CursoPageParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <CursoContent id={resolvedParams.id} />
    </Suspense>
  );
}
