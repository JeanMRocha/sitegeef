import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { getUsuarioById, revokeLogin, updateUsuario } from '../actions';

export const metadata = {
  title: 'Editar Usuário - Admin GEEF',
};

const PERFIS = [
  'administrador',
  'diretoria',
  'secretaria',
  'financeiro',
  'bibliotecario',
  'livraria',
  'evangelizador',
  'coord_juventude',
  'coord_estudos',
  'coord_atendimento',
  'coord_passe',
  'coord_apse',
  'comunicacao',
  'patrimonio',
  'tarefeiro',
  'leitor',
  'voluntario',
  'publico',
];

type UsuarioDetalhe = {
  id: string;
  nome?: string | null;
  email?: string | null;
  perfil?: string | null;
  pessoas?: {
    nome?: string | null;
    email?: string | null;
  } | null;
  pode_escalas?: boolean | null;
  pode_biblioteca?: boolean | null;
  pode_livraria?: boolean | null;
  pode_financeiro?: boolean | null;
  pode_pessoas?: boolean | null;
  pode_publicar?: boolean | null;
  pode_mediunidade?: boolean | null;
  pode_atendimento?: boolean | null;
  pode_apse?: boolean | null;
};

type UsuarioParams = {
  id: string;
};

function resolvePerfilChipClass(perfil?: string | null) {
  switch (perfil) {
    case 'administrador':
    case 'diretoria':
    case 'patrimonio':
      return 'perfil-chip perfil-chip--accent';
    case 'financeiro':
    case 'livraria':
      return 'perfil-chip perfil-chip--warning';
    case 'secretaria':
    case 'comunicacao':
      return 'perfil-chip perfil-chip--info';
    case 'bibliotecario':
    case 'leitor':
      return 'perfil-chip perfil-chip--success';
    case 'evangelizador':
    case 'coord_juventude':
    case 'coord_estudos':
    case 'coord_atendimento':
    case 'coord_passe':
    case 'coord_apse':
      return 'perfil-chip perfil-chip--leaf';
    default:
      return 'perfil-chip perfil-chip--neutral';
  }
}

async function handleUpdate(userId: string, formData: FormData) {
  'use server';

  try {
    await updateUsuario(userId, {
      perfil: String(formData.get('perfil') || '').trim() || undefined,
      pode_escalas: formData.get('pode_escalas') === 'on',
      pode_biblioteca: formData.get('pode_biblioteca') === 'on',
      pode_livraria: formData.get('pode_livraria') === 'on',
      pode_financeiro: formData.get('pode_financeiro') === 'on',
      pode_pessoas: formData.get('pode_pessoas') === 'on',
      pode_publicar: formData.get('pode_publicar') === 'on',
      pode_mediunidade: formData.get('pode_mediunidade') === 'on',
      pode_atendimento: formData.get('pode_atendimento') === 'on',
      pode_apse: formData.get('pode_apse') === 'on',
    });

    redirect(buildFlashNoticeUrl('/admin/usuarios', { variant: 'success', message: 'Usuário atualizado.' }));
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    redirect(buildFlashNoticeUrl(`/admin/usuarios/${userId}`, { variant: 'error', message: 'Não foi possível atualizar o usuário.' }));
    return;
  }
}

async function handleRevoke(userId: string) {
  'use server';

  try {
    await revokeLogin(userId);
    redirect(buildFlashNoticeUrl('/admin/usuarios', { variant: 'success', message: 'Login revogado.' }));
  } catch (error) {
    console.error('Erro ao remover login:', error);
    redirect(buildFlashNoticeUrl(`/admin/usuarios/${userId}`, { variant: 'error', message: 'Não foi possível revogar o acesso.' }));
    return;
  }
}

