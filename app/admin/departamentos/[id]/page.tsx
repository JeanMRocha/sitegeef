import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDepartamentoById, updateDepartamento, addMembro, removeMembro, getPessoasDisponiveis, toggleDepartamentoStatus } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Departamento - Admin GEEF',
};

async function handleUpdate(deptId: string, formData: FormData) {
  'use server';

  try {
    await updateDepartamento(deptId, {
      nome: (formData.get('nome') as string) || undefined,
      descricao: (formData.get('descricao') as string) || undefined,
      coordenador_id: (formData.get('coordenador_id') as string) || undefined,
      vice_id: (formData.get('vice_id') as string) || undefined,
    });

    redirect(`/admin/departamentos/${deptId}`);
  } catch (error) {
    console.error('Erro ao atualizar departamento:', error);
    throw error;
  }
}

async function handleAddMembro(deptId: string, formData: FormData) {
  'use server';

  try {
    await addMembro(
      deptId,
      formData.get('pessoa_id') as string,
      (formData.get('cargo') as string) || undefined,
      (formData.get('desde') as string) || undefined
    );

    redirect(`/admin/departamentos/${deptId}`);
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    throw error;
  }
}

async function handleRemoveMembro(membroId: string, deptId: string) {
  'use server';

  try {
    await removeMembro(membroId);
    redirect(`/admin/departamentos/${deptId}`);
  } catch (error) {
    console.error('Erro ao remover membro:', error);
    throw error;
  }
}

async function EditDepartamentoContent({ id }: { id: string }) {
  const departamento = await getDepartamentoById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Departamento</h1>
          <p className="admin-page-subtitle">{departamento.nome}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Coluna 1: Dados do Departamento */}
        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-card">
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📋 Dados</h2>

            <div className="admin-form-group">
              <label>Nome *</label>
              <input type="text" name="nome" defaultValue={departamento.nome} required />
            </div>

            <div className="admin-form-group">
              <label>Descrição</label>
              <textarea
                name="descricao"
                defaultValue={departamento.descricao || ''}
                rows={4}
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
              <label>Coordenador</label>
              <select
                name="coordenador_id"
                defaultValue={departamento.coordenador_id || ''}
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
              <label>Vice-Coordenador</label>
              <select
                name="vice_id"
                defaultValue={departamento.vice_id || ''}
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

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Salvar
              </button>
              <Link href="/admin/departamentos" className="admin-btn admin-btn-secondary">
                ❌ Cancelar
              </Link>
            </div>
          </div>
        </form>

        {/* Coluna 2: Membros */}
        <div>
          {/* Adicionar Membro */}
          <form action={(formData) => handleAddMembro(id, formData)}>
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>👥 Adicionar Membro</h2>

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
                <label>Cargo</label>
                <input type="text" name="cargo" placeholder="Ex: Tesoureiro" />
              </div>

              <div className="admin-form-group">
                <label>Data de Entrada</label>
                <input type="date" name="desde" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
                ➕ Adicionar Membro
              </button>
            </div>
          </form>

          {/* Lista de Membros */}
          <div className="admin-card">
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>
              📋 Membros ({departamento.departamento_membros?.length || 0})
            </h2>

            {departamento.departamento_membros && departamento.departamento_membros.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {departamento.departamento_membros.map((membro: any) => (
                  <div
                    key={membro.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--admin-bg)',
                      borderRadius: '0.6rem',
                      border: '1px solid var(--admin-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{membro.pessoas?.nome}</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {membro.cargo || 'Membro'} {membro.desde && `· Desde ${new Date(membro.desde).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                    <form action={() => handleRemoveMembro(membro.id, id)}>
                      <button
                        type="submit"
                        className="admin-btn"
                        style={{
                          backgroundColor: 'rgba(200, 0, 0, 0.15)',
                          color: '#c00',
                          border: '1px solid rgba(200, 0, 0, 0.3)',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.8rem',
                        }}
                      >
                        ✕ Remover
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhum membro adicionado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditDepartamentoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditDepartamentoContent id={params.id} />
    </Suspense>
  );
}
