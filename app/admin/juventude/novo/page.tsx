import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createGrupo, getPessoasDisponiveis } from '../actions';

export const metadata = {
  title: 'Novo Grupo - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const grupo = await createGrupo({
      nome: formData.get('nome') as string,
      coordenador_id: formData.get('coordenador_id') as string,
      descricao: (formData.get('descricao') as string) || undefined,
    });

    redirect(`/admin/juventude/${grupo.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function NovoPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Grupo</h1>
          <p className="admin-page-subtitle">Crie um novo grupo de juventude</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome do Grupo *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Jovens Espíritas"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Coordenador *</label>
            <select
              name="coordenador_id"
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
            <label>Descrição</label>
            <textarea
              name="descricao"
              placeholder="Objetivo, atividades principais..."
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
              ✅ Criar Grupo
            </button>
            <Link href="/admin/juventude" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoPage;