async function EditUsuarioContent({ id }: { id: string }) {
  const usuarioRaw = await getUsuarioById(id);
  const usuario = usuarioRaw as UsuarioDetalhe | null;

  if (!usuario) {
    return (
      <div className="area-page">
        <section className="area-hero">
          <div className="area-hero-top">
            <div>
              <p className="area-subtitle">Acesso ao sistema</p>
              <h1 className="area-hero-title">Editar Usuário</h1>
            </div>
          </div>
          <p className="area-subtitle">Não foi possível carregar o usuário selecionado.</p>
        </section>

        <section className="area-section">
          <div className="area-empty">
            <p>O registro pode ter sido removido ou o acesso falhou temporariamente.</p>
            <Link href="/admin/usuarios" className="profile-form-btn profile-form-btn-secondary">
              Voltar
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const permissions = [
    ['pode_escalas', 'Escalas', usuario.pode_escalas],
    ['pode_biblioteca', 'Biblioteca', usuario.pode_biblioteca],
    ['pode_livraria', 'Livraria', usuario.pode_livraria],
    ['pode_financeiro', 'Financeiro', usuario.pode_financeiro],
    ['pode_pessoas', 'Pessoas', usuario.pode_pessoas],
    ['pode_publicar', 'Publicar', usuario.pode_publicar],
    ['pode_mediunidade', 'Mediunidade', usuario.pode_mediunidade],
    ['pode_atendimento', 'Atendimento', usuario.pode_atendimento],
    ['pode_apse', 'APSE', usuario.pode_apse],
  ] as const;

  return (
    <form action={(formData) => handleUpdate(id, formData)}>
      <div className="area-page">
        <section className="area-hero">
          <div className="area-hero-top">
            <div>
              <p className="area-subtitle">Acesso ao sistema</p>
              <h1 className="area-hero-title">Editar Usuário</h1>
            </div>
            <div className="tag-list">
              <span className={`${resolvePerfilChipClass(usuario.perfil)} status-pill`}>{usuario.perfil}</span>
            </div>
          </div>
          <p className="area-subtitle">{usuario.nome || usuario.email || usuario.pessoas?.nome}</p>
        </section>

        <section className="area-section">
          <div className="area-section-title">
            <h2>Informações</h2>
            <p>Identificação do usuário vinculado à pessoa.</p>
          </div>
          <div className="table-surface">
            <div className="area-panel-grid">
              <div className="area-panel-item">
                <p>
                  <strong>Pessoa:</strong> {usuario.nome || usuario.pessoas?.nome || '—'}
                </p>
                <p>
                  <strong>Email:</strong> {usuario.email || usuario.pessoas?.email || '—'}
                </p>
                <p>
                  <strong>ID:</strong> <code>{id}</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="area-section">
          <div className="area-section-title">
            <h2>Perfil e permissões</h2>
            <p>Defina o perfil e os acessos granulares.</p>
          </div>
          <div className="table-surface">
            <LgpdFormNotice text="Usamos estes dados para manter o acesso e os registros de permissão da conta." />
            <div className="module-grid">
              <label className="profile-form-field">
                <span>Perfil do sistema</span>
                <select name="perfil" defaultValue={usuario.perfil || 'publico'} className="profile-form-input">
                  {PERFIS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <div className="area-panel-item form-field-full">
                <span className="stat-label">Permissões específicas</span>
                <div className="tag-list tag-list--wrap">
                  {permissions.map(([name, label, checked]) => (
                    <label key={name} className="tag tag-check">
                      <input type="checkbox" name={name} defaultChecked={Boolean(checked)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="area-section">
          <div className="area-panel-grid">
            <button type="submit" className="profile-form-btn profile-form-btn-primary">
              Salvar
            </button>
            <Link href="/admin/usuarios" className="profile-form-btn profile-form-btn-secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              formAction={handleRevoke.bind(null, id)}
              className="profile-form-btn profile-form-btn-secondary"
            >
              Revogar acesso
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}

export default async function EditUsuarioPage({ params }: { params: Promise<UsuarioParams> }) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <EditUsuarioContent id={resolvedParams.id} />
    </Suspense>
  );
}
