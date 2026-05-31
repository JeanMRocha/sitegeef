import Link from 'next/link';
import { getCursos } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Cursos - Admin GEEF',
};

type CursoItem = {
  id: string;
  nome: string;
  descricao?: string | null;
  ativo?: boolean | null;
};

async function CursosContent() {
  const cursos = await getCursos();
  const cursoList = cursos as CursoItem[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cursos de Estudo</h1>
          <p className="admin-page-subtitle">IEE, ESDE, EOB, EADE e outros</p>
        </div>
        <Link href="/admin/estudos/cursos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Curso
        </Link>
      </div>

      <div className="admin-card">
        {cursoList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {cursoList.map((curso) => (
                  <tr key={curso.id}>
                    <td>
                      <strong>
                      {curso.nome}
                      </strong>
                    </td>
                    <td className="text-sm-muted">
                      {curso.descricao || '—'}
                    </td>
                    <td>
                      <span className={curso.ativo ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
                        {curso.ativo ? '✓ Ativo' : '✕ Inativo'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/estudos/cursos/${curso.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="area-empty">
            <p>Nenhum curso cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CursosPage() {
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <CursosContent />
    </Suspense>
  );
}
