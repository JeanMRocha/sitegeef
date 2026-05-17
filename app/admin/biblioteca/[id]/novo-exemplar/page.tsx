import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createExemplar, getObraById } from '../../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Novo Exemplar - Admin GEEF',
};

async function handleSubmit(formData: FormData, obraId: string) {
  'use server';

  try {
    await createExemplar({
      obra_id: obraId,
      codigo: formData.get('codigo') as string,
      conservacao: (formData.get('conservacao') as string) || undefined,
      localizacao: (formData.get('localizacao') as string) || undefined,
      origem: (formData.get('origem') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${obraId}`, { variant: 'success', message: 'Exemplar adicionado.' }));
  } catch (error) {
    console.error('Erro ao criar exemplar:', error);
    redirect(buildFlashNoticeUrl(`/admin/biblioteca/${obraId}`, { variant: 'error', message: 'Não foi possível adicionar o exemplar.' }));
    return;
  }
}

export default async function NovoExemplarPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  const obra = await getObraById(resolvedParams.id);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Exemplar</h1>
          <p className="admin-page-subtitle">{obra.titulo}</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(formData, resolvedParams.id)}>
          <div className="admin-form-group">
            <label>Código do Exemplar *</label>
            <input
              type="text"
              name="codigo"
              placeholder="Ex: GEEF-001, BIBL-2024-001"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              placeholder="Ex: Prateleira A3, Armário 2"
            />
          </div>

          <div className="admin-form-group">
            <label>Conservação</label>
            <select
              name="conservacao"
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
              <option value="excelente">Excelente</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
              <option value="danificado">Danificado</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Origem</label>
            <select
              name="origem"
              defaultValue="acervo"
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="acervo">Acervo Institucional</option>
              <option value="compra">Compra</option>
              <option value="doacao">Doação</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Adicionar Exemplar
            </button>
            <Link href={`/admin/biblioteca/${resolvedParams.id}`} className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
