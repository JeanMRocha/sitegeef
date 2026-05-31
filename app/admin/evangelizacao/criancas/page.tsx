import Link from 'next/link';
import { getCriancas } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Crianças - Admin GEEF',
};

type CriancaItem = {
  id: string;
  status?: string | null;
  pessoa?: { nome?: string | null } | null;
  turma?: { nome?: string | null } | null;
  responsavel?: { nome?: string | null } | null;
};

async function CriancasContent({ searchParams }: { searchParams: { turma?: string } }) {
  const criancas = await getCriancas(searchParams.turma);
  const criancaList = criancas as CriancaItem[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Crianças</h1>
          <p className="admin-page-subtitle">Cadastro de crianças no programa de evangelização</p>
        </div>
        <Link href="/admin/evangelizacao/criancas/nova" className="admin-btn admin-btn-primary">
          ➕ Nova Criança
        </Link>
      </div>

      <div className="admin-card">
        {criancaList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Turma</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {criancaList.map((crianca) => (
                  <tr key={crianca.id}>
                    <td><strong>{crianca.pessoa?.nome}</strong></td>
                    <td className="text-sm-muted">{crianca.turma?.nome}</td>
                    <td className="text-sm-muted">{crianca.responsavel?.nome}</td>
                    <td>
                      <span className={crianca.status === 'ativa' ? 'inline-status inline-status-success' : 'inline-status inline-status-neutral'}>
                        {crianca.status === 'ativa' ? '✓ Ativa' : '✕ Inativa'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/evangelizacao/criancas/${crianca.id}`} className="admin-btn admin-btn-small">
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
            <p>Nenhuma criança cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function CriancasPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <CriancasContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
