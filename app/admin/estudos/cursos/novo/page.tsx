import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createCurso } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Curso - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const curso = await createCurso({
      nome: formData.get('nome') as string,
      descricao: (formData.get('descricao') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/estudos/cursos/${curso.id}`, { variant: 'success', message: 'Curso criado.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/estudos/cursos', { variant: 'error', message: 'Não foi possível criar o curso.' }));
    return;
  }
}

export default function NovoCursoPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Curso</h1>
          <p className="admin-page-subtitle">Crie um novo curso de estudo</p>
        </div>
      </div>

      <div className="admin-card form-panel-centered">
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome do Curso *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: IEE, ESDE, EOB, EADE"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              placeholder="Objetivo, conteúdo programático..."
              rows={3}
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Curso
            </button>
            <Link href="/admin/estudos/cursos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
