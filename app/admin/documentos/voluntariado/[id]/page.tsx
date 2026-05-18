import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServicoById, updateServico, encerraServico } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Serviço Voluntário - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateServico(id, {
      servico: (formData.get('servico') as string) || undefined,
      horarios: (formData.get('horarios') as string) || undefined,
      termo_url: (formData.get('termo_url') as string) || undefined,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/voluntariado/${id}`, { variant: 'success', message: 'Serviço salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/voluntariado/${id}`, { variant: 'error', message: 'Não foi possível salvar o serviço.' }));
    return;
  }
}

async function handleEncerrar(id: string, formData: FormData) {
  'use server';

  try {
    const data_fim = formData.get('data_fim') as string;
    await encerraServico(id, data_fim || new Date().toISOString().split('T')[0]);
    redirect(buildFlashNoticeUrl(`/admin/documentos/voluntariado/${id}`, { variant: 'success', message: 'Serviço encerrado.' }));
  } catch (error) {
    console.error('Erro ao encerrar serviço:', error);
    redirect(buildFlashNoticeUrl(`/admin/documentos/voluntariado/${id}`, { variant: 'error', message: 'Não foi possível encerrar o serviço.' }));
    return;
  }
}

async function EditServicoContent({ id }: { id: string }) {
  const servico = await getServicoById(id);

  if (!servico) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Serviço Voluntário</h1>
            <p className="admin-page-subtitle">Registro não encontrado.</p>
          </div>
        </div>

        <div className="admin-card">
          <p style={{ margin: 0, color: 'var(--muted)' }}>
            O serviço pode ter sido removido ou você não tem acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Serviço Voluntário</h1>
          <p className="admin-page-subtitle">{servico.pessoas?.nome} — {servico.departamentos?.nome}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {servico.status === 'ativo' && (
            <form action={(formData) => handleEncerrar(id, formData)} style={{ display: 'inline' }}>
              <input type="hidden" name="data_fim" value={new Date().toISOString().split('T')[0]} />
              <button
                type="submit"
                className="admin-btn"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
                onClick={(e) => {
                  if (!confirm('Tem certeza que deseja encerrar este serviço?')) {
                    e.preventDefault();
                  }
                }}
              >
                ✕ Encerrar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Status Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ marginBottom: '1rem', padding: '0.9rem 1rem', borderRadius: '0.75rem', background: 'rgba(138, 0, 90, 0.06)', color: 'var(--muted)', lineHeight: 1.6 }}>
          Mantenha o vínculo claro. Se o serviço terminar, registre o fim e preserve o histórico.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Departamento</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500 }}>{servico.departamentos?.nome}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Serviço</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{servico.servico}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</p>
            <p style={{ margin: '0.5rem 0' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.35rem 0.7rem',
                backgroundColor: servico.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                color: servico.status === 'ativo' ? '#22c55e' : '#6b7280',
                borderRadius: '0.4rem',
                fontSize: '0.85rem',
              }}>
                {servico.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {servico.status === 'ativo' && (
        <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Editar Informações</h2>

          <form action={(formData) => handleUpdate(id, formData)}>
            <div className="admin-form-group">
              <label>Descrição do Serviço</label>
              <input
                type="text"
                name="servico"
                defaultValue={servico.servico}
              />
            </div>

            <div className="admin-form-group">
              <label>Horários</label>
              <input
                type="text"
                name="horarios"
                defaultValue={servico.horarios || ''}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="admin-form-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  name="data_inicio"
                  defaultValue={servico.data_inicio || ''}
                />
              </div>
              <div className="admin-form-group">
                <label>Data de Término</label>
                <input
                  type="date"
                  name="data_fim"
                  defaultValue={servico.data_fim || ''}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>URL do termo</label>
              <input
                type="url"
                name="termo_url"
                defaultValue={servico.termo_url || ''}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Salvar
              </button>
              <Link href="/admin/documentos/voluntariado" className="admin-btn admin-btn-secondary">
                ❌ Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Histórico</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '50%', marginTop: '0.5rem', flexShrink: 0 }} />
            <div>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', fontWeight: 500 }}>Serviço iniciado</p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {new Date(servico.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {servico.data_fim && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#6b7280', borderRadius: '50%', marginTop: '0.5rem', flexShrink: 0 }} />
              <div>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', fontWeight: 500 }}>Serviço finalizado</p>
                <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {new Date(servico.data_fim + 'T00:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function EditServicoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditServicoContent id={resolvedParams.id} />
    </Suspense>
  );
}
