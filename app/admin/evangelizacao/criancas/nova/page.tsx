import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createCrianca, getPessoasDisponiveis, getTurmas } from '../../actions';

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
    });

    redirect(`/admin/evangelizacao/criancas/${crianca.id}`);
  } catch (error) {
    console.error('Erro:', error);
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
