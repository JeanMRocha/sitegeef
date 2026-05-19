import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createConsentimento, getPessoasDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Novo Consentimento LGPD - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const consentimento = await createConsentimento({
      pessoa_id: formData.get('pessoa_id') as string,
      finalidade: formData.get('finalidade') as string,
      base_legal: (formData.get('base_legal') as string) || undefined,
      canal_autorizado: (formData.get('canal_autorizado') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/consentimentos/${consentimento.id}`, { variant: 'success', message: 'Consentimento criado.' }));
  } catch (error) {
    console.error('Erro ao criar consentimento:', error);
    redirect(buildFlashNoticeUrl('/admin/documentos/consentimentos', { variant: 'error', message: 'Não foi possível criar o consentimento.' }));
    return;
  }
}

export default async function NovoConsentimentoPage() {
  const pessoas = await getPessoasDisponiveis();

  const basesLegais = [
    'Consentimento do titular',
    'Execução de contrato',
    'Cumprimento de obrigação legal',
    'Proteção da vida',
    'Interesse legítimo',
    'Interesse público',
    'Proteção de crédito',
    'Interesse público na defesa',
    'Outro',
  ];

  const canais = [
    'Email',
    'WhatsApp',
    'SMS',
    'Telefonema',
    'Presencialmente',
    'Aplicativo',
    'Site',
    'Todos',
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Consentimento LGPD</h1>
          <p className="admin-page-subtitle">Registre apenas o necessário. Base legal e finalidade devem ficar claras.</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.95rem 1rem', borderLeft: '3px solid var(--primary)' }}>
        <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
          Mantenha o texto objetivo, evite dados excessivos e confirme a base legal antes de salvar.
        </p>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <LgpdFormNotice
          title="Consentimento LGPD"
          text="A finalidade e a base legal precisam estar claras antes de registrar qualquer consentimento."
        />
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
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
            <label>Finalidade *</label>
            <input
              type="text"
              name="finalidade"
              placeholder="Ex: suporte ao usuário, comunicação autorizada, atendimento"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Base legal</label>
            <select
              name="base_legal"
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
              {basesLegais.map((base) => (
                <option key={base} value={base}>
                  {base}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Canais autorizados</label>
            <select
              name="canal_autorizado"
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="">— Nenhum especificado —</option>
              {canais.map((canal) => (
                <option key={canal} value={canal}>
                  {canal}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Consentimento
            </button>
            <Link href="/admin/documentos/consentimentos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
