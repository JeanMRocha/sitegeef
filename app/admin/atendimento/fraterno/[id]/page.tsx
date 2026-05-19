import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAtendimentoFraternoById, updateAtendimentoFraterno, deleteAtendimentoFraterno, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Atendimento Fraterno - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateAtendimentoFraterno(id, {
      pessoa_id: formData.get('pessoa_id') as string,
      atendente_id: formData.get('atendente_id') as string,
      data: formData.get('data') as string,
      tipo: formData.get('tipo') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      sigilo: formData.get('sigilo') === 'on',
      status: formData.get('status') as string,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/fraterno/${id}`, { variant: 'success', message: 'Atendimento salvo.' }));
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    redirect(buildFlashNoticeUrl(`/admin/atendimento/fraterno/${id}`, { variant: 'error', message: 'Não foi possível salvar o atendimento.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteAtendimentoFraterno(id);
    redirect(buildFlashNoticeUrl('/admin/atendimento/fraterno', { variant: 'success', message: 'Atendimento removido.' }));
  } catch (error) {
    console.error('Erro ao deletar:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/fraterno', { variant: 'error', message: 'Não foi possível remover o atendimento.' }));
    return;
  }
}

async function AtendimentoContent({ id }: { id: string }) {
  const atend = await getAtendimentoFraternoById(id);
  const pessoas = await getPessoasDisponiveis();
  const tipos = ['consolo', 'esclarecimento', 'orientação espiritual', 'apoio emocional', 'outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{atend.pessoas?.nome}</h1>
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
          <LgpdFormNotice text="Usamos estes dados para manter o registro do atendimento e o encaminhamento seguro." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Pessoa Atendida *</label>
              <select
                name="pessoa_id"
                defaultValue={atend.pessoas?.id}
                required
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
                {pessoas.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Atendente *</label>
              <select
                name="atendente_id"
                defaultValue={atend.atendente?.id}
                required
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
                {pessoas.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              <label>Tipo de Atendimento *</label>
              <select
                name="tipo"
                defaultValue={atend.tipo}
                required
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
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
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
            <label>Observações (Sigiloso)</label>
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

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}>
            <input
              type="checkbox"
              name="sigilo"
              id="sigilo"
              defaultChecked={atend.sigilo}
              style={{ marginTop: '0.3rem' }}
            />
            <label htmlFor="sigilo" style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              🔒 Marcar este atendimento como sigiloso
            </label>
          </div>

          <div className="admin-form-group">
            <label>Status *</label>
            <select
              name="status"
              defaultValue={atend.status}
              required
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="em_aberto">🔓 Em Aberto</option>
              <option value="encerrado">✓ Encerrado</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-secondary">
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
