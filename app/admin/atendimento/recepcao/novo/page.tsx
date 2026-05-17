import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createRecepcao } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Atendimento Recepção - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const recepcao = await createRecepcao({
      data: formData.get('data') as string,
      pessoas_atendidas: parseInt(formData.get('pessoas_atendidas') as string),
      motivo_geral: formData.get('motivo_geral') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/recepcao/${recepcao.id}`, { variant: 'success', message: 'Atendimento de recepção criado.' }));
  } catch (error) {
    console.error('Erro ao criar atendimento:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/recepcao', { variant: 'error', message: 'Não foi possível criar o atendimento.' }));
    return;
  }
}

export default function NovoAtendimentoPage() {
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Atendimento Recepção</h1>
          <p className="admin-page-subtitle">Registre um atendimento de recepção</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Data *</label>
              <input
                type="date"
                name="data"
                defaultValue={hoje}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Pessoas Atendidas *</label>
              <input
                type="number"
                name="pessoas_atendidas"
                placeholder="0"
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
              placeholder="Ex: Consultas diversas, informações"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Encaminhamento</label>
            <input
              type="text"
              name="encaminhamento"
              placeholder="Ex: Atendimento fraterno, passe"
            />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              placeholder="Notas sobre o atendimento..."
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
              ✅ Registrar Atendimento
            </button>
            <Link href="/admin/atendimento/recepcao" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
