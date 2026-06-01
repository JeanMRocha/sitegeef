import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReservaById, cancelarReserva, confirmarReserva, getExemplaresdisponiveisParaReserva } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Reserva - Admin GEEF',
};

type ReservaDetalhe = {
  id: string;
  posicao_fila: number;
  criado_em: string;
  obra_id: string;
  pessoas?: { nome?: string | null } | null;
  obras?: { titulo?: string | null; autor?: string | null } | null;
};

type ExemplarReserva = {
  id: string;
  codigo: string;
  situacao: string;
};

async function handleCancel(id: string) {
  'use server';

  try {
    await cancelarReserva(id);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/reservas', { variant: 'success', message: 'Reserva cancelada.' }));
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/reservas', { variant: 'error', message: 'Não foi possível cancelar a reserva.' }));
    return;
  }
}

async function handleConfirm(id: string, formData: FormData) {
  'use server';

  try {
    const exemplar_id = formData.get('exemplar_id') as string;
    await confirmarReserva(id, exemplar_id);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/reservas', { variant: 'success', message: 'Reserva confirmada.' }));
  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/reservas', { variant: 'error', message: 'Não foi possível confirmar a reserva.' }));
    return;
  }
}

async function ReservaContent({ id }: { id: string }) {
  const reserva = (await getReservaById(id)) as ReservaDetalhe | null;
  if (!reserva) {
    notFound();
  }
  const exemplares = (await getExemplaresdisponiveisParaReserva(reserva.obra_id)) as ExemplarReserva[];
  const exemplaresDisponiveis = exemplares.filter((e) => e.situacao === 'disponivel');

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
        <form action={() => handleCancel(id)}>
          <button
            type="submit"
            className="admin-btn admin-btn-secondary admin-btn-danger"
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
      <div className="admin-card panel-accent-card">
        <div className="area-panel-grid grid-auto-220">
          <div>
            <p className="text-xs-muted">Pessoa</p>
            <p className="text-sm-500">
              {reserva.pessoas?.nome}
            </p>
          </div>
          <div>
            <p className="text-xs-muted">Espera</p>
            <p className="text-sm-500">
              {diasEsperando} dias
            </p>
          </div>
          <div>
            <p className="text-xs-muted">Exemplares Disponíveis</p>
            <p className="text-sm-500">
              {exemplaresDisponiveis.length}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmação */}
      {exemplaresDisponiveis.length > 0 && (
        <div className="admin-card form-panel-centered-sm mb-2">
          <h2 className="form-card-title">Confirmar Reserva</h2>
          <p className="text-sm-muted">
            Exemplar disponível detectado. Confirme a reserva selecionando o exemplar.
          </p>

          <form action={(formData) => handleConfirm(id, formData)}>
            <LgpdFormNotice text="Usamos estes dados para confirmar a reserva e manter a fila de espera." />
            <div className="admin-form-group">
              <label>Exemplar Disponível *</label>
              <select
                name="exemplar_id"
                required
                className="profile-form-input"
              >
                <option value="">— Selecione —</option>
                {exemplaresDisponiveis.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.codigo}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Confirmar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detalhes */}
      <div className="admin-card form-panel-centered-sm">
        <h2 className="form-card-title">Detalhes</h2>

        <div className="area-panel-grid grid-auto-220">
          <div>
            <p className="text-xs-muted">Obra</p>
            <p className="text-sm-500">
              {reserva.obras?.titulo}
            </p>
            {reserva.obras?.autor && (
              <p className="text-xs-muted mt-035">
                {reserva.obras.autor}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs-muted">Data Reserva</p>
            <p className="text-sm-500">
              {new Date(reserva.criado_em).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="content-surface-note-bordered">
          <p className="text-xs-muted">Exemplares</p>
          <div className="atendimento-list mt-075">
            {exemplares.map((e) => (
              <div
                key={e.id}
                className="profile-panel"
              >
                <span>{e.codigo}</span>
                <span className={e.situacao === 'disponivel' ? 'inline-status inline-status-success' : 'inline-status inline-status-primary'}>
                  {e.situacao}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions-row">
          <Link href="/admin/biblioteca/reservas" className="admin-btn admin-btn-secondary">
            ← Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}

type ReservaParams = {
  id: string;
};

export default async function ReservaPage({ params }: { params: Promise<ReservaParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <ReservaContent id={resolvedParams.id} />
    </Suspense>
  );
}
