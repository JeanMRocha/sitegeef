import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCargoById, updateCargo } from '../../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Cargo - Admin GEEF',
};

type CargoPageParams = {
  id: string;
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateCargo(id, {
      nome: (formData.get('nome') as string) || undefined,
      descricao: (formData.get('descricao') as string) || undefined,
      nivel: (formData.get('nivel') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/governanca/cargos/${id}`, { variant: 'success', message: 'Cargo salvo.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/governanca/cargos/${id}`, { variant: 'error', message: 'Não foi possível salvar o cargo.' }));
    return;
  }
}

async function CargoContent({ id }: { id: string }) {
  const cargo = await getCargoById(id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{cargo.nome}</h1>
          <p className="admin-page-subtitle">
            {cargo.nivel ? (cargo.nivel === 'estrategico' ? '🎯 Nível Estratégico' : cargo.nivel === 'operacional' ? '⚙️ Nível Operacional' : '📋 Nível Coordenação') : 'Nível não definido'}
          </p>
        </div>
      </div>

      <div className="admin-card form-panel-centered">
        <h2 className="form-card-title">Editar Cargo</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              defaultValue={cargo.nome}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              defaultValue={cargo.descricao || ''}
              placeholder="Responsabilidades..."
              rows={3}
            />
          </div>

          <div className="admin-form-group">
            <label>Nível Hierárquico</label>
            <select
              name="nivel"
              defaultValue={cargo.nivel || ''}
            >
              <option value="">Selecione um nível</option>
              <option value="estrategico">🎯 Estratégico</option>
              <option value="operacional">⚙️ Operacional</option>
              <option value="coordenacao">📋 Coordenação</option>
            </select>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function CargoPage({ params }: { params: Promise<CargoPageParams> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <CargoContent id={resolvedParams.id} />
    </Suspense>
  );
}
