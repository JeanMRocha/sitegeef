import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getFamiliaById, updateFamilia, getAtendimentos, createAtendimento, getPessoasDisponiveis } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Família - Admin GEEF',
};

async function handleSubmitFamilia(id: string, formData: FormData) {
  'use server';

  try {
    await updateFamilia(id, {
      endereco: (formData.get('endereco') as string) || undefined,
      membros: formData.get('membros') ? parseInt(formData.get('membros') as string) : undefined,
      situacao: (formData.get('situacao') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(`/admin/apse/familias/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function handleRegistrarAtendimento(id: string, formData: FormData) {
  'use server';

  try {
    await createAtendimento({
      familia_id: id,
      pessoa_id: formData.get('pessoa_id') as string,
      data: formData.get('data') as string,
      tipo: formData.get('tipo') as string,
      descricao: (formData.get('descricao') as string) || undefined,
      responsavel_id: formData.get('responsavel_id') as string,
    });

    redirect(`/admin/apse/familias/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    return;
  }
}

async function FamiliaContent({ id }: { id: string }) {
  const familia = await getFamiliaById(id);
  const atendimentos = await getAtendimentos(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{familia.responsavel?.nome}</h1>
          <p className="admin-page-subtitle">{familia.membros} membro(s)</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Família</h2>
        <form action={(formData) => handleSubmitFamilia(id, formData)}>
          <div className="admin-form-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              defaultValue={familia.endereco || ''}
              placeholder="Rua, número, bairro..."
            />
          </div>

          <div className="admin-form-group">
            <label>Número de Membros</label>
            <input
              type="number"
              name="membros"
              defaultValue={familia.membros || ''}
              min="1"
            />
          </div>

          <div className="admin-form-group">
            <label>Situação</label>
            <textarea
              name="situacao"
              defaultValue={familia.situacao || ''}
              placeholder="Situação da família..."
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

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}>
            <input
              type="checkbox"
              name="status"
              id="status"
              value="ativa"
              defaultChecked={familia.status === 'ativa'}
            />
            <label htmlFor="status" style={{ fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
              ✓ Família ativa
            </label>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          Atendimentos ({atendimentos.length})
        </h2>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '0.6rem',
          marginBottom: '1.5rem',
          borderLeft: '4px solid #3b82f6',
        }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Registrar Atendimento</h3>
          <form action={(formData) => handleRegistrarAtendimento(id, formData)} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Pessoa Atendida</label>
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
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Tipo de Atendimento</label>
              <select
                name="tipo"
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
                <option value="visita">Visita</option>
                <option value="campanha">Campanha</option>
                <option value="cesta">Cesta Básica</option>
                <option value="encaminhamento">Encaminhamento</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Responsável</label>
              <select
                name="responsavel_id"
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Detalhes do atendimento..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                }}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-small">
              ➕ Registrar
            </button>
          </form>
        </div>

        {atendimentos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Pessoa</th>
                  <th>Responsável</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {atendimentos.map((atend: any) => (
                  <tr key={atend.id}>
                    <td style={{ fontSize: '0.9rem' }}>
                      {new Date(atend.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {atend.tipo === 'visita' && '🏠 Visita'}
                      {atend.tipo === 'campanha' && '📢 Campanha'}
                      {atend.tipo === 'cesta' && '🎁 Cesta'}
                      {atend.tipo === 'encaminhamento' && '➡️ Encaminhamento'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {atend.pessoa?.nome}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {atend.responsavel?.nome}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {atend.descricao || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum atendimento registrado.</p>
        )}
      </div>
    </div>
  );
}

export default async function FamiliaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <FamiliaContent id={id} />
    </Suspense>
  );
}
