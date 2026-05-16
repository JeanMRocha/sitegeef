import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getEscalaById, updateEscalaStatus, getFuncoes, getPessoasDisponiveis } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Escala - Admin GEEF',
};

function getMonthName(mes: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[mes - 1];
}

async function handlePublish(id: string) {
  'use server';

  try {
    await updateEscalaStatus(id, 'publicada');
    redirect(`/admin/escalas/${id}`);
  } catch (error) {
    console.error('Erro ao publicar escala:', error);
    throw error;
  }
}

async function EditEscalaContent({ id }: { id: string }) {
  const escala = await getEscalaById(id);
  const pessoas = await getPessoasDisponiveis();
  const funcoes = await getFuncoes();

  const totalFuncoes = escala.reunioes.reduce((acc: number, r: any) => acc + (r.escala_funcoes?.length || 0), 0);
  const totalPasse = escala.reunioes.reduce((acc: number, r: any) => acc + (r.escala_passe?.length || 0), 0);
  const totalEvangelizacao = escala.reunioes.reduce((acc: number, r: any) => acc + (r.escala_evangelizacao?.length || 0), 0);
  const totalPalestras = escala.reunioes.reduce((acc: number, r: any) => acc + (r.escala_palestras?.length || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Escala {getMonthName(escala.mes)} de {escala.ano}</h1>
          <p className="admin-page-subtitle">{escala.reunioes?.length || 0} reuniões agendadas</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {escala.status !== 'publicada' && (
            <form action={() => handlePublish(id)} style={{ display: 'inline' }}>
              <button
                type="submit"
                className="admin-btn"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                }}
              >
                ✓ Publicar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Status Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{escala.status}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Reuniões</p>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{escala.reunioes?.length || 0}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Funções</p>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{totalFuncoes}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Passe</p>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{totalPasse}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Evangelização</p>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{totalEvangelizacao}</p>
          </div>
        </div>
      </div>

      {/* Reuniões */}
      {escala.reunioes && escala.reunioes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
          {escala.reunioes.map((reuniao: any) => (
            <div key={reuniao.id} className="admin-card">
              <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>
                Quinta-feira, {new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}
              </h2>

              {/* Funções */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--text)', fontWeight: 600 }}>⚙️ Funções</h3>
                {reuniao.escala_funcoes && reuniao.escala_funcoes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {reuniao.escala_funcoes.map((ef: any) => (
                      <div
                        key={ef.id}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: 'var(--admin-bg)',
                          borderRadius: '0.6rem',
                          border: '1px solid var(--admin-border)',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr auto',
                          gap: '1rem',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Função</p>
                          <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{ef.funcoes?.nome}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Titular</p>
                          <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{ef.pessoas?.nome}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Substituto</p>
                          <p style={{ margin: '0.25rem 0' }}>{ef.substitutos?.nome || '—'}</p>
                        </div>
                        <Link href={`/admin/escalas/${id}/funcao/${ef.id}`} className="admin-btn admin-btn-small">
                          ✏️
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Nenhuma função escalada</p>
                )}
                <Link href={`/admin/escalas/${id}/reuniao/${reuniao.id}/nova-funcao`} className="admin-btn admin-btn-small" style={{ marginTop: '0.75rem' }}>
                  ➕ Adicionar Função
                </Link>
              </div>

              {/* Passe */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--text)', fontWeight: 600 }}>💫 Passe</h3>
                {reuniao.escala_passe && reuniao.escala_passe.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {reuniao.escala_passe
                      .sort((a: any, b: any) => a.posicao - b.posicao)
                      .map((ep: any) => (
                        <div
                          key={ep.id}
                          style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--admin-bg)',
                            borderRadius: '0.6rem',
                            border: '1px solid var(--admin-border)',
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr auto',
                            gap: '1rem',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Posição</p>
                            <p style={{ margin: '0.25rem 0', fontWeight: 600, fontSize: '1rem' }}>#{ep.posicao}</p>
                          </div>
                          <div>
                            <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Pessoa</p>
                            <p style={{ margin: '0.25rem 0', fontWeight: 500 }}>{ep.pessoas?.nome}</p>
                          </div>
                          <Link href={`/admin/escalas/${id}/passe/${ep.id}`} className="admin-btn admin-btn-small">
                            ✏️
                          </Link>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Nenhuma pessoa escalada para passe</p>
                )}
                <Link href={`/admin/escalas/${id}/reuniao/${reuniao.id}/novo-passe`} className="admin-btn admin-btn-small" style={{ marginTop: '0.75rem' }}>
                  ➕ Adicionar Passe
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
          <p>Nenhuma reunião escalada.</p>
        </div>
      )}

      {/* Ações */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/admin/escalas" className="admin-btn admin-btn-secondary">
          ← Voltar
        </Link>
      </div>
    </div>
  );
}

export default async function EditEscalaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditEscalaContent id={resolvedParams.id} />
    </Suspense>
  );
}
