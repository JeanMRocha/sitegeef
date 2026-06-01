import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
  addMembro,
  getDepartamentoById,
  getPessoasDisponiveis,
  removeMembro,
  toggleDepartamentoStatus,
  updateDepartamento,
} from '../actions';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Departamento - Admin GEEF',
};

type DepartamentoMembro = {
  id: string;
  cargo?: string | null;
  desde?: string | null;
  pessoas?: {
    nome?: string | null;
    email?: string | null;
  } | null;
};

type DepartamentoDetalhe = {
  id: string;
  nome: string;
  descricao?: string | null;
  coordenador_id?: string | null;
  vice_id?: string | null;
  ativo: boolean;
  departamento_membros?: DepartamentoMembro[] | null;
};

type PessoaDisponivel = {
  id: string;
  nome: string | null;
  email?: string | null;
};

type DepartamentoParams = {
  id: string;
};

async function handleUpdate(id: string, formData: FormData) {
  'use server';

  const nome = String(formData.get('nome') || '').trim();
  const descricao = String(formData.get('descricao') || '').trim();
  const coordenadorId = String(formData.get('coordenador_id') || '').trim();
  const viceId = String(formData.get('vice_id') || '').trim();

  const result = await updateDepartamento(id, {
    nome,
    descricao: descricao || undefined,
    coordenador_id: coordenadorId || undefined,
    vice_id: viceId || undefined,
  });

  if (!result?.success) {
    redirect(
      buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
        variant: 'error',
        message: 'Não foi possível salvar o departamento.',
      })
    );
  }

  redirect(
    buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
      variant: 'success',
      message: 'Departamento salvo.',
    })
  );
}

async function handleToggle(id: string, ativo: boolean) {
  'use server';

  const result = await toggleDepartamentoStatus(id, ativo);

  if (!result?.success) {
    redirect(
      buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
        variant: 'error',
        message: 'Não foi possível alterar o status.',
      })
    );
  }

  redirect(
    buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
      variant: 'success',
      message: ativo ? 'Departamento ativado.' : 'Departamento inativado.',
    })
  );
}

async function handleAddMember(id: string, formData: FormData) {
  'use server';

  const pessoaId = String(formData.get('pessoa_id') || '').trim();
  const cargo = String(formData.get('cargo') || '').trim();
  const desde = String(formData.get('desde') || '').trim();

  if (!pessoaId) {
    redirect(
      buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
        variant: 'error',
        message: 'Selecione uma pessoa.',
      })
    );
  }

  const result = await addMembro(id, pessoaId, cargo || undefined, desde || undefined);

  if (!result?.success) {
    redirect(
      buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
        variant: 'error',
        message: 'Não foi possível adicionar o membro.',
      })
    );
  }

  redirect(
    buildFlashNoticeUrl(`/admin/departamentos/${id}`, {
      variant: 'success',
      message: 'Membro adicionado.',
    })
  );
}

async function handleRemoveMember(departamentoId: string, membroId: string) {
  'use server';

  const result = await removeMembro(membroId);

  if (!result?.success) {
    redirect(
      buildFlashNoticeUrl(`/admin/departamentos/${departamentoId}`, {
        variant: 'error',
        message: 'Não foi possível remover o membro.',
      })
    );
  }

  redirect(
    buildFlashNoticeUrl(`/admin/departamentos/${departamentoId}`, {
      variant: 'success',
      message: 'Membro removido.',
    })
  );
}

