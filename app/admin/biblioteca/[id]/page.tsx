import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getObraById, updateObra, toggleObraStatus, deleteExemplar } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Obra - Admin GEEF',
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  try {
    await updateObra(id, {
      titulo: (formData.get('titulo') as string) || undefined,
      autor: (formData.get('autor') as string) || undefined,
      editora: (formData.get('editora') as string) || undefined,
      isbn: (formData.get('isbn') as string) || undefined,
      categoria: (formData.get('categoria') as string) || undefined,
      sinopse: (formData.get('sinopse') as string) || undefined,
      capa_url: (formData.get('capa_url') as string) || undefined,
      publico: (formData.get('publico') as string) || undefined,
    });

    redirect(`/admin/biblioteca/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar obra:', error);
    throw error;
  }
}

async function handleToggleStatus(id: string, novoStatus: boolean) {
  'use server';

  try {
    await toggleObraStatus(id, novoStatus);
    redirect(`/admin/biblioteca/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}

async function handleDeleteExemplar(obraId: string, exemplarId: string) {
  'use server';

  try {
    await deleteExemplar(exemplarId);
    redirect(`/admin/biblioteca/${obraId}`);
  } catch (error) {
    console.error('Erro ao deletar exemplar:', error);
    throw error;
  }
}

async function EditObraContent({ id }: { id: string }) {
  const obra = await getObraById(id);
  const categorias = ['Espiritismo', 'Religião', 'Filosofia', 'Autoajuda', 'Infantil', 'Juventude', 'Ficção', 'Outro'];

  const disponiveis = obra.exemplares?.filter((e: any) => e.situacao === 'disponivel').length || 0;
  const emprestados = obra.exemplares?.filter((e: any) => e.situacao === 'emprestado').length || 0;
  const reservados = obra.exemplares?.filter((e: any) => e.situacao === 'reservado').length || 0;

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Obra</h1>
          <p className="admin-page-subtitle">{obra.titulo}</p>
        </div>
        <form action={() => handleToggleStatus(id, !obra.ativo)}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: obra.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
              color: obra.ativo ? '#22c55e' : '#6b7280',
              border: `1px solid ${obra.ativo ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
            }}
          >
            {obra.ativo ? '✓ Ativo' : '○ Inativo'}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Total</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: 600 }}>{obra.exemplares?.length || 0}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Disponíveis</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: 600, color: '#22c55e' }}>{disponiveis}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Emprestados</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: 600, color: '#f97316' }}>{emprestados}</p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Reservados</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: 600, color: '#a855f7' }}>{reservados}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Informações da Obra</h2>

        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={obra.titulo}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Autor</label>
              <input type="text" name="autor" defaultValue={obra.autor || ''} />
            </div>
            <div className="admin-form-group">
              <label>Editora</label>
              <input type="text" name="editora" defaultValue={obra.editora || ''} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>ISBN</label>
              <input type="text" name="isbn" defaultValue={obra.isbn || ''} />
            </div>
            <div className="admin-form-group">
              <label>Categoria</label>
              <select
                name="categoria"
                defaultValue={obra.categoria || ''}
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
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Público Alvo</label>
            <select
              name="publico"
              defaultValue={obra.publico || 'adulto'}
              style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}
            >
              <option value="adulto">Adulto</option>
              <option value="jovem">Jovem</option>
              <option value="infantil">Infantil</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Sinopse</label>
            <textarea
              name="sinopse"
              rows={4}
              defaultValue={obra.sinopse || ''}
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
            <label>URL da Capa</label>
            <input
              type="url"
              name="capa_url"
              defaultValue={obra.capa_url || ''}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar
            </button>
            <Link href="/admin/biblioteca" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Exemplares */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>
            📚 Exemplares ({obra.exemplares?.length || 0})
          </h2>
          <Link href={`/admin/biblioteca/${id}/novo-exemplar`} className="admin-btn admin-btn-small">
            ➕ Novo Exemplar
          </Link>
        </div>

        {obra.exemplares && obra.exemplares.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {obra.exemplares.map((exemplar: any) => (
              <div
                key={exemplar.id}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--admin-bg)',
                  borderRadius: '0.6rem',
                  border: '1px solid var(--admin-border)',
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 120px 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: 'var(--muted)' }}>Código</p>
                  <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{exemplar.codigo}</p>
                </div>
                <div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: 'var(--muted)' }}>Localização</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{exemplar.localizacao || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: 'var(--muted)' }}>Origem</p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{exemplar.origem || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: 'var(--muted)' }}>Situação</p>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.6rem',
                    backgroundColor:
                      exemplar.situacao === 'disponivel' ? 'rgba(34, 197, 94, 0.1)' :
                      exemplar.situacao === 'emprestado' ? 'rgba(251, 146, 60, 0.1)' :
                      exemplar.situacao === 'reservado' ? 'rgba(168, 85, 247, 0.1)' :
                      exemplar.situacao === 'danificado' ? 'rgba(239, 68, 68, 0.1)' :
                      'rgba(107, 114, 128, 0.1)',
                    color:
                      exemplar.situacao === 'disponivel' ? '#22c55e' :
                      exemplar.situacao === 'emprestado' ? '#f97316' :
                      exemplar.situacao === 'reservado' ? '#a855f7' :
                      exemplar.situacao === 'danificado' ? '#ef4444' :
                      '#6b7280',
                    borderRadius: '0.3rem',
                    fontSize: '0.85rem',
                  }}>
                    {exemplar.situacao}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/biblioteca/${id}/exemplar/${exemplar.id}`} className="admin-btn admin-btn-small">
                    ✏️
                  </Link>
                  <form action={() => handleDeleteExemplar(id, exemplar.id)} style={{ display: 'inline' }}>
                    <button
                      type="submit"
                      className="admin-btn"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                      }}
                      onClick={(e) => {
                        if (!confirm('Tem certeza que deseja deletar este exemplar?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhum exemplar cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default function EditObraPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditObraContent id={params.id} />
    </Suspense>
  );
}
