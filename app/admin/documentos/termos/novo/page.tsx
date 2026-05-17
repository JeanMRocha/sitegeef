import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createTermo, getPessoasDisponiveis, getModelosDocumentos } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Termo Assinado - Admin GEEF',
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const termo = await createTermo({
      pessoa_id: formData.get('pessoa_id') as string,
      modelo_id: formData.get('modelo_id') as string,
      data_assinatura: (formData.get('data_assinatura') as string) || undefined,
      validade: (formData.get('validade') as string) || undefined,
      arquivo_url: (formData.get('arquivo_url') as string) || undefined,
      responsavel_id: (formData.get('responsavel_id') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/documentos/termos/${termo.id}`, { variant: 'success', message: 'Termo criado.' }));
  } catch (error) {
    console.error('Erro ao criar termo:', error);
    redirect(buildFlashNoticeUrl('/admin/documentos/termos', { variant: 'error', message: 'Não foi possível criar o termo.' }));
    return;
  }
}

export default async function NovoTermoPage() {
  const pessoas = await getPessoasDisponiveis();
  const modelos = await getModelosDocumentos();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Termo Assinado</h1>
          <p className="admin-page-subtitle">Registre um novo documento assinado</p>
        </div>
      </div>

      {/* Form */}
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
            <label>Modelo de Documento *</label>
            <select
              name="modelo_id"
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
              {modelos.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.tipo} - {m.titulo}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Data de Assinatura</label>
              <input
                type="date"
                name="data_assinatura"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="admin-form-group">
              <label>Validade</label>
              <input
                type="date"
                name="validade"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>URL do Arquivo (PDF/doc)</label>
            <input
              type="url"
              name="arquivo_url"
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-group">
            <label>Responsável (se menor de idade)</label>
            <select
              name="responsavel_id"
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="">— Nenhum —</option>
              {pessoas.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Registrar Termo
            </button>
            <Link href="/admin/documentos/termos" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
