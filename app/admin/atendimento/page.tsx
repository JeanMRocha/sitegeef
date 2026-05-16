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
  const summary = [
    { label: "Recepção", value: recepcoes.length, note: "Registros no mês" },
    { label: "Pessoas atendidas", value: totalPessoasAtendidas, note: "Total consolidado" },
    { label: "Fraterno", value: fraternos.length, note: "Histórico recente" },
    { label: "Irradiações", value: irradiacoes.length, note: "Ativas" },
    { label: "Evangelho no Lar", value: evangelhos.length, note: "Sessões registradas" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Atendimento</span>
          <h1 className="admin-page-title">Atendimento Espiritual</h1>
          <p className="admin-page-subtitle">
            {new Date(anoAtual, mesAtual - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="admin-actions">
          <Link href="/admin/atendimento/recepcao" className="admin-btn admin-btn-secondary">
            👥 Recepção
          </Link>
          <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-secondary">
            🤝 Fraterno
          </Link>
        </div>
      </div>

      <section className="area-section">
        <div className="stat-grid">
          {summary.map((item) => (
            <div key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <span>{item.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="area-section">
        <div className="module-grid">
          <Link href="/admin/atendimento/recepcao" className="module-card">
            <p className="module-title">👥 Recepção</p>
            <p>Registros de acolhimento e atendimentos da área.</p>
          </Link>
          <Link href="/admin/atendimento/fraterno" className="module-card">
            <p className="module-title">🤝 Fraterno</p>
            <p>Acompanhamento dos atendimentos fraternos recentes.</p>
          </Link>
          <Link href="/admin/atendimento/evangelhos-lar" className="module-card">
            <p className="module-title">🏠 Evangelho no Lar</p>
            <p>Sessões e cadastros do evangelho no lar.</p>
          </Link>
          <Link href="/admin/atendimento/irradiacao" className="module-card">
            <p className="module-title">✨ Irradiação</p>
            <p>Monitoramento de atividades ativas e histórico.</p>
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Últimos atendimentos</h2>
            <Link href="/admin/atendimento/fraterno" className="admin-btn admin-btn-small">
            Ver Todos →
            </Link>
          </div>

          {fraternos.length > 0 ? (
            <div className="area-panel-grid">
              {fraternos.slice(0, 5).map((atend: any) => (
                <div
                  key={atend.id}
                  className="area-panel-item"
                  style={{
                    borderLeft: atend.sigilo ? '4px solid #ef4444' : '4px solid #3b82f6',
                    paddingLeft: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                    <div>
                      <strong>{atend.pessoas?.nome}</strong>
                      <p>
                        {new Date(atend.data).toLocaleDateString('pt-BR')} • {atend.tipo}
                        <br />
                        Atendente: {atend.atendente?.nome}
                      </p>
                    </div>
                    <span className={atend.sigilo ? 'inline-status inline-status-danger' : 'inline-status inline-status-success'}>
                      {atend.sigilo ? 'Sigiloso' : 'Registro'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="area-empty">Nenhum atendimento neste mês.</div>
          )}
        </div>
      </section>
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
