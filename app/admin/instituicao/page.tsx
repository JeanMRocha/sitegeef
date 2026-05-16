import Link from 'next/link';
import { getInstituicao, getEnderecos, getContatos, getContasBancarias } from './actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Instituição - Admin GEEF',
};

async function InstituicaoContent() {
  const instituicao = await getInstituicao();
  const enderecos = await getEnderecos();
  const contatos = await getContatos();
  const contas = await getContasBancarias();

  const endereco = enderecos[0];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Instituição</h1>
          <p className="admin-page-subtitle">Dados oficiais do GEEF</p>
        </div>
        {instituicao && (
          <Link href="/admin/instituicao/editar" className="admin-btn admin-btn-primary">
            ✏️ Editar
          </Link>
        )}
      </div>

      {!instituicao ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>Nenhum dado institucional registrado.</p>
          <Link href="/admin/instituicao/editar" className="admin-btn admin-btn-primary">
            ➕ Cadastrar Dados Institucionais
          </Link>
        </div>
      ) : (
        <>
          {/* Seção 1: Dados Básicos */}
          <div className="admin-card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🏛️ Dados Básicos</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Nome Oficial</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 600 }}>{instituicao.nome_oficial}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Nome Curto</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>{instituicao.nome_curto || '—'}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>CNPJ</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>{instituicao.cnpj || '—'}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Data de Fundação</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>
                  {instituicao.data_fundacao
                    ? new Date(instituicao.data_fundacao).toLocaleDateString('pt-BR')
                    : '—'}
                </p>
              </div>
            </div>

            {instituicao.missao && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Missão</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', lineHeight: 1.5 }}>{instituicao.missao}</p>
              </div>
            )}
          </div>

          {/* Seção 2: Endereço */}
          {endereco && (
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📍 Endereço</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Logradouro</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>
                    {endereco.logradouro ? `${endereco.logradouro}, ${endereco.numero}` : '—'}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Bairro</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>{endereco.bairro || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>CEP</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>{endereco.cep || '—'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Cidade</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>{endereco.cidade || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>Estado</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1rem' }}>{endereco.estado || '—'}</p>
                </div>
              </div>

              {endereco.maps_link && (
                <div style={{ marginTop: '1rem' }}>
                  <a href={endereco.maps_link} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary">
                    🗺️ Ver no Google Maps
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Seção 3: Contatos */}
          <div className="admin-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>📞 Contatos</h2>
              <Link href="/admin/instituicao/contatos" className="admin-btn admin-btn-small">
                ➕ Adicionar
              </Link>
            </div>

            {contatos.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhum contato registrado.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {contatos.map((contato: any) => (
                  <div
                    key={contato.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--admin-bg)',
                      borderRadius: '0.6rem',
                      border: '1px solid var(--admin-border)',
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 600, marginBottom: '0.5rem' }}>{contato.tipo || 'Contato'}</p>
                    {contato.telefone && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>☎️ {contato.telefone}</p>}
                    {contato.whatsapp && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>💬 {contato.whatsapp}</p>}
                    {contato.email && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>📧 {contato.email}</p>}
                    {contato.instagram && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>📸 {contato.instagram}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção 4: Contas Bancárias */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>🏦 Contas Bancárias e PIX</h2>
              <Link href="/admin/instituicao/contas" className="admin-btn admin-btn-small">
                ➕ Adicionar
              </Link>
            </div>

            {contas.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Nenhuma conta registrada.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Banco</th>
                      <th>Conta</th>
                      <th>Finalidade</th>
                      <th>PIX</th>
                      <th>Visibilidade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contas.map((conta: any) => (
                      <tr key={conta.id}>
                        <td style={{ fontWeight: 600 }}>{conta.banco || '—'}</td>
                        <td style={{ fontSize: '0.9rem' }}>
                          {conta.agencia ? `${conta.agencia} / ${conta.conta}` : '—'}
                        </td>
                        <td style={{ fontSize: '0.9rem' }}>{conta.finalidade || '—'}</td>
                        <td style={{ fontSize: '0.9rem' }}>{conta.chave_pix ? '✅' : '—'}</td>
                        <td style={{ fontSize: '0.9rem' }}>
                          {conta.visibilidade === 'publica' ? '🌐 Pública' : '🔒 Privada'}
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: conta.ativo ? 'rgba(99, 213, 31, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                              color: conta.ativo ? 'var(--leaf)' : 'var(--muted)',
                            }}
                          >
                            {conta.ativo ? '✅ Ativa' : '❌ Inativa'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function InstituicaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <InstituicaoContent />
    </Suspense>
  );
}
