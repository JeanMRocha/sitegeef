import Link from 'next/link';
import { getUsuarios } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Usuários - Admin GEEF',
};

type UsuarioItem = {
  id: string;
  nome?: string | null;
  email?: string | null;
  perfil?: string | null;
  pessoas?: { email?: string | null } | null;
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

async function UsuariosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);

  const { usuarios, total, pageSize, erro } = await getUsuarios(page);
  const totalPages = Math.ceil(total / pageSize);
  const usuarioList = usuarios as UsuarioItem[];

  const perfilColor: Record<string, string> = {
    administrador: '#8a005a',
    diretoria: '#005a8a',
    secretaria: '#5a8a00',
    financeiro: '#8a5a00',
    bibliotecario: '#00688a',
    livraria: '#8a0a00',
    evangelizador: '#00608a',
    coord_juventude: '#6a8a00',
    coord_estudos: '#8a006a',
    coord_atendimento: '#008a6a',
    coord_passe: '#008a00',
    coord_apse: '#8a6a00',
    comunicacao: '#008a8a',
    patrimonio: '#6a008a',
    tarefeiro: '#8a5a5a',
    leitor: '#5a6a8a',
    voluntario: '#6a8a5a',
    publico: '#aaaaaa',
  };

  const isPermissionLabel = (value: string | boolean | null | undefined): value is string => Boolean(value);

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Usuários</span>
          <h1 className="admin-page-title">Usuários e Permissões</h1>
          <p className="admin-page-subtitle">Pessoas com acesso ao sistema</p>
        </div>
        <Link href="/admin/usuarios/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Usuário
        </Link>
      </div>

      <div className="admin-card table-surface">
        {erro ? (
          <div className="area-empty" style={{ marginBottom: '1rem' }}>
            {erro}
          </div>
        ) : null}
        {usuarioList.length === 0 ? (
          <div className="text-center-muted" style={{ padding: '2rem' }}>
            <p>Nenhum usuário cadastrado.</p>
            <Link href="/admin/usuarios/novo" className="admin-btn admin-btn-primary mt-1">
              ➕ Criar primeiro usuário
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Permissões</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {usuarioList.map((usuario) => {
                const perms = [
                  usuario.pode_escalas && 'Escalas',
                  usuario.pode_biblioteca && 'Biblioteca',
                  usuario.pode_livraria && 'Livraria',
                  usuario.pode_financeiro && 'Financeiro',
                  usuario.pode_pessoas && 'Pessoas',
                  usuario.pode_publicar && 'Publicar',
                  usuario.pode_mediunidade && 'Mediunidade',
                  usuario.pode_atendimento && 'Atendimento',
                  usuario.pode_apse && 'APSE',
                ].filter(isPermissionLabel);

                return (
                  <tr key={usuario.id}>
                    <td><strong>{usuario.nome || usuario.email || 'N/A'}</strong></td>
                    <td className="text-sm-muted">{usuario.email || usuario.pessoas?.email || '—'}</td>
                    <td>
                      <span
                        className="status-pill inline-status"
                        style={{
                          backgroundColor: `${perfilColor[usuario.perfil || ''] || '#999'}22`,
                          color: perfilColor[usuario.perfil || ''] || '#666',
                        }}
                      >
                        {usuario.perfil}
                      </span>
                    </td>
                    <td className="text-xs-muted">
                      {perms.length > 0 ? (
                        <div className="tag-list">
                          {perms.slice(0, 3).map((p) => (
                            <span key={p} className="tag">
                              {p}
                            </span>
                          ))}
                          {perms.length > 3 && (
                            <span className="text-xs-muted">+{perms.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm-muted">—</span>
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/usuarios/${usuario.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination">
          {page > 1 && (
            <Link href={`/admin/usuarios?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span className="page-pagination-label">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/usuarios?page=${page + 1}`} className="admin-btn admin-btn-secondary">
              Próxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function UsuariosPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <UsuariosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

