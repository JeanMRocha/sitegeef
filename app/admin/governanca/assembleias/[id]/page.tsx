import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAssembleiaById, updateAssembleia } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Assembleia - Admin GEEF',
};

type AssembleiaPageParams = {
  id: string;
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

    redirect(buildFlashNoticeUrl(`/admin/governanca/assembleias/${id}`, { variant: 'success', message: 'Assembleia salva.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/governanca/assembleias/${id}`, { variant: 'error', message: 'Não foi possível salvar a assembleia.' }));
    return;
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

      <div className="admin-card form-panel-centered-lg">
        <h2 className="form-card-title">Editar Assembleia</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Pauta</label>
            <textarea
              name="pauta"
              defaultValue={assembleia.pauta || ''}
              placeholder="Assuntos discutidos..."
              rows={4}
            />
          </div>

          <div className="admin-form-group">
            <label>Decisões e Resoluções</label>
            <textarea
              name="decisoes"
              defaultValue={assembleia.decisoes || ''}
              placeholder="Decisões e resoluções tomadas..."
              rows={4}
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

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Status</label>
              <select name="status" defaultValue={assembleia.status || 'rascunho'}>
                <option value="rascunho">📝 Rascunho</option>
                <option value="finalizada">✓ Finalizada</option>
              </select>
            </div>
          </div>

          <div className="form-actions-row">
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
        <div className="admin-card form-panel-centered-lg mt-1">
          <p className="mb-0 text-sm-muted">
            📄 <strong>ATA disponível:</strong> <a href={assembleia.ata_url} target="_blank" rel="noopener noreferrer" className="text-primary">Acessar documento</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default async function AssembleiaPage({ params }: { params: Promise<AssembleiaPageParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <AssembleiaContent id={resolvedParams.id} />
    </Suspense>
  );
}
