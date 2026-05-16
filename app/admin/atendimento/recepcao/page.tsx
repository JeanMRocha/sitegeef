import Link from 'next/link';
import { getRecepcoes } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Recepção - Admin GEEF',
};

async function RecepcaoContent({ searchParams }: { searchParams: { mes?: string; ano?: string } }) {
  const hoje = new Date();
  const mes = searchParams.mes ? parseInt(searchParams.mes) : hoje.getMonth() + 1;
  const ano = searchParams.ano ? parseInt(searchParams.ano) : hoje.getFullYear();

  const recepcoes = await getRecepcoes(mes, ano);
  const mesTexto = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Atendimento presencial</p>
            <h1 className="area-hero-title">Recepção</h1>
          </div>
          <Link href="/admin/atendimento/recepcao/novo" className="profile-form-btn profile-form-btn-primary">
            Novo Atendimento
          </Link>
        </div>
        <p className="area-subtitle">{mesTexto}</p>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <form method="get" className="module-grid" style={{ alignItems: 'end' }}>
            <label className="profile-form-field">
              <span>Mês</span>
              <select name="mes" defaultValue={mes} className="profile-form-input">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{new Date(ano, m - 1).toLocaleDateString('pt-BR', { month: 'long' })}</option>
                ))}
              </select>
            </label>
            <label className="profile-form-field">
              <span>Ano</span>
              <select name="ano" defaultValue={ano} className="profile-form-input">
                {Array.from({ length: 5 }, (_, i) => ano - 2 + i).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>
            <div className="area-panel-item">
              <button type="submit" className="profile-form-btn profile-form-btn-primary">Filtrar</button>
            </div>
          </form>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Atendimentos</h2>
          <p>Registros do mês filtrado.</p>
        </div>
        <div className="table-surface">
          {recepcoes.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pessoas atendidas</th>
                  <th>Motivo geral</th>
                  <th>Encaminhamento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {recepcoes.map((rec: any) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 500 }}>{new Date(rec.data).toLocaleDateString('pt-BR')}</td>
                    <td style={{ fontWeight: 600, textAlign: 'center' }}>{rec.pessoas_atendidas}</td>
                    <td>{rec.motivo_geral}</td>
                    <td style={{ color: 'var(--muted)' }}>{rec.encaminhamento || '—'}</td>
                    <td>
                      <Link href={`/admin/atendimento/recepcao/${rec.id}`} className="profile-form-btn profile-form-btn-secondary">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="area-empty">Nenhum atendimento de recepção neste período.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default async function RecepcaoPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <RecepcaoContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

