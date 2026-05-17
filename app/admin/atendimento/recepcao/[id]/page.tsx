import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getRecepcaoById, updateRecepcao, deleteRecepcao } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Atendimento Recepção - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateRecepcao(id, {
      data: formData.get('data') as string,
      pessoas_atendidas: parseInt(formData.get('pessoas_atendidas') as string),
      motivo_geral: formData.get('motivo_geral') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(`/admin/atendimento/recepcao/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteRecepcao(id);
    redirect('/admin/atendimento/recepcao');
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return;
  }
}

async function AtendimentoContent({ id }: { id: string }) {
  const atend = await getRecepcaoById(id);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Atendimento Recepção</h1>
          <p className="admin-page-subtitle">{new Date(atend.data).toLocaleDateString('pt-BR')}</p>
        </div>
        <form action={() => handleDelete(id)} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            onClick={(e) => {
              if (!confirm('Tem certeza que deseja deletar este atendimento?')) {
                e.preventDefault();
              }
            }}
          >
            ✕ Deletar
          </button>
        </form>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Data *</label>
              <input
                type="date"
                name="data"
                defaultValue={atend.data}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Pessoas Atendidas *</label>
              <input
                type="number"
                name="pessoas_atendidas"
                defaultValue={atend.pessoas_atendidas}
                min="0"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Motivo Geral *</label>
            <input
              type="text"
              name="motivo_geral"
              defaultValue={atend.motivo_geral}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Encaminhamento</label>
            <input
              type="text"
              name="encaminhamento"
              defaultValue={atend.encaminhamento || ''}
            />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              defaultValue={atend.observacoes || ''}
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

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/atendimento/recepcao" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function AtendimentoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <AtendimentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
