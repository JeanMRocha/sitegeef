import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAtendimentoFraterno, getPessoasDisponiveis } from '../../actions';

export const metadata = {
  title: 'Novo Atendimento Fraterno - Admin GEEF',
};

export const dynamic = 'force-dynamic';

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const atend = await createAtendimentoFraterno({
      pessoa_id: formData.get('pessoa_id') as string,
      atendente_id: formData.get('atendente_id') as string,
      data: formData.get('data') as string,
      tipo: formData.get('tipo') as string,
      encaminhamento: (formData.get('encaminhamento') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      sigilo: formData.get('sigilo') === 'on',
    });

    redirect(`/admin/atendimento/fraterno/${atend.id}`);
  } catch (error) {
    console.error('Erro ao criar atendimento:', error);
    throw error;
  }
}

async function NovoAtendimentoPage() {
  const pessoas = await getPessoasDisponiveis();
  const hoje = new Date().toISOString().split('T')[0];
  const tipos = ['consolo', 'esclarecimento', 'orientação espiritual', 'apoio emocional', 'outro'];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Atendimento Fraterno</h1>
          <p className="admin-page-subtitle">Registre um atendimento fraterno</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Pessoa Atendida *</label>
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
              <label>Atendente *</label>
              <select
                name="atendente_id"
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
                defaultValue={hoje}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Tipo de Atendimento *</label>
              <select
                name="tipo"
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
              placeholder="Ex: Passe, atendimento medico"
            />
          </div>

          <div className="admin-form-group">
            <label>Observações (Sigiloso)</label>
            <textarea
              name="observacoes"
              placeholder="Notas sobre o atendimento... (este campo é sigiloso)"
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
              style={{ marginTop: '0.3rem' }}
            />
            <label htmlFor="sigilo" style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              🔒 Marcar este atendimento como sigiloso (só visível para pode_atendimento)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Atendimento
            </button>
            <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoAtendimentoPage;
