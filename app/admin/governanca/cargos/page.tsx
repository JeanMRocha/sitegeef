import Link from 'next/link';
import { getCargos } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Cargos - Admin GEEF',
};

async function CargosContent() {
  const cargos = await getCargos();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cargos</h1>
          <p className="admin-page-subtitle">Gestão de posições/funções na diretoria</p>
        </div>
        <Link href="/admin/governanca/cargos/novo" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Novo Cargo
        </Link>
      </div>

      <div className="admin-card">
        {cargos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
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
                {cargos.map((cargo: any) => (
                  <tr key={cargo.id}>
                    <td style={{ fontWeight: 500 }}>
                      {cargo.nome}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {cargo.descricao || '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
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
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum cargo cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default function CargosPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <CargosContent />
    </Suspense>
  );
}
