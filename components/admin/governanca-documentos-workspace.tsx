"use client";

import { useMemo, useState } from "react";

type DocSection = {
  title: string;
  text: string;
};

type GovernanceDoc = {
  slug: string;
  title: string;
  kicker: string;
  status: string;
  updatedAt: string;
  version: string;
  responsible: string;
  purpose: string;
  summary: string;
  sections: DocSection[];
};

const DOCUMENTS: GovernanceDoc[] = [
  {
    slug: "estatuto-social",
    title: "Estatuto Social",
    kicker: "Documento legal principal",
    status: "Ativo",
    updatedAt: "2026-05-20",
    version: "v1.4",
    responsible: "Secretaria + Diretoria",
    purpose: "Base jurídica da instituição e referência para toda a estrutura de governança.",
    summary:
      "Define natureza, finalidades, composição institucional, regras de assembleia e governança.",
    sections: [
      {
        title: "Identidade da instituição",
        text:
          "Reúne nome, finalidade, sede, duração e princípios de atuação da casa em linguagem institucional contínua.",
      },
      {
        title: "Assembleias e deliberações",
        text:
          "Organiza quórum, convocação, deliberação, registro e validade das decisões tomadas pelos associados.",
      },
      {
        title: "Alterações e vigência",
        text:
          "Mantém o histórico de revisões, aprovações e vigência do texto principal para leitura e auditoria.",
      },
    ],
  },
  {
    slug: "cnpj",
    title: "CNPJ",
    kicker: "Registro da pessoa jurídica",
    status: "Ativo",
    updatedAt: "2026-05-20",
    version: "v1.0",
    responsible: "Contabilidade + Secretaria",
    purpose: "Concentra o registro cadastral da pessoa jurídica e seus dados de comprovação.",
    summary:
      "Exibe identificação fiscal, situação cadastral, abertura, responsável e vínculos administrativos.",
    sections: [
      {
        title: "Dados cadastrais",
        text:
          "Mostra número, razão social, data de abertura e situação cadastral de forma objetiva e verificável.",
      },
      {
        title: "Comprovação",
        text:
          "Mantém o texto e os campos de conferência para uso interno e emissão de documentos complementares.",
      },
    ],
  },
  {
    slug: "registro-cartorio",
    title: "Registro em Cartório",
    kicker: "Registro civil",
    status: "Em revisão",
    updatedAt: "2026-05-19",
    version: "v0.8",
    responsible: "Secretaria",
    purpose: "Reúne a prova de registro e os dados de oficialização da instituição.",
    summary:
      "Estrutura o histórico do cartório, livro, folha, data e observações de atualização.",
    sections: [
      {
        title: "Livro e folha",
        text:
          "Apresenta os dados do registro em texto corrido, com campo para observações e checagem.",
      },
      {
        title: "Observações do cartório",
        text:
          "Espaço para anotações de exigências, averbações e ajustes necessários ao acompanhamento documental.",
      },
    ],
  },
  {
    slug: "diretoria-constituida",
    title: "Diretoria constituída",
    kicker: "Corpo administrativo",
    status: "Ativo",
    updatedAt: "2026-05-18",
    version: "v2.1",
    responsible: "Presidência",
    purpose: "Lista a composição vigente e os papéis que respondem pela administração.",
    summary:
      "Estrutura em leitura contínua para consulta rápida da diretoria atual e suas funções.",
    sections: [
      {
        title: "Composição atual",
        text:
          "Exibe presidente, vice, secretarias e tesouraria com data de posse e validade do mandato.",
      },
      {
        title: "Responsabilidades",
        text:
          "Descreve em linguagem clara as tarefas e limites de atuação de cada função da diretoria.",
      },
    ],
  },
  {
    slug: "regimento-interno",
    title: "Regimento Interno",
    kicker: "Rotina institucional",
    status: "Rascunho",
    updatedAt: "2026-05-17",
    version: "v0.6",
    responsible: "Governança",
    purpose: "Normas internas para organizar setores, funções e rotinas da instituição.",
    summary:
      "Documenta funcionamento, fluxos, responsabilidades e regras de convivência institucional.",
    sections: [
      {
        title: "Setores e funções",
        text:
          "Organiza departamentos, atribuições e dependências para leitura do texto como documento vivo.",
      },
      {
        title: "Rotinas e atualização",
        text:
          "Permite controlar versões, vigência e revisões sem depender de PDF fixo para cada mudança.",
      },
    ],
  },
];

function formatDate(value: string) {
  return new Date(value + "T12:00:00").toLocaleDateString("pt-BR");
}

