'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAdminShellArea } from '@/components/admin/use-admin-shell-area';

type AdminSidebarProps = {
  user?: {
    email?: string;
    fullName?: string;
  };
  usuarioSistema?: {
    perfil?: string;
    pode_escalas?: boolean;
    pode_biblioteca?: boolean;
    pode_livraria?: boolean;
    pode_financeiro?: boolean;
    pode_pessoas?: boolean;
    pode_publicar?: boolean;
    pode_mediunidade?: boolean;
    pode_atendimento?: boolean;
    pode_apse?: boolean;
  };
};

function getInitials(value?: string) {
  if (!value) {
    return 'GE';
  }

  const parts = value.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]).join('');
  return (initials || value.slice(0, 2)).toUpperCase();
}

export function AdminSidebar({ user, usuarioSistema }: AdminSidebarProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? '';
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const isAdministrador = usuarioSistema?.perfil === 'administrador';
  const currentPerfil = usuarioSistema?.perfil ?? '';
  const { area } = useAdminShellArea();
  const displayName = user?.fullName || user?.email || 'Usuário';
  const initials = getInitials(displayName);
  const showProfileArea = area === 'perfil';
  const showUserArea = area === 'perfil' || area === 'pessoas';
  const showGovernanceArea = area === 'governanca';
  const showDocumentsArea = area === 'documentos';
  const showOperationArea = area === 'operacao';
  const showSystemArea = area === 'sistema';
  const showDashboardArea = area === 'painel';

  const canAccess = (flag: keyof NonNullable<AdminSidebarProps['usuarioSistema']>) => {
    if (isAdministrador) {
      return true;
    }

    return usuarioSistema?.[flag] === true;
  };

  const canAccessModule = (
    flag?: keyof NonNullable<AdminSidebarProps['usuarioSistema']>,
    profiles: string[] = [],
  ) => {
    if (isAdministrador) {
      return true;
    }

    if (flag && usuarioSistema?.[flag] === true) {
      return true;
    }

    return profiles.includes(currentPerfil);
  };

  useEffect(() => {
    // Load expanded groups from localStorage
    const saved = localStorage.getItem('admin-sidebar-expanded');
    if (!saved) {
      return;
    }

    try {
      setExpandedGroups(JSON.parse(saved));
    } catch (error) {
      console.warn('Falha ao ler estado do menu lateral:', error);
    }
  }, []);

  const toggleGroup = (groupName: string) => {
    const newState = { ...expandedGroups, [groupName]: !expandedGroups[groupName] };
    setExpandedGroups(newState);
    localStorage.setItem('admin-sidebar-expanded', JSON.stringify(newState));
  };

  const isActive = (href: string) => currentPath.startsWith(href);

  const NavGroup = ({
    name,
    title,
    collapsible = false,
    children,
  }: {
    name?: string;
    title?: string;
    collapsible?: boolean;
    children: React.ReactNode;
  }) => {
    const isExpanded = name ? expandedGroups[name] !== false : true;

    return (
      <div className="admin-nav-section">
        {title && collapsible && (
          <button
            type="button"
            onClick={() => name && toggleGroup(name)}
            className="admin-nav-title admin-nav-title-button"
            aria-expanded={isExpanded}
          >
            <span>{title}</span>
            <span className="admin-nav-title-arrow">{isExpanded ? '▼' : '▶'}</span>
          </button>
        )}
        {title && !collapsible && <h3 className="admin-nav-title">{title}</h3>}
        {isExpanded && <div className="admin-nav-group-items">{children}</div>}
      </div>
    );
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-hero">
        <div className="admin-sidebar-hero-top">
          <div className="admin-sidebar-avatar">{initials}</div>
          <div className="admin-sidebar-hero-copy">
            <span className="admin-sidebar-hero-kicker">Sessão ativa</span>
            <h2>{displayName}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="admin-sidebar-hero-chip-row">
          <span className="admin-sidebar-hero-chip">
            {isAdministrador ? 'Administrador' : currentPerfil || 'Acesso operacional'}
          </span>
          {canAccess('pode_pessoas') && <span className="admin-sidebar-hero-chip">Pessoas</span>}
          {canAccess('pode_escalas') && <span className="admin-sidebar-hero-chip">Escalas</span>}
        </div>

        <div className="admin-sidebar-quick-links">
          <Link href="/admin" className="admin-sidebar-quick-link">
            Painel
          </Link>
          <Link href="/perfil" className="admin-sidebar-quick-link">
            Perfil
          </Link>
          <Link href="/minha-area" className="admin-sidebar-quick-link">
            Minha área
          </Link>
        </div>
      </div>

      <nav className="admin-nav">
        {/* Dashboard */}
        {showDashboardArea && (
          <div className="admin-nav-section">
            <Link
              href="/admin"
              className={`admin-nav-item ${isActive('/admin') && currentPath === '/admin' ? 'active' : ''}`}
            >
              📊 Dashboard
            </Link>
          </div>
        )}

        {/* Perfil */}
        {showProfileArea && (
          <div className="admin-nav-section">
            <h3 className="admin-nav-title">Perfil</h3>
            <Link
              href="/perfil"
              className={`admin-nav-item ${isActive('/perfil') ? 'active' : ''}`}
            >
              👤 Meu perfil
            </Link>
            <Link
              href="/minha-area"
              className={`admin-nav-item ${isActive('/minha-area') ? 'active' : ''}`}
            >
              🧭 Minha área
            </Link>
          </div>
        )}

        {/* Instituição */}
        {showUserArea && canAccessModule('pode_pessoas', ['diretoria', 'secretaria']) && (
          <div className="admin-nav-section">
            <h3 className="admin-nav-title">Instituição</h3>
            <Link
              href="/admin/instituicao"
              className={`admin-nav-item ${isActive('/admin/instituicao') ? 'active' : ''}`}
            >
              🏛️ Dados Institucionais
            </Link>
          </div>
        )}

        {/* Pessoas */}
        {showUserArea && canAccess('pode_pessoas') && (
          <div className="admin-nav-section">
            <h3 className="admin-nav-title">Pessoas</h3>
            <Link
              href="/admin/pessoas"
              className={`admin-nav-item ${isActive('/admin/pessoas') ? 'active' : ''}`}
            >
              👥 Cadastro
            </Link>
            <Link
              href="/admin/usuarios"
              className={`admin-nav-item ${isActive('/admin/usuarios') ? 'active' : ''}`}
            >
              🔑 Usuários e Permissões
            </Link>
          </div>
        )}

        {/* Governança */}
        {showGovernanceArea && canAccessModule('pode_pessoas', ['diretoria', 'secretaria']) && (
          <NavGroup name="governanca" title="Governança" collapsible>
            <Link
              href="/admin/governanca"
              className={`admin-nav-item ${isActive('/admin/governanca') ? 'active' : ''}`}
            >
              🏢 Diretorias e Cargos
            </Link>
            <Link
              href="/admin/governanca/assembleias"
              className={`admin-nav-item ${isActive('/admin/governanca/assembleias') ? 'active' : ''}`}
            >
              📋 Assembleias e Atas
            </Link>
          </NavGroup>
        )}

        {/* Departamentos */}
        {showUserArea && canAccessModule('pode_pessoas', ['diretoria', 'secretaria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/departamentos"
              className={`admin-nav-item ${isActive('/admin/departamentos') ? 'active' : ''}`}
            >
              🗂️ Departamentos
            </Link>
          </div>
        )}

        {/* Escalas */}
        {showOperationArea && canAccess('pode_escalas') && (
        <NavGroup name="escalas" title="Escalas" collapsible>
          <Link
            href="/admin/escalas"
            className={`admin-nav-item ${isActive('/admin/escalas') ? 'active' : ''}`}
          >
            📅 Montar Escala
          </Link>
          <Link
            href="/admin/funcoes"
            className={`admin-nav-item ${isActive('/admin/funcoes') ? 'active' : ''}`}
          >
            🎯 Funções
          </Link>
          <Link
            href="/admin/funcoes/temas"
            className={`admin-nav-item ${isActive('/admin/funcoes/temas') ? 'active' : ''}`}
          >
            📚 Temas
          </Link>
        </NavGroup>
        )}        

        {/* Atendimento Espiritual */}
        {showOperationArea && canAccess('pode_atendimento') && (
          <div className="admin-nav-section">
            <h3 className="admin-nav-title">Atendimento Espiritual</h3>
            <Link
              href="/admin/atendimento"
              className={`admin-nav-item ${isActive('/admin/atendimento') && currentPath === '/admin/atendimento' ? 'active' : ''}`}
            >
              🙏 Dashboard
            </Link>
            <Link
              href="/admin/atendimento/recepcao"
              className={`admin-nav-item ${isActive('/admin/atendimento/recepcao') ? 'active' : ''}`}
            >
              👋 Recepção
            </Link>
            <Link
              href="/admin/atendimento/fraterno"
              className={`admin-nav-item ${isActive('/admin/atendimento/fraterno') ? 'active' : ''}`}
            >
              💬 Atendimento Fraterno
            </Link>
            <Link
              href="/admin/atendimento/evangelhos-lar"
              className={`admin-nav-item ${isActive('/admin/atendimento/evangelhos-lar') ? 'active' : ''}`}
            >
              🏠 Evangelhos no Lar
            </Link>
            <Link
              href="/admin/atendimento/irradiacao"
              className={`admin-nav-item ${isActive('/admin/atendimento/irradiacao') ? 'active' : ''}`}
            >
              ✨ Irradiação
            </Link>
          </div>
        )}

        {/* Evangelização */}
        {showOperationArea && canAccessModule('pode_publicar', ['evangelizador', 'coord_juventude']) && (
          <div className="admin-nav-section">
            <h3 className="admin-nav-title">Evangelização</h3>
            <Link
              href="/admin/evangelizacao"
              className={`admin-nav-item ${isActive('/admin/evangelizacao') ? 'active' : ''}`}
            >
              ✝️ Infantil
            </Link>
            <Link
              href="/admin/juventude"
              className={`admin-nav-item ${isActive('/admin/juventude') ? 'active' : ''}`}
            >
              🧑 Juventude
            </Link>
          </div>
        )}

        {/* Estudos */}
        {showOperationArea && canAccessModule('pode_publicar', ['coord_estudos']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/estudos"
              className={`admin-nav-item ${isActive('/admin/estudos') ? 'active' : ''}`}
            >
              📖 Estudos
            </Link>
          </div>
        )}

        {/* Mediunidade */}
        {showOperationArea && canAccessModule('pode_mediunidade') && (
          <NavGroup name="mediunidade" title="Mediunidade" collapsible>
            <Link
              href="/admin/mediunidade"
              className={`admin-nav-item ${isActive('/admin/mediunidade') ? 'active' : ''}`}
            >
              🔒 Grupos Mediúnicos
            </Link>
          </NavGroup>
        )}

        {/* Biblioteca */}
        {showOperationArea && canAccessModule('pode_biblioteca', ['bibliotecario']) && (
        <NavGroup name="biblioteca" title="Biblioteca" collapsible>
          <Link
            href="/admin/biblioteca"
            className={`admin-nav-item ${isActive('/admin/biblioteca') && currentPath !== '/admin/biblioteca/emprestimos' ? 'active' : ''}`}
          >
            📚 Obras e Exemplares
          </Link>
          <Link
            href="/admin/biblioteca/emprestimos"
            className={`admin-nav-item ${isActive('/admin/biblioteca/emprestimos') ? 'active' : ''}`}
          >
            📤 Empréstimos
          </Link>
        </NavGroup>
        )}

        {/* Livraria */}
        {showOperationArea && canAccessModule('pode_livraria', ['livraria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/livraria"
              className={`admin-nav-item ${isActive('/admin/livraria') ? 'active' : ''}`}
            >
              🛒 Livraria
            </Link>
          </div>
        )}

        {/* APSE */}
        {showOperationArea && canAccessModule('pode_apse', ['coord_apse']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/apse"
              className={`admin-nav-item ${isActive('/admin/apse') ? 'active' : ''}`}
            >
              🤝 APSE
            </Link>
          </div>
        )}

        {/* Comunicação */}
        {showOperationArea && canAccessModule('pode_publicar', ['comunicacao', 'secretaria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/comunicacao"
              className={`admin-nav-item ${isActive('/admin/comunicacao') ? 'active' : ''}`}
            >
              📢 Comunicação
            </Link>
            <Link
              href="/admin/comunicacao/mensagens"
              className={`admin-nav-item ${isActive('/admin/comunicacao/mensagens') ? 'active' : ''}`}
            >
              📨 Mensagens do site
            </Link>
          </div>
        )}

        {/* Financeiro */}
        {showOperationArea && canAccessModule('pode_financeiro', ['financeiro']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/financeiro"
              className={`admin-nav-item ${isActive('/admin/financeiro') ? 'active' : ''}`}
            >
              💰 Financeiro
            </Link>
          </div>
        )}

        {/* Patrimônio */}
        {showOperationArea && canAccessModule('pode_financeiro', ['patrimonio']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/patrimonio"
              className={`admin-nav-item ${isActive('/admin/patrimonio') ? 'active' : ''}`}
            >
              🏗️ Patrimônio
            </Link>
          </div>
        )}

        {/* Documentos */}
        {showGovernanceArea && canAccessModule('pode_publicar', ['comunicacao', 'secretaria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/documentos"
              className={`admin-nav-item ${isActive('/admin/documentos') ? 'active' : ''}`}
            >
              📄 Documentos / LGPD
            </Link>
            <Link
              href="/admin/lgpd"
              className={`admin-nav-item ${isActive('/admin/lgpd') ? 'active' : ''}`}
            >
              🛡️ Central LGPD
            </Link>
          </div>
        )}

        {showDocumentsArea && canAccessModule('pode_publicar', ['comunicacao', 'secretaria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/documentos"
              className={`admin-nav-item ${isActive('/admin/documentos') ? 'active' : ''}`}
            >
              📄 Documentos / LGPD
            </Link>
            <Link
              href="/admin/lgpd"
              className={`admin-nav-item ${isActive('/admin/lgpd') ? 'active' : ''}`}
            >
              🛡️ Central LGPD
            </Link>
            <Link
              href="/admin/documentos/pedidos"
              className={`admin-nav-item ${isActive('/admin/documentos/pedidos') ? 'active' : ''}`}
            >
              📮 Pedidos do Titular
            </Link>
            <Link
              href="/admin/documentos/auditoria"
              className={`admin-nav-item ${isActive('/admin/documentos/auditoria') ? 'active' : ''}`}
            >
              🧭 Auditoria LGPD
            </Link>
          </div>
        )}

        {/* Reuniões Virtuais */}
        {showOperationArea && canAccessModule('pode_publicar', ['secretaria', 'diretoria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/reunioes-virtuais"
              className={`admin-nav-item ${isActive('/admin/reunioes-virtuais') ? 'active' : ''}`}
            >
              🎥 Reuniões Virtuais
            </Link>
          </div>
        )}

        {/* Planejamento */}
        {showOperationArea && canAccessModule('pode_publicar', ['diretoria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/planejamento"
              className={`admin-nav-item ${isActive('/admin/planejamento') ? 'active' : ''}`}
            >
              📈 Planejamento
            </Link>
          </div>
        )}

        {/* Notificações */}
        {showOperationArea && canAccessModule('pode_publicar', ['secretaria', 'comunicacao']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/notificacoes"
              className={`admin-nav-item ${isActive('/admin/notificacoes') ? 'active' : ''}`}
            >
              🔔 Notificações
            </Link>
          </div>
        )}

        {/* Relatórios */}
        {showOperationArea && canAccessModule('pode_publicar', ['diretoria', 'secretaria']) && (
          <div className="admin-nav-section">
            <Link
              href="/admin/relatorios"
              className={`admin-nav-item ${isActive('/admin/relatorios') ? 'active' : ''}`}
            >
              📊 Relatórios
            </Link>
          </div>
        )}

        {/* Observabilidade */}
        {showSystemArea && isAdministrador && (
          <div className="admin-nav-section">
            <Link
              href="/admin/observability"
              className={`admin-nav-item ${isActive('/admin/observability') ? 'active' : ''}`}
            >
              🧭 Observabilidade
            </Link>
            <Link
              href="/admin/migrations"
              className={`admin-nav-item ${isActive('/admin/migrations') ? 'active' : ''}`}
            >
              🧱 Migrations
            </Link>
            <Link
              href="/admin/fix-usuarios"
              className={`admin-nav-item ${isActive('/admin/fix-usuarios') ? 'active' : ''}`}
            >
              🔧 Fix Usuários
            </Link>
            <Link
              href="/admin/idiomas"
              className={`admin-nav-item ${isActive('/admin/idiomas') ? 'active' : ''}`}
            >
              🌐 Idiomas
            </Link>
          </div>
        )}

        {/* Site */}
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Site</h3>
          <Link href="/escalas" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            👁️ Escalas Públicas →
          </Link>
          <Link href="/leitor" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            📖 Área do Leitor →
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            🏠 Home →
          </Link>
          <Link href="/admin/idiomas" className={`admin-nav-item ${isActive('/admin/idiomas') ? 'active' : ''}`}>
            🌐 Idiomas
          </Link>
        </div>
      </nav>
    </aside>
  );
}
