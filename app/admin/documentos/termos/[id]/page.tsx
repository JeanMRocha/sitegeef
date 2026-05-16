import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTermoById, updateTermo, revogaTermo, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Termo Assinado - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateTermo(id, {
      data_assinatura: (formData.get('data_assinatura') as string) || undefined,
      validade: (formData.get('validade') as string) || undefined,
      arquivo_url: (formData.get('arquivo_url') as string) || undefined,
    });

    redirect(`/admin/documentos/termos/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar termo:', error);
    throw error;
  }
}

async function handleRevoke(id: string) {
  'use server';

  try {
    await revogaTermo(id);
    redirect(`/admin/documentos/termos/${id}`);
  } catch (error) {
    console.error('Erro ao revogar termo:', error);
    throw error;
  }
}

async function EditTermoContent({ id }: { id: string }) {
  const termo = await getTermoById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Termo Assinado</h1>
          <p className="admin-page-subtitle">{termo.pessoas?.nome}</p>
        </div>
        {termo.status === 'ativo' && (
          <form action={() => handleRevoke(id)}>
            <button
              type="submit"
              className="admin-btn"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
              onClick={(e) => {
                if (!confirm('Tem certeza que deseja revogar este termo?')) {
                  e.preventDefault();
                }
              }}
            >
              ✕ Revogar
            </button>
          </form>
        )}
      </div>

      {/* Info Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Documento:</strong> {termo.documentos_modelo?.tipo}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Título:</strong> {termo.documentos_modelo?.titulo}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Status:</strong> <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.6rem',
                backgroundColor: termo.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: termo.status === 'ativo' ? '#22c55e' : '#ef4444',
                borderRadius: '0.3rem',
                fontSize: '0.85rem',
              }}>
                {termo.status}
              </span>
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>Criado em:</strong> {new Date(termo.criado_em).toLocaleDateString('pt-BR')}
            </p>
            {termo.responsavel_id && (
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                <strong>Responsável:</strong> {termo.responsavel_id}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      {termo.status === 'ativo' && (
        <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Editar Informações</h2>

          <form action={(formData) => handleUpdate(id, formData)}>
            <div className="admin-form-group">
              <label>Pessoa</label>
              <input
                type="text"
                value={termo.pessoas?.nome || ''}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="admin-form-group">
                <label>Data de Assinatura</label>
                <input
                  type="date"
                  name="data_assinatura"
                  defaultValue={termo.data_assinatura || ''}
                />
              </div>
              <div className="admin-form-group">
                <label>Validade</label>
                <input
                  type="date"
                  name="validade"
                  defaultValue={termo.validade || ''}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>URL do Arquivo</label>
              <input
                type="url"
                name="arquivo_url"
                defaultValue={termo.arquivo_url || ''}
                placeholder="https://..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Salvar
              </button>
              <Link href="/admin/documentos/termos" className="admin-btn admin-btn-secondary">
                ❌ Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Conteúdo do Documento */}
      {termo.documentos_modelo?.conteudo && (
        <div className="admin-card" style={{ maxWidth: '900px', margin: '2rem auto 0' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Conteúdo do Documento</h2>
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--admin-bg)',
            borderRadius: '0.6rem',
            border: '1px solid var(--admin-border)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            maxHeight: '400px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}>
            {termo.documentos_modelo.conteudo}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditTermoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditTermoContent id={params.id} />
    </Suspense>
  );
}
