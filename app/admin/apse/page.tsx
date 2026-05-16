import Link from 'next/link';
import { getFamilias, getCampanhas, getAtendimentos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'APSE - Admin GEEF',
};

async function ApseContent() {
  const familias = await getFamilias();
  const campanhas = await getCampanhas();
  const atendimentos = await getAtendimentos();
  const campanhasAtivas = campanhas.filter((c: any) => c.status === 'planejada' || c.status === 'em_execucao');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">APSE - Assistência Social</h1>
          <p className="admin-page-subtitle">Gestão de famílias assistidas e campanhas</p>
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
            Famílias Ativas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {familias.filter((f: any) => f.status === 'ativa').length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Campanhas Ativas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {campanhasAtivas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total de Atendimentos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {atendimentos.length}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/admin/apse/familias" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          👨‍👩‍👧‍👦 Famílias
        </Link>
        <Link href="/admin/apse/campanhas" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          📢 Campanhas
        </Link>
        <Link href="/admin/apse/atendimentos" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          🤝 Atendimentos
        </Link>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Campanhas Ativas</h2>

        {campanhasAtivas.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {campanhasAtivas.map((campanha: any) => (
              <Link
                key={campanha.id}
                href={`/admin/apse/campanhas/${campanha.id}`}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--admin-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  textDecoration: 'none',
                  color: 'var(--text)',
                }}
              >
                <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>
                  {campanha.nome}
                </p>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {campanha.descricao || 'Sem descrição'}
                </p>
                {campanha.meta && (
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#999' }}>
                    Meta: {campanha.meta}
                  </p>
                )}
                <span style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  backgroundColor: campanha.status === 'planejada' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  color: campanha.status === 'planejada' ? '#a855f7' : '#3b82f6',
                  borderRadius: '0.3rem',
                  fontSize: '0.8rem',
                }}>
                  {campanha.status === 'planejada' ? '📋 Planejada' : '▶ Em execução'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma campanha ativa.</p>
        )}
      </div>
    </div>
  );
}

export default function ApsePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ApseContent />
    </Suspense>
  );
}
