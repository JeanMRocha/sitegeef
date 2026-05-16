'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="admin-sidebar">
      <nav className="admin-nav">
        {/* Dashboard */}
        <div className="admin-nav-section">
          <Link
            href="/admin"
            className={`admin-nav-item ${isActive('/admin') && pathname === '/admin' ? 'active' : ''}`}
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
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Governança</h3>
          <Link
            href="/admin/governanca"
            className={`admin-nav-item ${isActive('/admin/governanca') ? 'active' : ''}`}
          >
            🏢 Diretorias e Cargos
          </Link>
          <Link
            href="/admin/assembleias"
            className={`admin-nav-item ${isActive('/admin/assembleias') ? 'active' : ''}`}
          >
            📋 Assembleias e Atas
          </Link>
        </div>

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
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Escalas</h3>
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
            href="/admin/temas"
            className={`admin-nav-item ${isActive('/admin/temas') ? 'active' : ''}`}
          >
            📚 Temas
          </Link>
        </div>

        {/* Atendimento */}
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Atendimento</h3>
          <Link
            href="/admin/atendimento/recepcao"
            className={`admin-nav-item ${isActive('/admin/atendimento') ? 'active' : ''}`}
          >
            🙏 Recepção
          </Link>
          <Link
            href="/admin/atendimento/fraterno"
            className={`admin-nav-item ${isActive('/admin/atendimento/fraterno') ? 'active' : ''}`}
          >
            💬 Atendimento Fraterno
          </Link>
          <Link
            href="/admin/atendimento/passe"
            className={`admin-nav-item ${isActive('/admin/atendimento/passe') ? 'active' : ''}`}
          >
            ✨ Passe
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
        <div className="admin-nav-section">
          <Link
            href="/admin/mediunidade"
            className={`admin-nav-item ${isActive('/admin/mediunidade') ? 'active' : ''}`}
          >
            🔒 Mediunidade
          </Link>
        </div>

        {/* Biblioteca */}
        <div className="admin-nav-section">
          <h3 className="admin-nav-title">Biblioteca</h3>
          <Link
            href="/admin/biblioteca/obras"
            className={`admin-nav-item ${isActive('/admin/biblioteca') ? 'active' : ''}`}
          >
            📚 Obras
          </Link>
          <Link
            href="/admin/biblioteca/emprestimos"
            className={`admin-nav-item ${isActive('/admin/biblioteca/emprestimos') ? 'active' : ''}`}
          >
            📤 Empréstimos
          </Link>
        </div>

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
