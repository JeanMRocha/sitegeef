import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getModeloById, updateModelo, toggleModeloStatus } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Modelo de Documento - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateModelo(id, {
      tipo: (formData.get('tipo') as string) || undefined,
      titulo: (formData.get('titulo') as string) || undefined,
      versao: (formData.get('versao') as string) || undefined,
      conteudo: (formData.get('conteudo') as string) || undefined,
    });

    redirect(`/admin/documentos/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar modelo:', error);
    throw error;
  }
}

async function handleToggleStatus(id: string, novoStatus: boolean) {
  'use server';

  try {
    await toggleModeloStatus(id, novoStatus);
    redirect(`/admin/documentos/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}

async function EditModeloContent({ id }: { id: string }) {
  const modelo = await getModeloById(id);

  const tipos = [
    'termo_imagem_adulto',
    'termo_imagem_menor',
    'voluntariado',
    'privacidade',
    'consentimento_geral',
    'outro',
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Modelo</h1>
          <p className="admin-page-subtitle">{modelo.titulo}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <form action={() => handleToggleStatus(id, !modelo.ativo)}>
            <button
              type="submit"
              className="admin-btn"
              style={{
                backgroundColor: modelo.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                color: modelo.ativo ? '#22c55e' : '#6b7280',
                border: `1px solid ${modelo.ativo ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
              }}
            >
              {modelo.ativo ? '✓ Ativo' : '○ Inativo'}
            </button>
          </form>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Tipo de Documento *</label>
            <select name="tipo" defaultValue={modelo.tipo} required style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
            }}>
              <option value="">— Selecione —</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.replace(/_/g, ' ').charAt(0).toUpperCase() + tipo.replace(/_/g, ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={modelo.titulo}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Versão</label>
            <input
              type="text"
              name="versao"
              defaultValue={modelo.versao || ''}
            />
          </div>

          <div className="admin-form-group">
            <label>Conteúdo do Documento</label>
            <textarea
              name="conteudo"
              rows={12}
              defaultValue={modelo.conteudo || ''}
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
              ✅ Salvar
            </button>
            <Link href="/admin/documentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>

        {/* Info */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--admin-border)', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Criado em:</strong> {new Date(modelo.criado_em).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function EditModeloPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditModeloContent id={resolvedParams.id} />
    </Suspense>
  );
}
