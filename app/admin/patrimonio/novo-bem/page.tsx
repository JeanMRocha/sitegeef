import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createBem, getPessoasDisponiveis } from '../actions';

export const metadata = {
  title: 'Novo Bem - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const bem = await createBem({
      nome: formData.get('nome') as string,
      categoria: (formData.get('categoria') as string) || undefined,
      localizacao: (formData.get('localizacao') as string) || undefined,
      conservacao: (formData.get('conservacao') as string) || undefined,
      responsavel_id: (formData.get('responsavel_id') as string) || undefined,
      data_aquisicao: (formData.get('data_aquisicao') as string) || undefined,
      valor: formData.get('valor') ? parseFloat(formData.get('valor') as string) : undefined,
      termo_doacao_url: (formData.get('termo_doacao_url') as string) || undefined,
    });

    redirect(`/admin/patrimonio/${bem.id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

export default async function NovoBemPage() {
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Bem</h1>
          <p className="admin-page-subtitle">Registrar um novo bem ou equipamento</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={handleSubmit}>
          <div className="admin-form-group">
            <label>Nome do Bem *</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Ar condicionado, Banco de madeira, Projetor..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Categoria</label>
              <select
                name="categoria"
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
                <option value="">Selecione uma categoria</option>
                <option value="eletronico">📱 Eletrônico</option>
                <option value="movel">🪑 Móvel</option>
                <option value="equipamento">🔧 Equipamento</option>
                <option value="veiculo">🚗 Veículo</option>
                <option value="imovel">🏠 Imóvel</option>
                <option value="outro">📦 Outro</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Responsável</label>
              <select
                name="responsavel_id"
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
          </div>

          <div className="admin-form-group">
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              placeholder="Sala, prédio, setor..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Conservação</label>
              <select
                name="conservacao"
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
                <option value="">Selecione estado</option>
                <option value="bom">✓ Bom</option>
                <option value="regular">⚠️ Regular</option>
                <option value="ruim">✕ Ruim</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Data de Aquisição</label>
              <input
                type="date"
                name="data_aquisicao"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              name="valor"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="admin-form-group">
            <label>Link para Termo de Doação (URL)</label>
            <input
              type="url"
              name="termo_doacao_url"
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Bem
            </button>
            <Link href="/admin/patrimonio" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
