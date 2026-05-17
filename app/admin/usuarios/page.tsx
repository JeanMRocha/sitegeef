import Link from 'next/link';
import { getUsuarios } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Usuários - Admin GEEF',
};

async function UsuariosList({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');

  const { usuarios, total, pageSize, erro } = await getUsuarios(page);
  const totalPages = Math.ceil(total / pageSize);

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
        {usuarios.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhum usuário cadastrado.</p>
            <Link href="/admin/usuarios/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
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
              {usuarios.map((usuario: any) => {
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
                ].filter(Boolean);

                return (
                  <tr key={usuario.id}>
                    <td style={{ fontWeight: 600 }}>{usuario.nome || usuario.email || 'N/A'}</td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{usuario.email || usuario.pessoas?.email || '—'}</td>
                    <td>
                      <span
                        className="inline-status"
                        style={{
                          backgroundColor: `${perfilColor[usuario.perfil] || '#999'}22`,
                          color: perfilColor[usuario.perfil] || '#666',
                        }}
                      >
                        {usuario.perfil}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {perms.length > 0 ? (
                        <div className="tag-list">
                          {perms.slice(0, 3).map((p) => (
                            <span key={p} className="tag">
                              {p}
                            </span>
                          ))}
                          {perms.length > 3 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>+{perms.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>—</span>
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
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          {page > 1 && (
            <Link href={`/admin/usuarios?page=${page - 1}`} className="admin-btn admin-btn-secondary">
              ← Anterior
            </Link>
          )}
          <span style={{ padding: '0.6rem 1.2rem', alignSelf: 'center', fontWeight: 600 }}>
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
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <UsuariosList searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

