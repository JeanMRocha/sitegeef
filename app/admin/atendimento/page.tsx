import Link from 'next/link';
import { getRecepcoes, getAtendimentosFraterno, getEvangelhasNoLar, getIrradiacoes } from './actions';
import { Suspense } from 'react';
import { checkPermission } from '@/lib/auth/permissions';

export const metadata = {
  title: 'Atendimento - Admin GEEF',
};

async function AtendimentoContent() {
  const allowed = await checkPermission('pode_atendimento');

  if (!allowed) {
    return (
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-page-title">🔒 Módulo Restrito</h1>
          <p className="admin-page-subtitle">Acesso negado ao Atendimento Espiritual</p>
        </div>
      </div>
    );
  }

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const recepcoes = await getRecepcoes(mesAtual, anoAtual);
  const fraternos = await getAtendimentosFraterno(mesAtual, anoAtual);
  const evangelhos = await getEvangelhasNoLar();
  const irradiacoes = await getIrradiacoes(true);

  const totalPessoasAtendidas = recepcoes.reduce((sum: number, r: any) => sum + r.pessoas_atendidas, 0);

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Atendimento Espiritual</h1>
          <p className="admin-page-subtitle">
            {new Date(anoAtual, mesAtual - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
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
            Atendimentos Recepção
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {recepcoes.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Pessoas Atendidas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {totalPessoasAtendidas}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Atendimentos Fraternos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {fraternos.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Irradiações Ativas
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {irradiacoes.length}
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
        <Link href="/admin/atendimento/recepcao" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          👥 Recepção
        </Link>
        <Link href="/admin/atendimento/fraterno" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          🤝 Fraterno
        </Link>
        <Link href="/admin/atendimento/evangelhos-lar" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          🏠 Evangelho no Lar
        </Link>
        <Link href="/admin/atendimento/irradiacao" className="admin-btn" style={{
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'rgba(249, 115, 22, 0.05)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          color: 'var(--text)',
          textDecoration: 'none',
          borderRadius: '0.6rem',
          fontWeight: 500,
        }}>
          ✨ Irradiação
        </Link>
      </div>

      {/* Recentes */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Últimos Atendimentos</h2>
          <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-small">
            Ver Todos →
          </Link>
        </div>

        {fraternos.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fraternos.slice(0, 5).map((atend: any) => (
              <div
                key={atend.id}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--admin-bg)',
                  borderRadius: '0.6rem',
                  borderLeft: atend.sigilo ? '4px solid #ef4444' : '4px solid #3b82f6',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontWeight: 600 }}>
                      {atend.pessoas?.nome}
                    </p>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                      {new Date(atend.data).toLocaleDateString('pt-BR')} • {atend.tipo}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Atendente: {atend.atendente?.nome}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.35rem 0.7rem',
                    backgroundColor: atend.sigilo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: atend.sigilo ? '#ef4444' : '#22c55e',
                    borderRadius: '0.3rem',
                    fontSize: '0.85rem',
                  }}>
                    {atend.sigilo ? '🔒 Sigiloso' : 'Registro'}
                  </span>
                </div>
              </div>
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
            <p>Nenhum atendimento neste mês.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AtendimentoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <AtendimentoContent />
    </Suspense>
  );
}
