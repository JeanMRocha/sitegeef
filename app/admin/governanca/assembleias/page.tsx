import Link from 'next/link';
import { getAssembleias } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Assembleias - Admin GEEF',
};

async function AssembleiasContent() {
  const assembleias = await getAssembleias();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Assembleias</h1>
          <p className="admin-page-subtitle">Registro de assembleias, AGOs, AGEs e reuniões</p>
        </div>
        <Link href="/admin/governanca/assembleias/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
          ➕ Nova Assembleia
        </Link>
      </div>

      <div className="admin-card">
        {assembleias.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Pauta</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {assembleias.map((assembleia: any) => (
                  <tr key={assembleia.id}>
                    <td style={{ fontWeight: 500 }}>
                      {assembleia.tipo === 'AGO' && '📊 AGO'}
                      {assembleia.tipo === 'AGE' && '📋 AGE'}
                      {assembleia.tipo === 'reuniao_diretoria' && '👔 Reunião Diretoria'}
                      {assembleia.tipo === 'reuniao_departamento' && '🏢 Reunião Departamento'}
                    </td>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {new Date(assembleia.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--muted)', maxWidth: '200px' }}>
                      {assembleia.pauta ? assembleia.pauta.substring(0, 50) + '...' : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: assembleia.status === 'rascunho' ? 'rgba(107, 114, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: assembleia.status === 'rascunho' ? '#6b7280' : '#22c55e',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {assembleia.status === 'rascunho' ? '📝 Rascunho' : '✓ Finalizada'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/governanca/assembleias/${assembleia.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma assembleia registrada.</p>
        )}
      </div>
    </div>
  );
}

export default function AssembleiasPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <AssembleiasContent />
    </Suspense>
  );
}
