import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTurmaById, updateTurma, getCriancas, getEvangelizadores, addEvangelizador, removeEvangelizador, getPessoasDisponiveis, getAulas } from '../../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Turma - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateTurma(id, {
      nome: formData.get('nome') as string,
      faixa_etaria: formData.get('faixa_etaria') as string,
      horario: formData.get('horario') as string,
      sala: formData.get('sala') as string,
      capacidade: parseInt(formData.get('capacidade') as string),
      status: formData.get('status') as string,
    });

    redirect(`/admin/evangelizacao/turmas/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleAddEvangelizador(id: string, formData: FormData) {
  'use server';

  try {
    await addEvangelizador(id, formData.get('pessoa_id') as string);
    redirect(`/admin/evangelizacao/turmas/${id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function handleRemoveEvangelizador(id: string) {
  'use server';

  try {
    await removeEvangelizador(id);
    redirect(`/admin/evangelizacao/turmas/${(await getTurmaById(id)).id}`);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

async function TurmaContent({ id }: { id: string }) {
  const turma = await getTurmaById(id);
  const criancas = await getCriancas(id);
  const evangelizadores = await getEvangelizadores(id);
  const aulas = await getAulas(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{turma.nome}</h1>
          <p className="admin-page-subtitle">{turma.faixa_etaria} • {turma.horario}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0.8rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>Crianças</p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {criancas.length}/{turma.capacidade}
          </p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0.8rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>Evangelizadores</p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {evangelizadores.length}
          </p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0.8rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>Aulas</p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {aulas.length}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem' }}>Editar Turma</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={turma.nome}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Faixa Etária *</label>
              <input
                type="text"
                name="faixa_etaria"
                defaultValue={turma.faixa_etaria}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Horário *</label>
              <input
                type="text"
                name="horario"
                defaultValue={turma.horario}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>Sala *</label>
              <input
                type="text"
                name="sala"
                defaultValue={turma.sala}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Capacidade *</label>
              <input
                type="number"
                name="capacidade"
                defaultValue={turma.capacidade}
                min="1"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Status *</label>
            <select
              name="status"
              defaultValue={turma.status}
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
              <option value="ativa">✓ Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      {/* Evangelizadores */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem' }}>Evangelizadores</h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <form action={(formData) => handleAddEvangelizador(id, formData)}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                name="pessoa_id"
                required
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                }}
              >
                <option value="">— Selecione evangelizador —</option>
                {pessoas.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
                ➕ Adicionar
              </button>
            </div>
          </form>
        </div>

        {evangelizadores.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {evangelizadores.map((ev: any) => (
              <div
                key={ev.id}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--admin-bg)',
                  borderRadius: '0.4rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 500 }}>{ev.pessoa?.nome}</span>
                <form action={() => handleRemoveEvangelizador(ev.id)} style={{ display: 'inline' }}>
                  <button type="submit" className="admin-btn admin-btn-small" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.8rem',
                  }}>
                    ✕
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Nenhum evangelizador adicionado.</p>
        )}
      </div>

      {/* Links rápidos */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href={`/admin/evangelizacao/criancas?turma=${id}`} className="admin-btn admin-btn-secondary">
          👶 Ver Crianças
        </Link>
        <Link href="/admin/evangelizacao/turmas" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>
    </div>
  );
}

export default async function TurmaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <TurmaContent id={resolvedParams.id} />
    </Suspense>
  );
}
