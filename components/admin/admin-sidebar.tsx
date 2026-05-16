'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type AdminSidebarProps = {
  podeMediunidade?: boolean;
};

export function AdminSidebar({ podeMediunidade = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? '';
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load expanded groups from localStorage
    const saved = localStorage.getItem('admin-sidebar-expanded');
    if (saved) {
      setExpandedGroups(JSON.parse(saved));
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
      <nav className="admin-nav">
        {/* Dashboard */}
        <div className="admin-nav-section">
          <Link
            href="/admin"
            className={`admin-nav-item ${isActive('/admin') && currentPath === '/admin' ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
        </div>

        {/* Instituição */}
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Instituição</h3>
          <Link
            href="/admin/instituicao"
            className={`admin-nav-item ${isActive('/admin/instituicao') ? 'active' : ''}`}
          >
            🏛️ Dados Institucionais
          </Link>
        </div>

        {/* Pessoas */}
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

        {/* Governança */}
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

        {/* Departamentos */}
        <div className="admin-nav-section">
          <Link
            href="/admin/departamentos"
            className={`admin-nav-item ${isActive('/admin/departamentos') ? 'active' : ''}`}
          >
            🗂️ Departamentos
          </Link>
        </div>

        {/* Escalas */}
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

        {/* Atendimento Espiritual */}
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

        {/* Evangelização */}
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

        {/* Estudos */}
        <div className="admin-nav-section">
          <Link
            href="/admin/estudos"
            className={`admin-nav-item ${isActive('/admin/estudos') ? 'active' : ''}`}
          >
            📖 Estudos
          </Link>
        </div>

        {/* Mediunidade */}
        {podeMediunidade && (
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

        {/* Livraria */}
        <div className="admin-nav-section">
          <Link
            href="/admin/livraria"
            className={`admin-nav-item ${isActive('/admin/livraria') ? 'active' : ''}`}
          >
            🛒 Livraria
          </Link>
        </div>

        {/* APSE */}
        <div className="admin-nav-section">
          <Link
            href="/admin/apse"
            className={`admin-nav-item ${isActive('/admin/apse') ? 'active' : ''}`}
          >
            🤝 APSE
          </Link>
        </div>

        {/* Comunicação */}
        <div className="admin-nav-section">
          <Link
            href="/admin/comunicacao"
            className={`admin-nav-item ${isActive('/admin/comunicacao') ? 'active' : ''}`}
          >
            📢 Comunicação
          </Link>
        </div>

        {/* Financeiro */}
        <div className="admin-nav-section">
          <Link
            href="/admin/financeiro"
            className={`admin-nav-item ${isActive('/admin/financeiro') ? 'active' : ''}`}
          >
            💰 Financeiro
          </Link>
        </div>

        {/* Patrimônio */}
        <div className="admin-nav-section">
          <Link
            href="/admin/patrimonio"
            className={`admin-nav-item ${isActive('/admin/patrimonio') ? 'active' : ''}`}
          >
            🏗️ Patrimônio
          </Link>
        </div>

        {/* Documentos */}
        <div className="admin-nav-section">
          <Link
            href="/admin/documentos"
            className={`admin-nav-item ${isActive('/admin/documentos') ? 'active' : ''}`}
          >
            📄 Documentos / LGPD
          </Link>
        </div>

        {/* Reuniões Virtuais */}
        <div className="admin-nav-section">
          <Link
            href="/admin/reunioes-virtuais"
            className={`admin-nav-item ${isActive('/admin/reunioes-virtuais') ? 'active' : ''}`}
          >
            🎥 Reuniões Virtuais
          </Link>
        </div>

        {/* Planejamento */}
        <div className="admin-nav-section">
          <Link
            href="/admin/planejamento"
            className={`admin-nav-item ${isActive('/admin/planejamento') ? 'active' : ''}`}
          >
            📈 Planejamento
          </Link>
        </div>

        {/* Notificações */}
        <div className="admin-nav-section">
          <Link
            href="/admin/notificacoes"
            className={`admin-nav-item ${isActive('/admin/notificacoes') ? 'active' : ''}`}
          >
            🔔 Notificações
          </Link>
        </div>

        {/* Relatórios */}
        <div className="admin-nav-section">
          <Link
            href="/admin/relatorios"
            className={`admin-nav-item ${isActive('/admin/relatorios') ? 'active' : ''}`}
          >
            📊 Relatórios
          </Link>
        </div>

        {/* Site */}
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Site</h3>
          <Link href="/escalas" target="_blank" className="admin-nav-item">
            👁️ Escalas Públicas →
          </Link>
          <Link href="/leitor" target="_blank" className="admin-nav-item">
            📖 Área do Leitor →
          </Link>
          <Link href="/" target="_blank" className="admin-nav-item">
            🏠 Home →
          </Link>
        </div>
      </nav>
    </aside>
  );
}
