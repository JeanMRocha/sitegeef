import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institucional - GEEF",
  description:
    "Credibilidade, filiações e reconhecimentos da GEEF. Federação Espírita Brasileira, REUNIR II Serrana, 45º CEU.",
};

export default function InstitucionalPage() {
  return (
    <main className="public-page">
      <section className="content-hero public-hero-shell">
        <div className="public-hero-grid">
          <div className="content-copy">
            <p className="eyebrow">Credibilidade</p>
            <h1>Filiações e estrutura institucional</h1>
            <p className="content-summary">
              O GEEF atua em alinhamento com a organização federativa espírita,
              preservando clareza institucional, vínculo doutrinário e
              responsabilidade pública.
            </p>
            <p className="content-intro">
              A página deixa de parecer uma lista de blocos soltos e passa a
              comunicar a relação entre as entidades de forma mais elegante,
              legível e hierarquizada.
            </p>
          </div>

          <aside className="content-panel">
            <p className="content-panel-label">Resumo institucional</p>
            <ul className="public-structure-list">
              <li>
                <strong>FEB</strong>
                Federação Espírita Brasileira
              </li>
              <li>
                <strong>REUNIR II</strong>
                Serrana, Rio de Janeiro
              </li>
              <li>
                <strong>45º CEU</strong>
                Coordenação regional
              </li>
              <li>
                <strong>GEEF</strong>
                Casa espírita filiada
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="public-showcase">
        <article className="content-card">
          <p className="eyebrow">FEB</p>
          <h2>Federação Espírita Brasileira</h2>
          <p>
            A FEB é a instituição máxima de representação do espiritismo no
            país, com atuação nacional em educação, pesquisa, publicações e
            integração federativa.
          </p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Missão: disseminar a Doutrina Espírita.
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Estrutura: coordenação federativa nacional.
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Presença: movimento espírita no Brasil e no exterior.
            </li>
          </ul>
          <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
            <a
              href="https://www.febnet.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              Visitar febnet.org.br
            </a>
          </div>
        </article>

        <aside className="public-showcase-panel">
          <p className="content-panel-label">Estrutura</p>
          <div className="public-trust-grid" style={{ gridTemplateColumns: "1fr", marginTop: "0.85rem" }}>
            <div className="public-trust-item">
              <strong>REUNIR II Serrana</strong>
              <span>Integração e unidade na região serrana do RJ.</span>
            </div>
            <div className="public-trust-item">
              <strong>45º CEU</strong>
              <span>Coordenação regional que orienta o conjunto de casas.</span>
            </div>
            <div className="public-trust-item">
              <strong>GEEF</strong>
              <span>Atua com estudo, prática e serviço fraterno.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="public-feature-band">
        <article className="public-feature-tile">
          <h2 className="public-feature-title">REUNIR II Serrana</h2>
          <p className="public-feature-text">
            Estrutura regional responsável por promover unidade de doutrina,
            ação e fraternidade entre os centros espíritas da Serra do Rio.
          </p>
        </article>

        <article className="public-feature-tile">
          <h2 className="public-feature-title">45º Centro Espírita Unificado</h2>
          <p className="public-feature-text">
            Coordenação que integra e orienta os centros da área, mantendo
            coerência doutrinária e cooperação institucional.
          </p>
        </article>

        <article className="public-feature-tile">
          <h2 className="public-feature-title">Compromisso público</h2>
          <p className="public-feature-text">
            Transparência, serviço e educação espírita com linguagem clara e
            apresentação institucional mais refinada.
          </p>
        </article>
      </section>

      <section className="content-grid" aria-label="Resumo do GEEF">
        <article className="content-card">
          <h2>GEEF</h2>
          <p>
            O Grupo de Estudo Esotérico Familial atua como casa espírita
            filiada, promovendo reuniões públicas, evangelização, palestras e
            passes.
          </p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Filiação à FEB
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Integração à REUNIR II Serrana
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Coordenação no 45º CEU
            </li>
          </ul>
        </article>

        <article className="content-card">
          <h2>Compromisso</h2>
          <p>
            A apresentação institucional reforça a identidade da casa sem
            excesso visual, com prioridade para credibilidade, leitura rápida e
            hierarquia clara.
          </p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Doutrina
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Transparência
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              Fraternidade
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
