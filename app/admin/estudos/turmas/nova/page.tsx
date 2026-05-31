import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createTurma, getCursos, getPessoasDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

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

    redirect(buildFlashNoticeUrl(`/admin/estudos/turmas/${turma.id}`, { variant: 'success', message: 'Turma criada.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/estudos/turmas', { variant: 'error', message: 'Não foi possível criar a turma.' }));
    return;
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

      <div className="admin-card form-panel-centered">
        <form action={handleSubmit}>
          <LgpdFormNotice text="Usamos os dados para organizar a turma e o acompanhamento dos participantes." />
          <div className="admin-form-group">
            <label>Curso *</label>
            <select name="curso_id" required>
              <option value="">Selecione um curso</option>
              {cursos.map((curso: { id: string; nome: string }) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Facilitador *</label>
            <select name="facilitador_id" required>
              <option value="">Selecione um facilitador</option>
              {pessoas.map((pessoa: { id: string; nome: string }) => (
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
            <input type="date" name="data_inicio" required />
          </div>

          <div className="admin-form-group">
            <label>Data de Término *</label>
            <input type="date" name="data_fim" required />
          </div>

          <div className="form-actions-row">
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