export function GovernancaDocumentosWorkspace() {
  const [activeSlug, setActiveSlug] = useState(DOCUMENTS[0].slug);
  const activeDoc = useMemo(
    () => DOCUMENTS.find((doc) => doc.slug === activeSlug) ?? DOCUMENTS[0],
    [activeSlug],
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const payload = [
      `${activeDoc.title}`,
      `${activeDoc.kicker}`,
      `Versão: ${activeDoc.version}`,
      `Atualizado em: ${formatDate(activeDoc.updatedAt)}`,
      `Responsável: ${activeDoc.responsible}`,
      "",
      `Objetivo`,
      activeDoc.purpose,
      "",
      `Resumo`,
      activeDoc.summary,
      "",
      ...activeDoc.sections.flatMap((section) => [
        section.title,
        section.text,
        "",
      ]),
    ].join("\n");

    const blob = new Blob([payload], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeDoc.slug}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}#${activeDoc.slug}`;
    await navigator.clipboard.writeText(link);
  };

  return (
    <div className="governance-docs-shell">
      <aside className="governance-doc-index">
        <div className="governance-doc-index-card">
          <span className="governance-doc-kicker">Índice</span>
          <h2>Documentos institucionais</h2>
          <p>
            Leitura online, com exportação e impressão como ações secundárias.
          </p>
          <div className="governance-doc-index-list">
            {DOCUMENTS.map((doc) => {
              const selected = doc.slug === activeSlug;
              return (
                <button
                  key={doc.slug}
                  type="button"
                  onClick={() => setActiveSlug(doc.slug)}
                  className={`governance-doc-index-item ${selected ? "is-active" : ""}`}
                >
                  <span className="governance-doc-index-title">{doc.title}</span>
                  <span className="governance-doc-index-meta">
                    {doc.status} · {doc.version}
                  </span>
                  <span className="governance-doc-index-note">{doc.summary}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="governance-doc-reader">
        <div className="governance-doc-reader-hero" id={activeDoc.slug}>
          <div>
            <span className="governance-doc-kicker">{activeDoc.kicker}</span>
            <h2>{activeDoc.title}</h2>
            <p>{activeDoc.summary}</p>
          </div>

          <div className="governance-doc-chip-row">
            <span className="governance-doc-chip">{activeDoc.status}</span>
            <span className="governance-doc-chip">{activeDoc.version}</span>
            <span className="governance-doc-chip">{formatDate(activeDoc.updatedAt)}</span>
          </div>
        </div>

        <article className="governance-doc-paper">
          <section className="governance-doc-section">
            <h3>Visão geral</h3>
            <p>{activeDoc.purpose}</p>
          </section>

          <section className="governance-doc-section">
            <h3>Leitura contínua</h3>
            <div className="governance-doc-reading-flow">
              {activeDoc.sections.map((section, index) => (
                <div key={section.title} className="governance-doc-flow-block">
                  <span className="governance-doc-flow-step">{index + 1}</span>
                  <div>
                    <strong>{section.title}</strong>
                    <p>{section.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="governance-doc-section">
            <h3>Estrutura inicial</h3>
            <ul className="governance-doc-list">
              <li><strong>Estatuto Social</strong> - Documento legal principal da instituição</li>
              <li><strong>CNPJ</strong> - Registro da pessoa jurídica</li>
              <li><strong>Registro em Cartório</strong> - Registro no Cartório de Pessoas Jurídicas</li>
              <li><strong>Diretoria constituída</strong> - Corpo responsável pela administração</li>
              <li><strong>Regimento Interno</strong> - Documento complementar para organizar setores, funções e rotinas</li>
            </ul>
          </section>
        </article>
      </section>

      <aside className="governance-doc-meta">
        <div className="governance-doc-meta-card">
          <span className="governance-doc-kicker">Metadados</span>
          <dl className="governance-doc-meta-list">
            <div>
              <dt>Responsável</dt>
              <dd>{activeDoc.responsible}</dd>
            </div>
            <div>
              <dt>Versão</dt>
              <dd>{activeDoc.version}</dd>
            </div>
            <div>
              <dt>Última atualização</dt>
              <dd>{formatDate(activeDoc.updatedAt)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{activeDoc.status}</dd>
            </div>
          </dl>
        </div>

        <div className="governance-doc-meta-card">
          <span className="governance-doc-kicker">Ações</span>
          <div className="governance-doc-actions">
            <button type="button" className="governance-doc-action-button" onClick={handleExport}>
              Exportar documento
            </button>
            <button type="button" className="governance-doc-action-button" onClick={handlePrint}>
              Imprimir
            </button>
            <button type="button" className="governance-doc-action-button" onClick={handleCopyLink}>
              Copiar link
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
