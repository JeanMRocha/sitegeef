import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDiretoriaById, updateDiretoria, getCargoOcupacoes, createCargoOcupacao, getPessoasDisponiveis, getCargos } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Diretoria - Admin GEEF',
};

async function handleSubmitDiretoria(id: string, formData: FormData) {
  'use server';

  try {
    await updateDiretoria(id, {
      nome: (formData.get('nome') as string) || undefined,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
      data_fim: (formData.get('data_fim') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
    });

    redirect(`/admin/governanca/diretorias/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function handleAssignarCargo(id: string, formData: FormData) {
  'use server';

  try {
    await createCargoOcupacao({
      pessoa_id: formData.get('pessoa_id') as string,
      cargo_id: formData.get('cargo_id') as string,
      diretoria_id: id,
      data_inicio: (formData.get('data_inicio') as string) || undefined,
    });

    redirect(`/admin/governanca/diretorias/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function DiretoriaContent({ id }: { id: string }) {
  const diretoria = await getDiretoriaById(id);
  const ocupacoes = await getCargoOcupacoes(id);
  const pessoas = await getPessoasDisponiveis();
  const cargos = await getCargos();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{diretoria.nome}</h1>
          <p className="admin-page-subtitle">
            {diretoria.data_inicio ? new Date(diretoria.data_inicio).toLocaleDateString('pt-BR') : 'Data não definida'} a {diretoria.data_fim ? new Date(diretoria.data_fim).toLocaleDateString('pt-BR') : 'Data não definida'}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Diretoria</h2>
        <form action={(formData) => handleSubmitDiretoria(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={diretoria.nome}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Data de Início</label>
              <input
                type="date"
                name="data_inicio"
                defaultValue={diretoria.data_inicio ? new Date(diretoria.data_inicio).toISOString().split('T')[0] : ''}
              />
            </div>

            <div className="admin-form-group">
              <label>Data de Término</label>
              <input
                type="date"
                name="data_fim"
                defaultValue={diretoria.data_fim ? new Date(diretoria.data_fim).toISOString().split('T')[0] : ''}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Status</label>
            <select
              name="status"
              defaultValue={diretoria.status || 'ativa'}
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
              <option value="ativa">✓ Ativa</option>
              <option value="inativa">✕ Inativa</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Observações</label>
            <textarea
              name="observacoes"
              defaultValue={diretoria.observacoes || ''}
              placeholder="Informações adicionais..."
              rows={3}
              style={{
                width: '100%',
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

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          Membros da Diretoria ({ocupacoes.length})
        </h2>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '0.6rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #3b82f6',
        }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Atribuir Cargo</h3>
          <form action={(formData) => handleAssignarCargo(id, formData)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Cargo</label>
              <select
                name="cargo_id"
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
                {cargos.map((cargo: any) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Data Início</label>
              <input
                type="date"
                name="data_inicio"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-small" style={{ gridColumn: '1 / -1' }}>
              ➕ Atribuir Cargo
            </button>
          </form>
        </div>

        {ocupacoes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pessoa</th>
                  <th>Cargo</th>
                  <th>Data Início</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ocupacoes.map((ocupacao: any) => (
                  <tr key={ocupacao.id}>
                    <td style={{ fontWeight: 500 }}>
                      {ocupacao.pessoa?.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {ocupacao.cargo?.nome}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {ocupacao.data_inicio ? new Date(ocupacao.data_inicio).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: ocupacao.status === 'ativo' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        color: ocupacao.status === 'ativo' ? '#22c55e' : '#6b7280',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {ocupacao.status === 'ativo' ? '✓ Ativo' : '✕ Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum membro nesta diretoria.</p>
        )}
      </div>
    </div>
  );
}

export default async function DiretoriaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <DiretoriaContent id={resolvedParams.id} />
    </Suspense>
  );
}
