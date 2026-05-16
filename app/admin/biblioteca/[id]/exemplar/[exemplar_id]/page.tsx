import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getExemplarById, updateExemplar } from '../../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Exemplar - Admin GEEF',
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

    redirect(`/admin/biblioteca/${obraId}`);
  } catch (error) {
    console.error('Erro ao atualizar exemplar:', error);
    throw error;
  }
}

async function EditExemplarContent({
  params,
}: {
  params: { id: string; exemplar_id: string };
}) {
  const exemplar = await getExemplarById(params.exemplar_id);

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
        <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(251, 146, 60, 0.05)', borderLeft: '4px solid #f97316' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Em empréstimo para:</strong> {exemplar.emprestimo_ativo[0].pessoas?.nome}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Data de retirada:</strong> {new Date(exemplar.emprestimo_ativo[0].data_retirada + 'T00:00:00').toLocaleDateString('pt-BR')}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Prazo de devolução:</strong> {new Date(exemplar.emprestimo_ativo[0].prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
          </p>
        </div>
      )}

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={(formData) => handleUpdate(formData, params.id, params.exemplar_id)}>
          <div className="admin-form-group">
            <label>Código</label>
            <input
              type="text"
              value={exemplar.codigo}
              disabled
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--muted)',
                backgroundColor: 'var(--admin-bg)',
              }}
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
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
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
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
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
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              {situacoes.map((sit) => (
                <option key={sit} value={sit}>
                  {sit.charAt(0).toUpperCase() + sit.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
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

export default function EditExemplarPage({
  params,
}: {
  params: { id: string; exemplar_id: string };
}) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditExemplarContent params={params} />
    </Suspense>
  );
}
