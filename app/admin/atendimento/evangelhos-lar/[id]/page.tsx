import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getEvangelhoNoLarById, updateEvangelhoNoLar, deleteEvangelhoNoLar, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Evangelho no Lar - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateEvangelhoNoLar(id, {
      pessoa_id: formData.get('pessoa_id') as string,
      endereco: formData.get('endereco') as string,
      equipe: formData.get('equipe') as string,
      data: formData.get('data') as string,
      situacao: formData.get('situacao') as string,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(`/admin/atendimento/evangelhos-lar/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteEvangelhoNoLar(id);
    redirect('/admin/atendimento/evangelhos-lar');
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function Content({ id }: { id: string }) {
  const ev = await getEvangelhoNoLarById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{ev.endereco}</h1>
          <p className="admin-page-subtitle">{ev.pessoas?.nome}</p>
        </div>
        <form action={() => handleDelete(id)} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            onClick={(e) => {
              if (!confirm('Deletar?')) e.preventDefault();
            }}
          >
            ✕ Deletar
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
              defaultValue={ev.pessoas?.id}
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
              defaultValue={ev.endereco}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Data *</label>
              <input
                type="date"
                name="data"
                defaultValue={ev.data}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Situação *</label>
              <select
                name="situacao"
                defaultValue={ev.situacao}
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
              defaultValue={ev.equipe}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              defaultValue={ev.observacoes || ''}
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
              ✅ Salvar
            </button>
            <Link href="/admin/atendimento/evangelhos-lar" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <Content id={resolvedParams.id} />
    </Suspense>
  );
}
