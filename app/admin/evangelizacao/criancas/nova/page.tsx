import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createCrianca, getPessoasDisponiveis, getTurmas } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';
import { recordActionFailureEvent } from '@/lib/observability';

export const metadata = {
  title: 'Nova Criança - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const crianca = await createCrianca({
      pessoa_id: formData.get('pessoa_id') as string,
      responsavel_id: formData.get('responsavel_id') as string,
      turma_id: formData.get('turma_id') as string,
      restricoes: (formData.get('restricoes') as string) || undefined,
      autorizacoes: (formData.get('autorizacoes') as string) || undefined,
      consentimento_responsavel: formData.get('consentimento_responsavel') === 'on',
      consentimento_imagem: formData.get('consentimento_imagem') === 'on',
    });

    if (!crianca) {
      await recordActionFailureEvent({
        source: 'admin/evangelizacao/criancas',
        action: 'createCrianca',
        message: 'A action retornou sem criar a criança.',
      });
      redirect(buildFlashNoticeUrl('/admin/evangelizacao/criancas/nova', { variant: 'error', message: 'Não foi possível criar a criança.' }));
    }

    redirect(buildFlashNoticeUrl(`/admin/evangelizacao/criancas/${crianca.id}`, { variant: 'success', message: 'Criança criada.' }));
  } catch (error) {
    await recordActionFailureEvent({
      source: 'admin/evangelizacao/criancas',
      action: 'handleSubmit',
      message: 'Falha ao processar o cadastro da criança.',
      error,
    });
    redirect(buildFlashNoticeUrl('/admin/evangelizacao/criancas', { variant: 'error', message: 'Não foi possível criar a criança.' }));
    return;
  }
}

async function NovaPage() {
  const pessoas = await getPessoasDisponiveis();
  const turmas = await getTurmas();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Criança</h1>
          <p className="admin-page-subtitle">Registre uma criança no programa</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <LgpdFormNotice
          title="Dados de menores"
          text="Usamos os dados da criança e do responsável apenas para cadastro, segurança e acompanhamento das atividades."
        />
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Criança *</label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Turma *</label>
              <select
                name="turma_id"
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
                {turmas.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Responsável *</label>
              <select
                name="responsavel_id"
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

          <div className="admin-form-group">
            <label>Restrições</label>
            <textarea
              name="restricoes"
              placeholder="Ex: Alergias, dificuldades, necessidades especiais"
              rows={2}
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

          <div className="admin-form-group">
            <label>Autorizações</label>
            <textarea
              name="autorizacoes"
              placeholder="Ex: Autorizada para ir a passeios, participar de atividades especiais"
              rows={2}
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

          <div className="lgpd-consent-stack" style={{ marginTop: '1rem' }}>
            <label className="lgpd-consent-check">
              <input type="checkbox" name="consentimento_responsavel" required />
              <span>Autorizo o cadastro da criança pelo responsável legal.</span>
            </label>
            <label className="lgpd-consent-check">
              <input type="checkbox" name="consentimento_imagem" required />
              <span>Autorizo o uso de imagem/voz quando houver registro interno ou divulgação autorizada.</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar
            </button>
            <Link href="/admin/evangelizacao/criancas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaPage;
