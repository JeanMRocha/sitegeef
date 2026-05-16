import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAssembleiaById, updateAssembleia } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Assembleia - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateAssembleia(id, {
      pauta: (formData.get('pauta') as string) || undefined,
      decisoes: (formData.get('decisoes') as string) || undefined,
      ata_url: (formData.get('ata_url') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(`/admin/governanca/assembleias/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function AssembleiaContent({ id }: { id: string }) {
  const assembleia = await getAssembleiaById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {assembleia.tipo === 'AGO' && '📊 AGO'}
            {assembleia.tipo === 'AGE' && '📋 AGE'}
            {assembleia.tipo === 'reuniao_diretoria' && '👔 Reunião Diretoria'}
            {assembleia.tipo === 'reuniao_departamento' && '🏢 Reunião Departamento'}
          </h1>
          <p className="admin-page-subtitle">{new Date(assembleia.data).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Assembleia</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Pauta</label>
            <textarea
              name="pauta"
              defaultValue={assembleia.pauta || ''}
              placeholder="Assuntos discutidos..."
              rows={4}
              style={{
                width: '100%',
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

          <div className="admin-form-group">
            <label>Decisões e Resoluções</label>
            <textarea
              name="decisoes"
              defaultValue={assembleia.decisoes || ''}
              placeholder="Decisões e resoluções tomadas..."
              rows={4}
              style={{
                width: '100%',
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

          <div className="admin-form-group">
            <label>Link para ATA (URL)</label>
            <input
              type="url"
              name="ata_url"
              defaultValue={assembleia.ata_url || ''}
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Status</label>
              <select
                name="status"
                defaultValue={assembleia.status || 'rascunho'}
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
                <option value="rascunho">📝 Rascunho</option>
                <option value="finalizada">✓ Finalizada</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/governanca/assembleias" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>

      {assembleia.ata_url && (
        <div className="admin-card" style={{ maxWidth: '800px', margin: '1rem auto 0' }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            📄 <strong>ATA disponível:</strong> <a href={assembleia.ata_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Acessar documento</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default async function AssembleiaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <AssembleiaContent id={resolvedParams.id} />
    </Suspense>
  );
}
