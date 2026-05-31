import Link from 'next/link';
import { getDiretorias } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Diretorias - Admin GEEF',
};

type DiretoriaItem = {
  id: string;
  nome: string;
  data_inicio?: string | null;
  data_fim?: string | null;
  status?: string | null;
};

async function DiretoriasContent() {
  const diretorias = await getDiretorias();
  const diretoriaList = diretorias as DiretoriaItem[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Diretorias</h1>
          <p className="admin-page-subtitle">Gestão de gestões e mandatos</p>
        </div>
        <Link href="/admin/governanca/diretorias/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Diretoria
        </Link>
      </div>

      <div className="admin-card">
        {diretoriaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {diretoriaList.map((diretoria) => (
                  <tr key={diretoria.id}>
                    <td>
                      <strong>
                      {diretoria.nome}
                      </strong>
                    </td>
                    <td className="text-sm-muted">
                      {diretoria.data_inicio ? new Date(diretoria.data_inicio).toLocaleDateString('pt-BR') : '—'} a {diretoria.data_fim ? new Date(diretoria.data_fim).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td>
                      <span className={diretoria.status === 'ativa' ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
                        {diretoria.status === 'ativa' ? '✓ Ativa' : '✕ Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/governanca/diretorias/${diretoria.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center-muted">Nenhuma diretoria cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default function DiretoriasPage() {
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <DiretoriasContent />
    </Suspense>
  );
}
