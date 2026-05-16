import Link from 'next/link';
import { getCursos, getTurmas } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Estudos - Admin GEEF',
};

async function EstudosContent() {
  const cursos = await getCursos();
  const turmas = await getTurmas();
  const turmasAtivas = turmas.filter((t: any) => t.status === 'em_andamento');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Estudos Doutrinários</h1>
          <p className="admin-page-subtitle">Gestão de cursos e turmas de estudo</p>
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
            Cursos Ativos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {cursos.filter((c: any) => c.ativo).length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Turmas em Andamento
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
            Total de Turmas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {turmas.length}
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <Link href="/admin/estudos/cursos" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          📚 Cursos
        </Link>
        <Link href="/admin/estudos/turmas" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          👨‍🏫 Turmas
        </Link>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Cursos Disponíveis</h2>

        {cursos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {cursos.map((curso: any) => (
              <Link
                key={curso.id}
                href={`/admin/estudos/cursos/${curso.id}`}
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
                  {curso.nome}
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {curso.descricao || 'Sem descrição'}
                </p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  backgroundColor: curso.ativo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  color: curso.ativo ? '#22c55e' : '#6b7280',
                  borderRadius: '0.3rem',
                  fontSize: '0.8rem',
                }}>
                  {curso.ativo ? '✓ Ativo' : '✕ Inativo'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum curso cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default function EstudosPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EstudosContent />
    </Suspense>
  );
}
