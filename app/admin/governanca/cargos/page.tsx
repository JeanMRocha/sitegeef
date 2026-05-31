import Link from 'next/link';
import { getCargos } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Cargos - Admin GEEF',
};

type CargoItem = {
  id: string;
  nome: string;
  descricao?: string | null;
  nivel?: string | null;
};

async function CargosContent() {
  const cargos = await getCargos();
  const cargoList = cargos as CargoItem[];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cargos</h1>
          <p className="admin-page-subtitle">Gestão de posições/funções na diretoria</p>
        </div>
        <Link href="/admin/governanca/cargos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Cargo
        </Link>
      </div>

      <div className="admin-card">
        {cargoList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Nível</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {cargoList.map((cargo) => (
                  <tr key={cargo.id}>
                    <td>
                      <strong>
                      {cargo.nome}
                      </strong>
                    </td>
                    <td className="text-sm-muted">
                      {cargo.descricao || '—'}
                    </td>
                    <td className="text-sm-muted">
                      {cargo.nivel ? (cargo.nivel === 'estrategico' ? '🎯 Estratégico' : cargo.nivel === 'operacional' ? '⚙️ Operacional' : '📋 Coordenação') : '—'}
                    </td>
                    <td>
                      <Link href={`/admin/governanca/cargos/${cargo.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center-muted">Nenhum cargo cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default function CargosPage() {
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <CargosContent />
    </Suspense>
  );
}
