import { Metadata } from "next";
import { getRequestLocale } from "@/lib/multilingual/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "en" ? "Institutional | GEEF" : "Institucional - GEEF",
    description:
      locale === "en"
        ? "Credibility, affiliations and recognitions of GEEF. Brazilian Spiritist Federation, REUNIR II Serrana, 45th CEU."
        : "Credibilidade, filiações e reconhecimentos da GEEF. Federação Espírita Brasileira, REUNIR II Serrana, 45º CEU.",
  };
}

export default async function InstitucionalPage() {
  const locale = await getRequestLocale();
  const copy =
    locale === "en"
      ? {
          eyebrow: "Credibility",
          title: "Affiliations and institutional structure",
          summary:
            "GEEF acts in alignment with the Spiritist federative organization, preserving institutional clarity, doctrinal alignment and public responsibility.",
          intro:
            "This page no longer feels like a collection of separate blocks and instead communicates the relationship between entities in a more elegant, readable and hierarchical way.",
          summaryLabel: "Institutional summary",
          feb: "Brazilian Spiritist Federation",
          reunir: "Regional integration and unity in the Serra do RJ",
          ceu: "Regional coordination guiding the set of houses",
          geef: "Spiritist house affiliated",
          febText:
            "FEB is the main representative institution of Spiritism in Brazil, with national work in education, research, publications and federative integration.",
          febList1: "Mission: spread Spiritist Doctrine.",
          febList2: "Structure: national federative coordination.",
          febList3: "Presence: Spiritist movement in Brazil and abroad.",
          visit: "Visit febnet.org.br",
          structure: "Structure",
          reunirText:
            "Regional structure responsible for promoting doctrinal, operational and fraternal unity among Spiritist centers in the Serra region.",
          ceuText:
            "Coordination that integrates and guides the centers in the area, maintaining doctrinal coherence and institutional cooperation.",
          geefText:
            "Acts with study, practice and fraternal service.",
          regionalCompromiseTitle: "Regional integration",
          regionalCompromiseText:
            "Doctrine, transparency and service with a more refined institutional presentation.",
          geefSummary:
            "GEEF acts as an affiliated Spiritist house, promoting public meetings, evangelization, lectures and passes.",
          commitmentTitle: "Commitment",
          commitmentText:
            "The institutional presentation reinforces the identity of the house without visual excess, with priority on credibility, quick reading and clear hierarchy.",
        }
      : {
          eyebrow: "Credibilidade",
          title: "Filiações e estrutura institucional",
          summary:
            "O GEEF atua em alinhamento com a organização federativa espírita, preservando clareza institucional, vínculo doutrinário e responsabilidade pública.",
          intro:
            "A página deixa de parecer uma lista de blocos soltos e passa a comunicar a relação entre as entidades de forma mais elegante, legível e hierarquizada.",
          summaryLabel: "Resumo institucional",
          feb: "Federação Espírita Brasileira",
          reunir: "Integração e unidade na região serrana do RJ",
          ceu: "Coordenação regional que orienta o conjunto de casas",
          geef: "Casa espírita filiada",
          febText:
            "A FEB é a instituição máxima de representação do espiritismo no país, com atuação nacional em educação, pesquisa, publicações e integração federativa.",
          febList1: "Missão: disseminar a Doutrina Espírita.",
          febList2: "Estrutura: coordenação federativa nacional.",
          febList3: "Presença: movimento espírita no Brasil e no exterior.",
          visit: "Visitar febnet.org.br",
          structure: "Estrutura",
          reunirText:
            "Estrutura regional responsável por promover unidade de doutrina, ação e fraternidade entre os centros espíritas da Serra do Rio.",
          ceuText:
            "Coordenação que integra e orienta os centros da área, mantendo coerência doutrinária e cooperação institucional.",
          geefText:
            "Atua com estudo, prática e serviço fraterno.",
          regionalCompromiseTitle: "Compromisso público",
          regionalCompromiseText:
            "Transparência, serviço e educação espírita com linguagem clara e apresentação institucional mais refinada.",
          geefSummary:
            "O Grupo de Estudo Esotérico Familial atua como casa espírita filiada, promovendo reuniões públicas, evangelização, palestras e passes.",
          commitmentTitle: "Compromisso",
          commitmentText:
            "A apresentação institucional reforça a identidade da casa sem excesso visual, com prioridade para credibilidade, leitura rápida e hierarquia clara.",
        };

  return (
    <main className="public-page public-page--animated">
      <section className="content-hero public-hero-shell">
        <div className="public-hero-grid">
          <div className="content-copy">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <div className="content-copy-body">
              <p className="content-summary">{copy.summary}</p>
              <p className="content-intro">{copy.intro}</p>
            </div>
          </div>

          <aside className="content-panel">
            <p className="content-panel-label">{copy.summaryLabel}</p>
            <ul className="public-structure-list">
              <li>
                <strong>FEB</strong>
                {copy.feb}
              </li>
              <li>
                <strong>REUNIR II</strong>
                {copy.reunir}
              </li>
              <li>
                <strong>45º CEU</strong>
                {copy.ceu}
              </li>
              <li>
                <strong>GEEF</strong>
                {copy.geef}
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="public-showcase">
          <article className="content-card">
          <p className="eyebrow">FEB</p>
          <h2>{copy.feb}</h2>
          <p>{copy.febText}</p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {copy.febList1}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {copy.febList2}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {copy.febList3}
            </li>
          </ul>
          <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
            <a
              href="https://www.febnet.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              {copy.visit}
            </a>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <p className="content-panel-label">{copy.structure}</p>
            <div className="public-trust-grid" style={{ gridTemplateColumns: "1fr", marginTop: "0.85rem" }}>
              <div className="public-trust-item">
                <strong>REUNIR II Serrana</strong>
                <span>{copy.reunirText}</span>
              </div>
              <div className="public-trust-item">
                <strong>45º CEU</strong>
                <span>{copy.ceuText}</span>
              </div>
              <div className="public-trust-item">
                <strong>GEEF</strong>
                <span>{copy.geefText}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="content-grid" aria-label={locale === "en" ? "GEEF summary" : "Resumo do GEEF"}>
        <article className="content-card">
          <h2>GEEF</h2>
          <p>{copy.geefSummary}</p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Affiliation to FEB" : "Filiação à FEB"}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Integration with REUNIR II Serrana" : "Integração à REUNIR II Serrana"}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en"
                ? "Coordination in 45th CEU"
                : "Coordenação no 45º CEU"}
            </li>
          </ul>
        </article>

        <article className="content-card">
          <h2>{copy.commitmentTitle}</h2>
          <p>{copy.commitmentText}</p>
          <ul className="public-info-list">
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Doctrine" : "Doutrina"}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Transparency" : "Transparência"}
            </li>
            <li>
              <span className="mini-dot" aria-hidden="true" />
              {locale === "en" ? "Fraternity" : "Fraternidade"}
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
}
