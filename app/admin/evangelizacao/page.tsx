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
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Formação infantil</p>
            <h1 className="area-hero-title">Evangelização Infantil</h1>
          </div>
          <Link href="/admin/evangelizacao/turmas/nova" className="profile-form-btn profile-form-btn-primary">
            Nova Turma
          </Link>
        </div>
        <p className="area-subtitle">Catequese, turmas e acompanhamento das crianças.</p>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-label">Turmas ativas</span>
          <strong>{turmasAtivas.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Crianças</span>
          <strong>{criancas.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Total de turmas</span>
          <strong>{turmas.length}</strong>
        </article>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Acessos rápidos</h2>
          <p>Atalhos para os cadastros mais usados do módulo.</p>
        </div>
        <div className="module-grid">
          <Link href="/admin/evangelizacao/turmas" className="module-card">
            <h3 className="module-title">Turmas</h3>
            <p>Gerencie encontros, horários e responsáveis.</p>
          </Link>
          <Link href="/admin/evangelizacao/criancas" className="module-card">
            <h3 className="module-title">Crianças</h3>
            <p>Cadastre e acompanhe os participantes.</p>
          </Link>
        </div>
      </section>

      <section className="area-section">
        <div className="area-section-title">
          <h2>Turmas ativas</h2>
          <p>Cards de acesso rápido para abrir cada turma.</p>
        </div>
        <div className="table-surface">
          {turmasAtivas.length > 0 ? (
            <div className="module-grid">
              {turmasAtivas.map((turma: any) => (
                <Link key={turma.id} href={`/admin/evangelizacao/turmas/${turma.id}`} className="module-card">
                  <h3 className="module-title">{turma.nome}</h3>
                  <div className="tag-list">
                    <span className="tag">{turma.faixa_etaria}</span>
                    <span className="tag">{turma.horario}</span>
                  </div>
                  <p>{turma.sala} | cap: {turma.capacidade}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="area-empty">Nenhuma turma ativa. Crie uma para começar.</div>
          )}
        </div>
      </section>
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
