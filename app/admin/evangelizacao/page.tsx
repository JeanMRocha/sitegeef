import Link from 'next/link';
import { getTurmas, getCriancas } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Evangelização Infantil - Admin GEEF',
};

async function EvangelizacaoContent() {
  const turmas = await getTurmas();
  const criancas = await getCriancas();

  const turmasAtivas = turmas.filter((t: any) => t.status === 'ativa');

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Evangelização Infantil</h1>
          <p className="admin-page-subtitle">Catequese e formação de crianças</p>
        </div>
      </div>

      {/* Stats */}
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
            Turmas Ativas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {turmasAtivas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Crianças
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {criancas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total de Turmas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {turmas.length}
          </p>
        </div>
      </div>

      {/* Menu Rápido */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/admin/evangelizacao/turmas" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          👨‍🎓 Turmas
        </Link>
        <Link href="/admin/evangelizacao/criancas" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          👶 Crianças
        </Link>
      </div>

      {/* Turmas */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Turmas Ativas</h2>
          <Link href="/admin/evangelizacao/turmas/nova" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
            ➕ Nova Turma
          </Link>
        </div>

        {turmasAtivas.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {turmasAtivas.map((turma: any) => (
              <Link
                key={turma.id}
                href={`/admin/evangelizacao/turmas/${turma.id}`}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--admin-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>
                  {turma.nome}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  👥 {turma.faixa_etaria}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  🕐 {turma.horario}
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  📍 {turma.sala} (cap: {turma.capacidade})
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--admin-bg)',
            borderRadius: '0.6rem',
            color: 'var(--muted)',
          }}>
            <p>Nenhuma turma ativa. Crie uma para começar!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvangelizacaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EvangelizacaoContent />
    </Suspense>
  );
}