async function DepartamentoContent({ id }: { id: string }) {
  const [departamentoRaw, pessoasRaw] = await Promise.all([getDepartamentoById(id), getPessoasDisponiveis()]);
  const departamento = departamentoRaw as DepartamentoDetalhe | null;
  const pessoas = pessoasRaw as PessoaDisponivel[];

  if (!departamento) {
    notFound();
  }

  const membros = departamento.departamento_membros ?? [];
  const coordenador = pessoas.find((p) => p.id === departamento.coordenador_id)?.nome || '—';
  const vice = pessoas.find((p) => p.id === departamento.vice_id)?.nome || '—';

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Estrutura</span>
          <h1 className="admin-page-title">{departamento.nome}</h1>
          <p className="admin-page-subtitle">Gestão de membros e responsáveis</p>
        </div>
        <form action={() => handleToggle(id, !departamento.ativo)} className="inline-form">
          <button
            type="submit"
            className={`admin-btn status-toggle-btn ${departamento.ativo ? 'status-toggle-btn--active' : 'status-toggle-btn--inactive'}`}
          >
            {departamento.ativo ? '✓ Ativo' : '○ Inativo'}
          </button>
        </form>
      </div>

      <div className="admin-card panel-accent-card">
        <div className="area-panel-grid grid-auto-220">
          <div className="area-panel-item">
            <p className="text-xs-muted">Membros</p>
            <p className="text-sm-500">{membros.length}</p>
          </div>
          <div className="area-panel-item">
            <p className="text-xs-muted">Coordenador</p>
            <p className="text-sm-500">{coordenador}</p>
          </div>
          <div className="area-panel-item">
            <p className="text-xs-muted">Vice</p>
            <p className="text-sm-500">{vice}</p>
          </div>
          <div className="area-panel-item">
            <p className="text-xs-muted">Status</p>
            <p className={departamento.ativo ? 'text-sm-500 text-success' : 'text-sm-500 text-danger'}>
              {departamento.ativo ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-card form-panel-centered-lg">
        <h2 className="form-card-title">Dados do Departamento</h2>

        <form action={(formData) => handleUpdate(id, formData)}>
          <div className="admin-form-group">
            <label>Nome *</label>
            <input type="text" name="nome" defaultValue={departamento.nome} className="profile-form-input" required />
          </div>

          <div className="admin-form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              rows={4}
              defaultValue={departamento.descricao || ''}
              className="profile-form-input"
            />
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Coordenador</label>
              <select
                name="coordenador_id"
                defaultValue={departamento.coordenador_id || ''}
                className="profile-form-input"
              >
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome || p.email || '—'}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Vice-Coordenador</label>
              <select name="vice_id" defaultValue={departamento.vice_id || ''} className="profile-form-input">
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome || p.email || '—'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ✅ Salvar Alterações
            </button>
            <Link href="/admin/departamentos" className="admin-btn admin-btn-secondary">
              ← Voltar
            </Link>
          </div>
        </form>
      </div>

      <div className="admin-card panel-accent-card">
        <div className="area-top-line">
          <h2 className="form-card-title">Adicionar membro</h2>
        </div>

        <form action={(formData) => handleAddMember(id, formData)}>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Pessoa *</label>
              <select name="pessoa_id" className="profile-form-input" required>
                <option value="">— Selecione —</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome || p.email || '—'}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Cargo</label>
              <input type="text" name="cargo" className="profile-form-input" placeholder="Ex.: Secretário" />
            </div>

            <div className="admin-form-group">
              <label>Desde</label>
              <input type="date" name="desde" className="profile-form-input" />
            </div>
          </div>

          <div className="form-actions-row">
            <button type="submit" className="admin-btn admin-btn-primary">
              ➕ Adicionar membro
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card panel-accent-card">
        <div className="area-top-line">
          <h2 className="form-card-title">Membros do Departamento</h2>
          <span className="page-pagination-label">{membros.length} registrados</span>
        </div>

        {membros.length > 0 ? (
          <div className="department-stack">
            {membros.map((membro) => {
              const membroDesde = membro.desde ? new Date(`${membro.desde}T00:00:00`) : null;

              return (
                <div key={membro.id} className="department-member-row">
                  <div>
                    <strong>{membro.pessoas?.nome || 'Pessoa'}</strong>
                    <p className="department-member-meta">
                      {membro.cargo || 'Sem cargo'}
                      {membroDesde ? ` • desde ${membroDesde.toLocaleDateString('pt-BR')}` : ''}
                      {membro.pessoas?.email ? ` • ${membro.pessoas.email}` : ''}
                    </p>
                  </div>
                  <form action={() => handleRemoveMember(id, membro.id)} className="inline-form">
                    <button
                      type="submit"
                      className="admin-btn admin-btn-secondary admin-btn-danger admin-btn-small"
                      onClick={(event) => {
                        if (!confirm('Remover este membro do departamento?')) {
                          event.preventDefault();
                        }
                      }}
                    >
                      Remover
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="area-empty">
            <p>Nenhum membro vinculado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function DepartamentoPage({ params }: { params: Promise<DepartamentoParams> }) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <DepartamentoContent id={resolvedParams.id} />
    </Suspense>
  );
}
