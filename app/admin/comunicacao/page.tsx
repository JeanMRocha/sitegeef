import Link from 'next/link';
import { getPublicacoes } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Comunicação - Admin GEEF',
};

async function ComunicacaoContent() {
  const publicacoes = await getPublicacoes();
  const publicadas = publicacoes.filter((p: any) => p.status === 'publicado');
  const rascunhos = publicacoes.filter((p: any) => p.status === 'rascunho');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Comunicação</h1>
          <p className="admin-page-subtitle">Gestão de publicações e conteúdo</p>
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
            Publicações Publicadas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {publicadas.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Rascunhos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {rascunhos.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Total
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {publicacoes.length}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/comunicacao/nova-publicacao" className="admin-btn admin-btn-primary">
          ➕ Nova Publicação
        </Link>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Publicações Recentes</h2>

        {publicacoes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Autor</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {publicacoes.map((publicacao: any) => (
                  <tr key={publicacao.id}>
                    <td style={{ fontWeight: 500, maxWidth: '200px' }}>
                      {publicacao.titulo}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {publicacao.tipo || '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {publicacao.autor?.nome}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        backgroundColor: publicacao.status === 'rascunho' ? 'rgba(107, 114, 128, 0.1)' : publicacao.status === 'revisao' ? 'rgba(168, 85, 247, 0.1)' : publicacao.status === 'aprovado' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: publicacao.status === 'rascunho' ? '#6b7280' : publicacao.status === 'revisao' ? '#a855f7' : publicacao.status === 'aprovado' ? '#3b82f6' : '#22c55e',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}>
                        {publicacao.status === 'rascunho' && '📝 Rascunho'}
                        {publicacao.status === 'revisao' && '🔍 Revisão'}
                        {publicacao.status === 'aprovado' && '✓ Aprovado'}
                        {publicacao.status === 'publicado' && '🔔 Publicado'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {publicacao.publicado_em ? new Date(publicacao.publicado_em).toLocaleDateString('pt-BR') : new Date(publicacao.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <Link href={`/admin/comunicacao/${publicacao.id}`} className="admin-btn admin-btn-small">
                        ✏️ Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhuma publicação cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default function ComunicacaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ComunicacaoContent />
    </Suspense>
  );
}
