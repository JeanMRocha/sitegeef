import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getGrupoById, updateGrupo, getGrupoMembros, adicionarMembro, updateMembroStatus, removerMembro, getReunioes, criarReuniao, getPessoasDisponiveis } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Grupo Mediúnico - Admin GEEF',
};

async function handleSubmitGrupo(id: string, formData: FormData) {
  'use server';

  try {
    await updateGrupo(id, {
      nome: (formData.get('nome') as string) || undefined,
      coordenador_id: (formData.get('coordenador_id') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(`/admin/mediunidade/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleAdicionarMembro(id: string, formData: FormData) {
  'use server';

  try {
    await adicionarMembro({
      grupo_id: id,
      pessoa_id: formData.get('pessoa_id') as string,
      status: (formData.get('status') as string) || 'ativo',
      desde: new Date().toISOString().split('T')[0],
    });

    redirect(`/admin/mediunidade/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleCriarReuniao(id: string, formData: FormData) {
  'use server';

  try {
    await criarReuniao({
      grupo_id: id,
      data: formData.get('data') as string,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(`/admin/mediunidade/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleRemoverMembro(id: string) {
  'use server';

  try {
    await removerMembro(id);
    redirect(new URL(document.referrer).pathname);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function GrupoContent({ id }: { id: string }) {
  const grupo = await getGrupoById(id);
  const membros = await getGrupoMembros(id);
  const reunioes = await getReunioes(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{grupo.nome}</h1>
          <p className="admin-page-subtitle">🔒 {grupo.coordenador?.nome ? `Coordenador: ${grupo.coordenador.nome}` : 'Sem coordenador definido'}</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Grupo</h2>
        <form action={(formData) => handleSubmitGrupo(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={grupo.nome}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Coordenador</label>
              <select
                name="coordenador_id"
                defaultValue={grupo.coordenador_id || ''}
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
                <option value="">Selecione um coordenador</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                name="status"
                defaultValue={grupo.status || 'ativo'}
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

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Membros ({membros.length})</h2>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '0.6rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #3b82f6',
        }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Adicionar Membro</h3>
          <form action={(formData) => handleAdicionarMembro(id, formData)} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Pessoa</label>
              <select
                name="pessoa_id"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Status</label>
              <select
                name="status"
                defaultValue="ativo"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                  backgroundColor: '#fff',
                }}
              >
                <option value="ativo">✓ Ativo</option>
                <option value="afastado">⏸️ Afastado</option>
                <option value="visitante">👤 Visitante</option>
              </select>
            </div>
            <button type="submit" className="admin-btn admin-btn-small" style={{ alignSelf: 'flex-end' }}>
              ➕ Adicionar
            </button>
          </form>
        </div>

        {membros.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Desde</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {membros.map((membro: any) => (
                  <tr key={membro.id}>
                    <td style={{ fontWeight: 500 }}>
                      {membro.pessoa?.nome}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: membro.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : membro.status === 'afastado' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: membro.status === 'ativo' ? '#22c55e' : membro.status === 'afastado' ? '#f97316' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {membro.status === 'ativo' && '✓ Ativo'}
                        {membro.status === 'afastado' && '⏸️ Afastado'}
                        {membro.status === 'visitante' && '👤 Visitante'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {membro.desde ? new Date(membro.desde).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>
                      <form action={() => handleRemoverMembro(membro.id)} style={{ display: 'inline' }}>
                        <button type="submit" className="admin-btn admin-btn-small" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
                          ✕ Remover
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum membro neste grupo.</p>
        )}
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Reuniões ({reunioes.length})</h2>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '0.6rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #3b82f6',
        }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Registrar Reunião</h3>
          <form action={(formData) => handleCriarReuniao(id, formData)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Data</label>
              <input
                type="date"
                name="data"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Observações</label>
              <input
                type="text"
                name="observacoes"
                placeholder="Tema, insights..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-small">
              ➕ Registrar
            </button>
          </form>
        </div>

        {reunioes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Observações</th>
                </tr>
              </thead>
              <tbody>
                {reunioes.map((reuniao: any) => (
                  <tr key={reuniao.id}>
                    <td style={{ fontWeight: 500 }}>
                      {new Date(reuniao.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {reuniao.observacoes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma reunião registrada.</p>
        )}
      </div>
    </div>
  );
}

export default function GrupoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <GrupoContent id={params.id} />
    </Suspense>
  );
}
