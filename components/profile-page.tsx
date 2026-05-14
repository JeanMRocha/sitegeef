import { UserIcon } from "@/components/site-icons";

const profileSummary = [
  {
    kicker: "Acesso",
    title: "Login e cadastro",
    text: "Base para e-mail, senha, magic link ou fluxo social sem refatorar a página.",
  },
  {
    kicker: "Sessão",
    title: "Cookies e SSR",
    text: "Estrutura preparada para sessão persistente em servidor e navegador.",
  },
  {
    kicker: "Perfil",
    title: "Dados do usuário",
    text: "Ponto de partida para nome, avatar, preferências e visibilidade de conta.",
  },
  {
    kicker: "Segurança",
    title: "RLS e papéis",
    text: "Modelo pronto para políticas por usuário e segregação entre público e privado.",
  },
];

const profileFlow = [
  {
    title: "Autenticação",
    text: "Plugar `@supabase/ssr` com cookies HTTP-only e refresh transparente de sessão.",
  },
  {
    title: "Perfil",
    text: "Criar tabela `profiles` vinculada a `auth.users` para armazenar metadados de app.",
  },
  {
    title: "Permissões",
    text: "Separar regras por role e aplicar RLS antes de qualquer dado sensível aparecer.",
  },
  {
    title: "Produto",
    text: "Evoluir a base para preferências, histórico, notificações e áreas restritas.",
  },
];

export function ProfilePageView() {
  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="content-hero-top">
          <div className="content-kicker">
            <p className="eyebrow">GEEF</p>
            <span className="content-badge-text">Módulo de perfil de usuário</span>
          </div>
          <div className="content-badge">
            <span className="content-badge-label">Base Supabase</span>
          </div>
        </div>

        <div className="profile-hero-body">
          <div className="profile-copy">
            <h1>Perfil de usuário</h1>
            <p className="content-summary">
              Uma base profissional para autenticação, sessão e dados do
              usuário, pronta para evoluir para o sistema auth completo.
            </p>
            <p className="content-intro">
              O módulo foi desenhado para crescer com login, cadastro,
              recuperação de senha, áreas privadas e permissões sem quebrar a
              navegação atual do site.
            </p>

            <div className="profile-chip-row" aria-label="Capacidades do módulo">
              <span className="profile-chip">Login</span>
              <span className="profile-chip">Cadastro</span>
              <span className="profile-chip">Sessão</span>
              <span className="profile-chip">RLS</span>
              <span className="profile-chip">SSR</span>
            </div>
          </div>

          <aside className="profile-panel">
            <p className="content-panel-label">Arquitetura inicial</p>
            <ul className="profile-flow">
              {profileFlow.map((item, index) => (
                <li key={item.title}>
                  <span className="profile-flow-step">{index + 1}</span>
                  <span>
                    <span className="profile-flow-title">{item.title}</span>
                    <span className="profile-flow-text">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="profile-summary-grid">
          {profileSummary.map((item) => (
            <article key={item.title} className="profile-summary-card profile-card">
              <p className="profile-summary-kicker">{item.kicker}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid" aria-label="Estrutura do perfil">
        <article className="content-card">
          <h2>Entrada autenticada</h2>
          <p>
            O primeiro passo é ligar o client browser e o client server com
            `@supabase/ssr`, usando variáveis públicas e sessão por cookie.
          </p>
          <ul>
            <li>Fluxo de login preparado para rotas protegidas.</li>
            <li>Base para magic link, senha e provedores sociais.</li>
            <li>Separação clara entre público e área autenticada.</li>
          </ul>
        </article>

        <article className="content-card">
          <h2>Perfil e preferências</h2>
          <p>
            O futuro `profiles` organiza nome, avatar, idioma, status e
            preferências de exibição sem depender da tabela `auth.users`.
          </p>
          <ul>
            <li>Dados do app versionados e auditáveis.</li>
            <li>Campos extras seguros para personalização.</li>
            <li>Pronto para leitura em SSR e client side.</li>
          </ul>
        </article>

        <article className="content-card">
          <h2>Segurança e acesso</h2>
          <p>
            O modelo já considera RLS, metadata apropriada e chaves separadas
            para navegador, servidor e administração.
          </p>
          <ul>
            <li>Sem expor `service_role` no browser.</li>
            <li>Políticas por usuário para dados privados.</li>
            <li>Base para perfis, permissões e painéis restritos.</li>
          </ul>
        </article>

        <article className="content-card">
          <h2>Próximas telas</h2>
          <p>
            A fundação visual já deixa caminho livre para as telas reais de
            acesso quando a integração Supabase estiver ativa.
          </p>
          <ul>
            <li>Entrar</li>
            <li>Criar conta</li>
            <li>Esqueci minha senha</li>
            <li>Conta conectada</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
