import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createReserva, getPessoasDisponiveis, getObrasDisponiveis } from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';

export const metadata = {
  title: 'Nova Reserva - Admin GEEF',
};

type PessoaOption = {
  id: string;
  nome: string;
};

type ObraOption = {
  id: string;
  titulo: string;
  autor?: string | null;
};

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    await createReserva({
      pessoa_id: formData.get('pessoa_id') as string,
      obra_id: formData.get('obra_id') as string,
    });

    redirect(buildFlashNoticeUrl('/admin/biblioteca/reservas', { variant: 'success', message: 'Reserva criada.' }));
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    redirect(buildFlashNoticeUrl('/admin/biblioteca/reservas', { variant: 'error', message: 'Não foi possível criar a reserva.' }));
    return;
  }
}

export default async function NovaReservaPage() {
  const pessoas = (await getPessoasDisponiveis()) as PessoaOption[];
  const obras = (await getObrasDisponiveis()) as ObraOption[];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Nova Reserva</h1>
          <p className="admin-page-subtitle">Adicione pessoa à fila de espera</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card form-panel-centered-sm">
        <form action={handleSubmit}>
          <LgpdFormNotice text="Usamos os dados para registrar a reserva e organizar a fila de espera." />
          <div className="admin-form-group">
            <label>Pessoa *</label>
            <select
              name="pessoa_id"
              required
              className="profile-form-input"
            >
              <option value="">— Selecione —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Obra *</label>
            <select
              name="obra_id"
              required
              className="profile-form-input"
            >
              <option value="">— Selecione —</option>
              {obras.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titulo} {o.autor ? `- ${o.autor}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Criar Reserva
            </button>
            <Link href="/admin/biblioteca/reservas" className="admin-btn admin-btn-secondary">
              ❌ Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
