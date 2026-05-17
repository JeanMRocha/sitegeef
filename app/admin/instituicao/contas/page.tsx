import Link from 'next/link';
import { redirect } from 'next/navigation';
import { addContaBancaria, deleteContaBancaria, getContasBancarias } from '../actions';

export const metadata = {
  title: 'Contas Bancárias - Admin GEEF',
};

export const dynamic = 'force-dynamic';

async function handleAddConta(formData: FormData) {
  'use server';

  await addContaBancaria({
    nome: (formData.get('nome') as string) || 'Conta bancária',
    banco: (formData.get('banco') as string) || undefined,
    agencia: (formData.get('agencia') as string) || undefined,
    conta: (formData.get('conta') as string) || undefined,
    tipo_conta: (formData.get('tipo_conta') as string) || undefined,
    titular: (formData.get('titular') as string) || undefined,
    cpf_cnpj_titular: (formData.get('cpf_cnpj_titular') as string) || undefined,
    chave_pix: (formData.get('chave_pix') as string) || undefined,
    tipo_chave_pix: (formData.get('tipo_chave_pix') as string) || undefined,
    finalidade: (formData.get('finalidade') as string) || undefined,
    visibilidade: (formData.get('visibilidade') as string) || undefined,
  });

  redirect('/admin/instituicao/contas');
}

async function handleDeleteConta(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id === 'string' && id) {
    await deleteContaBancaria(id);
  }

  redirect('/admin/instituicao/contas');
}

export default async function ContasInstituicaoPage() {
  const contas = await getContasBancarias();

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Contas bancárias</h1>
          </div>
          <Link href="/admin/instituicao" className="profile-form-btn profile-form-btn-secondary">
            Voltar
          </Link>
        </div>
        <p className="area-subtitle">Contas e chaves PIX vinculadas à instituição.</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          {contas.length > 0 ? (
            <div className="module-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {contas.map((conta: any) => (
                <div key={conta.id} className="area-panel-item">
                  <strong>{conta.nome || 'Conta bancária'}</strong>
                  <p style={{ marginTop: '0.5rem' }}>
                    {conta.banco && <>🏦 {conta.banco}<br /></>}
                    {conta.agencia && <>🏛️ Agência {conta.agencia}<br /></>}
                    {conta.conta && <>💳 Conta {conta.conta}<br /></>}
                    {conta.titular && <>👤 {conta.titular}<br /></>}
                    {conta.chave_pix && <>🔑 PIX cadastrado</>}
                  </p>
                  <form action={handleDeleteConta} style={{ marginTop: '0.75rem' }}>
                    <input type="hidden" name="id" value={conta.id} />
                    <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                      Remover
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="area-empty">Nenhuma conta registrada.</div>
          )}
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface" style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="area-section-title">
            <h2>Nova conta</h2>
            <p>Cadastre uma conta bancária ou PIX oficial.</p>
          </div>

          <form action={handleAddConta}>
            <div className="module-grid">
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Nome *</span>
                <input name="nome" className="profile-form-input" placeholder="Conta principal" required />
              </label>
              <label className="profile-form-field">
                <span>Banco</span>
                <input name="banco" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Agência</span>
                <input name="agencia" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Conta</span>
                <input name="conta" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Tipo de conta</span>
                <input name="tipo_conta" className="profile-form-input" placeholder="Corrente / Poupança" />
              </label>
              <label className="profile-form-field">
                <span>Titular</span>
                <input name="titular" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>CPF/CNPJ do titular</span>
                <input name="cpf_cnpj_titular" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Chave PIX</span>
                <input name="chave_pix" className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Tipo da chave PIX</span>
                <input name="tipo_chave_pix" className="profile-form-input" placeholder="CPF, CNPJ, email, telefone" />
              </label>
              <label className="profile-form-field">
                <span>Finalidade</span>
                <input name="finalidade" className="profile-form-input" placeholder="Dízimo, doações, despesas..." />
              </label>
              <label className="profile-form-field">
                <span>Visibilidade</span>
                <select name="visibilidade" className="profile-form-input" defaultValue="privada">
                  <option value="privada">Privada</option>
                  <option value="publica">Pública</option>
                </select>
              </label>
            </div>

            <div className="area-panel-grid" style={{ marginTop: '1.25rem' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">
                Salvar conta
              </button>
              <Link href="/admin/instituicao" className="profile-form-btn profile-form-btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
