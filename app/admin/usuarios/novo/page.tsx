import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import { LgpdFormNotice } from '@/components/lgpd/lgpd-form-notice';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getPessoasSemLogin, grantLogin } from '../actions';

export const metadata = {
  title: 'Novo Usuário - Admin GEEF',
};

type PessoaSemLogin = {
  id: string;
  nome: string | null;
  email?: string | null;
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

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const pessoaId = String(formData.get('pessoa_id') || '').trim();
    const perfil = String(formData.get('perfil') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    const supabase = createServiceRoleClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    const permissoes = {
      pode_escalas: formData.get('pode_escalas') === 'on',
      pode_biblioteca: formData.get('pode_biblioteca') === 'on',
      pode_livraria: formData.get('pode_livraria') === 'on',
      pode_financeiro: formData.get('pode_financeiro') === 'on',
      pode_pessoas: formData.get('pode_pessoas') === 'on',
      pode_publicar: formData.get('pode_publicar') === 'on',
      pode_mediunidade: formData.get('pode_mediunidade') === 'on',
      pode_atendimento: formData.get('pode_atendimento') === 'on',
      pode_apse: formData.get('pode_apse') === 'on',
    };

    await grantLogin(userId, pessoaId, perfil, permissoes);

    redirect(buildFlashNoticeUrl('/admin/usuarios', { variant: 'success', message: 'Usuário criado com sucesso.' }));
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    redirect(buildFlashNoticeUrl('/admin/usuarios/novo', { variant: 'error', message: 'Não foi possível criar o usuário.' }));
    return;
  }
}

async function NovoUsuarioContent() {
  const { pessoas: pessoasSemLogin, erro } = await getPessoasSemLogin();
  const pessoas = pessoasSemLogin as PessoaSemLogin[];

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Acesso ao sistema</p>
            <h1 className="area-hero-title">Novo Usuário</h1>
          </div>
        </div>
        <p className="area-subtitle">Criar login para uma pessoa.</p>
      </section>

      <section className="area-section">
        <div className="table-surface table-surface-centered">
          {erro ? <div className="area-empty">{erro}</div> : null}
          {pessoas.length === 0 ? (
            <div className="area-empty">
              <p>{erro ? 'Não foi possível carregar as pessoas disponíveis.' : 'Todas as pessoas já possuem login.'}</p>
              <Link href="/admin/usuarios" className="profile-form-btn profile-form-btn-secondary">
                Voltar
              </Link>
            </div>
          ) : (
            <form action={handleSubmit}>
              <LgpdFormNotice text="Usamos estes dados para criar o acesso e registrar as permissões da conta." />

              <div className="area-section-title">
                <h2>Pessoa</h2>
                <p>Selecione quem receberá o login.</p>
              </div>

              <label className="profile-form-field">
                <span>Selecione a pessoa *</span>
                <select name="pessoa_id" required className="profile-form-input">
                  <option value="">— Selecione uma pessoa —</option>
                  {pessoas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.email || 'sem email'})
                    </option>
                  ))}
                </select>
              </label>

              <div className="area-section-title mt-1">
                <h2>Credenciais</h2>
                <p>Email e senha inicial.</p>
              </div>

              <div className="module-grid">
                <label className="profile-form-field">
                  <span>Email (login) *</span>
                  <input type="email" name="email" required className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>Senha *</span>
                  <input type="password" name="password" required minLength={8} className="profile-form-input" />
                </label>
              </div>

              <div className="area-section-title mt-1">
                <h2>Perfil e permissões</h2>
                <p>Defina o perfil base e os acessos específicos.</p>
              </div>

              <div className="module-grid">
                <label className="profile-form-field">
                  <span>Perfil do sistema *</span>
                  <select name="perfil" required className="profile-form-input">
                    <option value="">— Selecione um perfil —</option>
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
                    {[
                      'pode_escalas',
                      'pode_biblioteca',
                      'pode_livraria',
                      'pode_financeiro',
                      'pode_pessoas',
                      'pode_publicar',
                      'pode_mediunidade',
                      'pode_atendimento',
                      'pode_apse',
                    ].map((name) => (
                      <label key={name} className="tag tag-check">
                        <input type="checkbox" name={name} />
                        <span>{name.replace('pode_', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="area-panel-grid mt-1">
                <button type="submit" className="profile-form-btn profile-form-btn-primary">
                  Criar Usuário
                </button>
                <Link href="/admin/usuarios" className="profile-form-btn profile-form-btn-secondary">
                  Cancelar
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default async function NovoUsuarioPage() {
  return <NovoUsuarioContent />;
}
