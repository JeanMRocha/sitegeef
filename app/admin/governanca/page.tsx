import Link from 'next/link';
import { getDiretorias, getCargos, getCargoOcupacoes, getAssembleias } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Governança - Admin GEEF',
};

async function GovernancaContent() {
  const diretorias = await getDiretorias();
  const cargos = await getCargos();
  const ocupacoes = await getCargoOcupacoes();
  const assembleias = await getAssembleias();
  const diretoriaAtiva = diretorias.find((d: any) => d.status === 'ativa');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Governança</h1>
          <p className="admin-page-subtitle">Gestão de diretorias, cargos e assembleias</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Diretorias
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {diretorias.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Cargos Cadastrados
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {cargos.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Pessoas em Cargo
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {ocupacoes.filter((o: any) => o.status === 'ativo').length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Assembleias
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {assembleias.length}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/admin/governanca/diretorias" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          👔 Diretorias
        </Link>
        <Link href="/admin/governanca/cargos" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          🎖️ Cargos
        </Link>
        <Link href="/admin/governanca/assembleias" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          🏛️ Assembleias
        </Link>
      </div>

      {diretoriaAtiva && (
        <div className="admin-card">
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Diretoria Ativa: {diretoriaAtiva.nome}</h2>

          {ocupacoes.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Pessoa</th>
                    <th>Cargo</th>
                    <th>Data de Início</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ocupacoes
                    .filter((o: any) => o.diretoria_id === diretoriaAtiva.id && o.status === 'ativo')
                    .map((ocupacao: any) => (
                      <tr key={ocupacao.id}>
                        <td style={{ fontWeight: 500 }}>
                          {ocupacao.pessoa?.nome}
                        </td>
                        <td style={{ fontSize: '0.9rem' }}>
                          {ocupacao.cargo?.nome}
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                          {ocupacao.data_inicio ? new Date(ocupacao.data_inicio).toLocaleDateString('pt-BR') : '—'}
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            borderRadius: '0.3rem',
                            fontSize: '0.85rem',
                          }}>
                            ✓ Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma pessoa em cargo nesta diretoria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GovernancaPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <GovernancaContent />
    </Suspense>
  );
}
