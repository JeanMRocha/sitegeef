import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getExemplarById, updateExemplar } from '../../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Editar Exemplar - Admin GEEF',
};

type ExemplarEmprestimoAtivo = {
  pessoas?: {
    nome?: string | null;
  } | null;
  data_retirada: string;
  prazo_devolucao: string;
};

type ExemplarDetalhe = {
  id: string;
  codigo: string;
  localizacao?: string | null;
  conservacao?: string | null;
  origem?: string | null;
  situacao?: string | null;
  obra?: {
    titulo?: string | null;
  } | null;
  emprestimo_ativo?: ExemplarEmprestimoAtivo[] | null;
};

async function handleUpdate(formData: FormData, obraId: string, exemplarId: string) {
  'use server';

  try {
    await updateExemplar(exemplarId, {
      localizacao: (formData.get('localizacao') as string) || undefined,
      conservacao: (formData.get('conservacao') as string) || undefined,
      origem: (formData.get('origem') as string) || undefined,
      situacao: (formData.get('situacao') as string) || undefined,
    });

    redirect(
      buildFlashNoticeUrl(`/admin/biblioteca/${obraId}`, {
        variant: 'success',
        message: 'Exemplar salvo.',
      }),
    );
  } catch (error) {
    console.error('Erro ao atualizar exemplar:', error);
    redirect(
      buildFlashNoticeUrl(`/admin/biblioteca/${obraId}`, {
        variant: 'error',
        message: 'Não foi possível salvar o exemplar.',
      }),
    );
  }
}

async function EditExemplarContent({
  params,
}: {
  params: { id: string; exemplar_id: string };
}) {
  const exemplar = (await getExemplarById(params.exemplar_id)) as ExemplarDetalhe | null;
  if (!exemplar) {
    notFound();
  }

  const situacoes = ['disponivel', 'emprestado', 'reservado', 'danificado', 'perdido'];
  const conservacoes = ['excelente', 'bom', 'regular', 'danificado'];
  const origens = ['acervo', 'compra', 'doacao'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Exemplar</h1>
          <p className="admin-page-subtitle">{exemplar.obra?.titulo}</p>
        </div>
      </div>

      {/* Info Box */}
      {exemplar.emprestimo_ativo && exemplar.emprestimo_ativo.length > 0 && (
        <div className="admin-card panel-accent-card content-surface-note-danger mb-2">
          <p className="text-sm-muted">
            <strong>Em empréstimo para:</strong> {exemplar.emprestimo_ativo[0].pessoas?.nome}
          </p>
          <p className="text-sm-muted">
            <strong>Data de retirada:</strong> {new Date(exemplar.emprestimo_ativo[0].data_retirada + 'T00:00:00').toLocaleDateString('pt-BR')}
          </p>
          <p className="text-sm-muted">
            <strong>Prazo de devolução:</strong> {new Date(exemplar.emprestimo_ativo[0].prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
          </p>
        </div>
      )}

      {/* Form */}
      <div className="admin-card form-panel-centered-sm">
        <form action={(formData) => handleUpdate(formData, params.id, params.exemplar_id)}>
          <div className="admin-form-group">
            <label>Código</label>
            <input
              type="text"
              value={exemplar.codigo}
              disabled
              className="profile-input form-control-full"
            />
          </div>

          <div className="admin-form-group">
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              defaultValue={exemplar.localizacao || ''}
              placeholder="Ex: Prateleira A3"
            />
          </div>

          <div className="admin-form-group">
            <label>Conservação</label>
            <select
              name="conservacao"
              defaultValue={exemplar.conservacao || ''}
              className="profile-form-input form-control-full"
            >
              <option value="">— Selecione —</option>
              {conservacoes.map((cons) => (
                <option key={cons} value={cons}>
                  {cons.charAt(0).toUpperCase() + cons.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Origem</label>
            <select
              name="origem"
              defaultValue={exemplar.origem || 'acervo'}
              className="profile-form-input form-control-full"
            >
              {origens.map((orig) => (
                <option key={orig} value={orig}>
                  {orig.charAt(0).toUpperCase() + orig.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Situação</label>
            <select
              name="situacao"
              defaultValue={exemplar.situacao || 'disponivel'}
              className="profile-form-input form-control-full"
            >
              {situacoes.map((sit) => (
                <option key={sit} value={sit}>
                  {sit.charAt(0).toUpperCase() + sit.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href={`/admin/biblioteca/${params.id}`} className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function EditExemplarPage({
  params,
}: {
  params: Promise<{ id: string; exemplar_id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EditExemplarContent params={resolvedParams} />
    </Suspense>
  );
}

