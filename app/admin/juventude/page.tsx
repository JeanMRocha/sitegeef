import Link from 'next/link';
import { getGrupos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Juventude - Admin GEEF',
};

type GrupoItem = {
  id: string;
  nome: string;
  descricao?: string | null;
  status?: string | null;
  coordenador?: { nome?: string | null } | null;
};

async function JuventudeContent() {
  const grupos = await getGrupos();
  const grupoList = grupos as GrupoItem[];
  const gruposAtivos = grupoList.filter((g) => g.status === 'ativo');

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Módulo de grupos</p>
            <h1 className="area-hero-title">Juventude</h1>
          </div>
          <Link href="/admin/juventude/novo" className="profile-form-btn profile-form-btn-primary">
            Novo Grupo
          </Link>
        </div>
        <p className="area-subtitle">Gestão de grupos e encontros de jovens.</p>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Grupos ativos</span>
          <strong>{gruposAtivos.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Total de grupos</span>
          <strong>{grupos.length}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Grupos</h2>
          <p>Visão geral dos grupos cadastrados e seus coordenadores.</p>
        </div>
        <div className="table-surface">
          {grupoList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Coordenador</th>
                    <th>Descrição</th>
                    <th>Status</th>
                    <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                  {grupoList.map((grupo) => (
                    <tr key={grupo.id}>
                      <td>
                        <strong>{grupo.nome}</strong>
                      </td>
                      <td>{grupo.coordenador?.nome || '—'}</td>
                      <td className="text-sm-muted">{grupo.descricao || '—'}</td>
                      <td>
                        <span className={grupo.status === 'ativo' ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
                          {grupo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/juventude/${grupo.id}`} className="profile-form-btn profile-form-btn-secondary">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="area-empty">Nenhum grupo cadastrado.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function JuventudePagePage() {
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <JuventudeContent />
    </Suspense>
  );
}
