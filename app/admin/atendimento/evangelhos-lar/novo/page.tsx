import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createEvangelhoNoLar, getPessoasDisponiveis } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Evangelho no Lar - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const ev = await createEvangelhoNoLar({
      pessoa_id: formData.get('pessoa_id') as string,
      endereco: formData.get('endereco') as string,
      equipe: formData.get('equipe') as string,
      data: formData.get('data') as string,
      situacao: formData.get('situacao') as string,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/atendimento/evangelhos-lar/${ev.id}`, { variant: 'success', message: 'Evangelho no Lar criado.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl('/admin/atendimento/evangelhos-lar', { variant: 'error', message: 'Não foi possível criar o Evangelho no Lar.' }));
    return;
  }
}

async function NovoPage() {
  const pessoas = await getPessoasDisponiveis();
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Evangelho no Lar</h1>
          <p className="admin-page-subtitle">Registre uma atividade de evangelização familiar</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
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
            <label>Endereço *</label>
            <input
              type="text"
              name="endereco"
              placeholder="Rua, número, bairro"
              required
            />
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
              <label>Situação *</label>
              <select
                name="situacao"
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
                <option value="planejada">Planejada</option>
                <option value="realizada">Realizada</option>
                <option value="adiada">Adiada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Equipe *</label>
            <input
              type="text"
              name="equipe"
              placeholder="Nomes dos evangelizadores"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              placeholder="Notas sobre a atividade..."
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
              ✅ Registrar
            </button>
            <Link href="/admin/atendimento/evangelhos-lar" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoPage;
