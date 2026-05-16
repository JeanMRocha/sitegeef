import Link from 'next/link';
import { getModelosDocumentos } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Documentos e LGPD - Admin GEEF',
};

async function ModelosList() {
  const modelos = await getModelosDocumentos();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Documentos e LGPD</h1>
          <p className="admin-page-subtitle">Modelos de termos, consentimentos e voluntariado</p>
        </div>
        <Link href="/admin/documentos/novo" className="admin-btn admin-btn-primary">
          ➕ Novo Modelo
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
        <Link href="/admin/documentos" style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          📄 Modelos
        </Link>
        <Link href="/admin/documentos/termos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          ✍️ Termos Assinados
        </Link>
        <Link href="/admin/documentos/consentimentos" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          🔒 Consentimentos LGPD
        </Link>
        <Link href="/admin/documentos/voluntariado" style={{ paddingBottom: '0.5rem', color: 'var(--muted)', textDecoration: 'none' }}>
          🤝 Serviços Voluntários
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        {modelos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Nenhum modelo de documento cadastrado.</p>
            <Link href="/admin/documentos/novo" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
              ➕ Criar primeiro modelo
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Título</th>
                <th>Versão</th>
                <th>Conteúdo</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {modelos.map((modelo: any) => (
                <tr key={modelo.id}>
                  <td style={{ fontWeight: 600 }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.7rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: 'var(--primary)',
                      borderRadius: '0.4rem',
                      fontSize: '0.85rem',
                    }}>
                      {modelo.tipo}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{modelo.titulo}</td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{modelo.versao || '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {modelo.conteudo ? '✓ Sim' : '—'}
                  </td>
                  <td>
                    <Link href={`/admin/documentos/${modelo.id}`} className="admin-btn admin-btn-small">
                      ✏️ Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function DocumentosPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ModelosList />
    </Suspense>
  );
}
