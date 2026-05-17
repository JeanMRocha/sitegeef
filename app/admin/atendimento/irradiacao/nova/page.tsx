import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createIrradiacao, getPessoasDisponiveis } from '../../actions';

export const metadata = {
  title: 'Nova Irradiação - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const irr = await createIrradiacao({
      solicitante_id: formData.get('solicitante_id') as string,
      nome_irradiacao: formData.get('nome_irradiacao') as string,
      motivo: formData.get('motivo') as string,
      periodo: formData.get('periodo') as string,
      confidencial: formData.get('confidencial') === 'on',
    });

    redirect(`/admin/atendimento/irradiacao/${irr.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function NovaPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Solicitação de Irradiação</h1>
          <p className="admin-page-subtitle">Registre uma solicitação de preces irradiadas</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Solicitante *</label>
            <select
              name="solicitante_id"
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
            <label>Nome da Irradiação *</label>
            <input
              type="text"
              name="nome_irradiacao"
              placeholder="Ex: Cura espiritual para João"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Motivo *</label>
            <textarea
              name="motivo"
              placeholder="Qual é o motivo da solicitação de irradiação?"
              rows={3}
              required
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
            <label>Período *</label>
            <input
              type="text"
              name="periodo"
              placeholder="Ex: 30 dias, conforme necessário"
              required
            />
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(249, 115, 22, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}>
            <input
              type="checkbox"
              name="confidencial"
              id="confidencial"
              style={{ marginTop: '0.3rem' }}
            />
            <label htmlFor="confidencial" style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              🔒 Marcar como confidencial (restrinja acesso)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar
            </button>
            <Link href="/admin/atendimento/irradiacao" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaPage;
