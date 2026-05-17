import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createMovimento, getPlanoContas, getCentrosCusto } from '../../actions';
import { getPessoas } from '../../../pessoas/actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Lançamento - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const movimento = await createMovimento({
      tipo: formData.get('tipo') as string,
      conta_id: formData.get('conta_id') as string,
      categoria: formData.get('categoria') as string,
      descricao: formData.get('descricao') as string,
      valor: parseFloat(formData.get('valor') as string),
      data: formData.get('data') as string,
      centro_custo_id: (formData.get('centro_custo_id') as string) || undefined,
      pessoa_id: (formData.get('pessoa_id') as string) || undefined,
      comprovante_url: (formData.get('comprovante_url') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/financeiro/lancamentos/${movimento.id}`, { variant: 'success', message: 'Lançamento criado.' }));
  } catch (error) {
    console.error('Erro ao criar lançamento:', error);
    redirect(buildFlashNoticeUrl('/admin/financeiro/lancamentos', { variant: 'error', message: 'Não foi possível criar o lançamento.' }));
    return;
  }
}

async function NovoLancamentoPage() {
  const contas = await getPlanoContas('ativo');
  const centros = await getCentrosCusto(true);
  const { pessoas } = await getPessoas();
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Movimento financeiro</p>
            <h1 className="area-hero-title">Novo Lançamento</h1>
          </div>
        </div>
        <p className="area-subtitle">Registre uma entrada ou saída financeira.</p>
      </section>

      <section className="area-section">
        <div className="table-surface" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <form action={handleSubmit}>
            <div className="module-grid">
              <label className="profile-form-field">
                <span>Tipo *</span>
                <select name="tipo" required className="profile-form-input">
                  <option value="">— Selecione —</option>
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </label>
              <label className="profile-form-field">
                <span>Data *</span>
                <input type="date" name="data" defaultValue={hoje} required className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Descrição *</span>
                <input type="text" name="descricao" placeholder="Ex: Doação de Ana Silva" required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Conta contábil *</span>
                <select name="conta_id" required className="profile-form-input">
                  <option value="">— Selecione —</option>
                  {contas.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.codigo} - {c.nome}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Valor (R$) *</span>
                <input type="number" name="valor" placeholder="0.00" step="0.01" min="0" required className="profile-form-input" />
              </label>
              <label className="profile-form-field">
                <span>Centro de custo</span>
                <select name="centro_custo_id" className="profile-form-input">
                  <option value="">— Nenhum —</option>
                  {centros.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Pessoa</span>
                <select name="pessoa_id" className="profile-form-input">
                  <option value="">— Nenhuma —</option>
                  {pessoas.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </label>
              <label className="profile-form-field">
                <span>Categoria *</span>
                <input type="text" name="categoria" placeholder="Ex: Doação, Pagamento, Venda" required className="profile-form-input" />
              </label>
              <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                <span>URL do comprovante</span>
                <input type="url" name="comprovante_url" placeholder="https://..." className="profile-form-input" />
              </label>
            </div>

            <div className="area-panel-grid" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Registrar Lançamento</button>
              <Link href="/admin/financeiro/lancamentos" className="profile-form-btn profile-form-btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default NovoLancamentoPage;
