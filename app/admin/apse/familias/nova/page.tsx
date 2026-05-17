import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createFamilia, getPessoasDisponiveis } from '../../actions';

export const metadata = {
  title: 'Nova Família - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const familia = await createFamilia({
      responsavel_id: formData.get('responsavel_id') as string,
      endereco: formData.get('endereco') as string,
      membros: parseInt(formData.get('membros') as string),
      situacao: formData.get('situacao') as string,
    });

    redirect(`/admin/apse/familias/${familia.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

export default async function NovaFamiliaPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Família</h1>
          <p className="admin-page-subtitle">Registrar uma nova família assistida</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Responsável *</label>
            <select
              name="responsavel_id"
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
                backgroundColor: '#fff',
              }}
            >
              <option value="">Selecione um responsável</option>
              {pessoas.map((pessoa: any) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              placeholder="Rua, número, bairro..."
            />
          </div>

          <div className="admin-form-group">
            <label>Número de Membros *</label>
            <input
              type="number"
              name="membros"
              min="1"
              required
              placeholder="2"
            />
          </div>

          <div className="admin-form-group">
            <label>Situação</label>
            <textarea
              name="situacao"
              placeholder="Descreva a situação da família..."
              rows={3}
              style={{
                width: '100%',
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
              ✅ Registrar Família
            </button>
            <Link href="/admin/apse/familias" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
