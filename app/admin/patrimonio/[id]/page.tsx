import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getBemById, updateBem, deleteBem, getPessoasDisponiveis } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Bem - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateBem(id, {
      nome: (formData.get('nome') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
      localizacao: (formData.get('localizacao') as string) || undefined,
      conservacao: (formData.get('conservacao') as string) || undefined,
      responsavel_id: (formData.get('responsavel_id') as string) || undefined,
      data_aquisicao: (formData.get('data_aquisicao') as string) || undefined,
      valor: formData.get('valor') ? parseFloat(formData.get('valor') as string) : undefined,
      termo_doacao_url: (formData.get('termo_doacao_url') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/patrimonio/${id}`, { variant: 'success', message: 'Bem salvo.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/patrimonio/${id}`, { variant: 'error', message: 'Não foi possível salvar o bem.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteBem(id);
    redirect(buildFlashNoticeUrl('/admin/patrimonio', { variant: 'success', message: 'Bem excluído.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/patrimonio/${id}`, { variant: 'error', message: 'Não foi possível excluir o bem.' }));
    return;
  }
}

async function BemContent({ id }: { id: string }) {
  const bem = await getBemById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{bem.nome}</h1>
          <p className="admin-page-subtitle">
            {bem.categoria && (bem.categoria === 'eletronico' ? '📱 Eletrônico' : bem.categoria === 'movel' ? '🪑 Móvel' : bem.categoria === 'equipamento' ? '🔧 Equipamento' : bem.categoria === 'veiculo' ? '🚗 Veículo' : bem.categoria === 'imovel' ? '🏠 Imóvel' : '📦 Outro')}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Bem</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={bem.nome}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Categoria</label>
              <select
                name="categoria"
                defaultValue={bem.categoria || ''}
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
                defaultValue={bem.responsavel_id || ''}
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
              defaultValue={bem.localizacao || ''}
              placeholder="Sala, prédio, setor..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Conservação</label>
              <select
                name="conservacao"
                defaultValue={bem.conservacao || ''}
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
                defaultValue={bem.data_aquisicao ? new Date(bem.data_aquisicao).toISOString().split('T')[0] : ''}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Valor (R$)</label>
              <input
                type="number"
                name="valor"
                step="0.01"
                defaultValue={bem.valor || ''}
              />
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                name="status"
                defaultValue={bem.status || 'ativo'}
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
                <option value="ativo">✓ Ativo</option>
                <option value="inativo">✕ Inativo</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Link para Termo de Doação (URL)</label>
            <input
              type="url"
              name="termo_doacao_url"
              defaultValue={bem.termo_doacao_url || ''}
              placeholder="https://..."
            />
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#ef4444' }}>Zona de Perigo</h2>
        <form action={() => handleDelete(id)}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Excluir este bem permanentemente.
          </p>
          <button type="submit" className="admin-btn" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
            🗑️ Excluir Bem
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function BemPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <BemContent id={resolvedParams.id} />
    </Suspense>
  );
}
