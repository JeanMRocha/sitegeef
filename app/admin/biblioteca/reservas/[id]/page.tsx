import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getReservaById, cancelarReserva, confirmarReserva, getExemplaresdisponiveisParaReserva } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Reserva - Admin GEEF',
};

async function handleCancel(id: string) {
  'use server';

  try {
    await cancelarReserva(id);
    redirect('/admin/biblioteca/reservas');
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    throw error;
  }
}

async function handleConfirm(id: string, formData: FormData) {
  'use server';

  try {
    const exemplar_id = formData.get('exemplar_id') as string;
    await confirmarReserva(id, exemplar_id);
    redirect('/admin/biblioteca/reservas');
  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    throw error;
  }
}

async function ReservaContent({ id }: { id: string }) {
  const reserva = await getReservaById(id);
  const exemplares = await getExemplaresdisponiveisParaReserva(reserva.obra_id);

  const diasEsperando = Math.floor(
    (new Date().getTime() - new Date(reserva.criado_em).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reserva #{reserva.posicao_fila}</h1>
          <p className="admin-page-subtitle">{reserva.obras?.titulo}</p>
        </div>
        <form action={() => handleCancel(id)} style={{ display: 'inline' }}>
          <button
            type="submit"
            className="admin-btn"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            onClick={(e) => {
              if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
                e.preventDefault();
              }
            }}
          >
            ✕ Cancelar Reserva
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="admin-card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Pessoa</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
              {reserva.pessoas?.nome}
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Espera</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
              {diasEsperando} dias
            </p>
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Exemplares Disponíveis</p>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
              {exemplares.filter((e: any) => e.situacao === 'disponivel').length}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmação */}
      {exemplares.filter((e: any) => e.situacao === 'disponivel').length > 0 && (
        <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Confirmar Reserva</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Exemplar disponível detectado. Confirme a reserva selecionando o exemplar.
          </p>

          <form action={(formData) => handleConfirm(id, formData)}>
            <div className="admin-form-group">
              <label>Exemplar Disponível *</label>
              <select
                name="exemplar_id"
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
                {exemplares
                  .filter((e: any) => e.situacao === 'disponivel')
                  .map((e: any) => (
                    <option key={e.id} value={e.id}>
                      {e.codigo}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Confirmar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detalhes */}
      <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>Detalhes</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Obra</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', fontWeight: 500 }}>
              {reserva.obras?.titulo}
            </p>
            {reserva.obras?.autor && (
              <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                {reserva.obras.autor}
              </p>
            )}
          </div>
          <div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Data Reserva</p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
              {new Date(reserva.criado_em).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
          <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>Exemplares</p>
          <div style={{ margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {exemplares.map((e: any) => (
              <div
                key={e.id}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'var(--admin-bg)',
                  borderRadius: '0.4rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{e.codigo}</span>
                <span
                  style={{
                    padding: '0.2rem 0.5rem',
                    backgroundColor: e.situacao === 'disponivel' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                    color: e.situacao === 'disponivel' ? '#22c55e' : '#a855f7',
                    borderRadius: '0.3rem',
                    fontSize: '0.8rem',
                  }}
                >
                  {e.situacao}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <Link href="/admin/biblioteca/reservas" className="admin-btn admin-btn-secondary">
            ← Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ReservaPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ReservaContent id={resolvedParams.id} />
    </Suspense>
  );
}
