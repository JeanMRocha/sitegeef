import Link from "next/link";
import { getInstituicao } from "../actions";
import { Suspense } from "react";
import { contentPages, site } from "@/lib/site-data";

export const metadata = {
  title: "Identificação - Instituição - Admin GEEF",
};

const QUEM_SOMOS = contentPages["quem-somos"];

const FALLBACK_INSTITUICAO = {
  nome_oficial: site.name,
  nome_curto: site.shortName,
  cnpj: undefined as string | undefined,
  natureza_juridica: undefined as string | undefined,
  porte: undefined as string | undefined,
  data_fundacao: undefined as string | undefined,
  cnae_principal: undefined as string | undefined,
  cnae_descricao: undefined as string | undefined,
};

function formatCnpj(value: string | undefined) {
  const digits = value?.replace(/\D/g, '') || '';
  if (digits.length !== 14) {
    return value || "—";
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatDate(value: string | undefined) {
  if (!value) {
    return "—";
  }

  const datePart = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  return value;
}

async function IdentificacaoContent() {
  const instituicao = await getInstituicao();
  const instituicaoBase = instituicao ?? FALLBACK_INSTITUICAO;

  return (
    <div className="area-page">
      <section className="area-hero">
        <div className="area-hero-top">
          <div>
            <p className="area-subtitle">Instituição</p>
            <h1 className="area-hero-title">Identificação</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {!instituicao ? <span className="inline-status inline-status-warning">Base do site</span> : null}
            <Link href="/admin/instituicao/identificacao/editar" className="profile-form-btn profile-form-btn-primary">
              Editar
            </Link>
          </div>
        </div>
      </section>

      <section className="area-section">
        <div className="table-surface">
          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div className="area-panel-item">
              <strong>Nome oficial</strong>
              <p>{instituicaoBase.nome_oficial}</p>
            </div>
            <div className="area-panel-item">
              <strong>Nome curto</strong>
              <p>{instituicaoBase.nome_curto || "—"}</p>
            </div>
            <div className="area-panel-item">
              <strong>CNPJ</strong>
              <p>{formatCnpj(instituicaoBase.cnpj)}</p>
            </div>
            <div className="area-panel-item">
              <strong>Natureza Jurídica</strong>
              <p>{instituicaoBase.natureza_juridica || "—"}</p>
            </div>
            <div className="area-panel-item">
              <strong>Porte</strong>
              <p>{instituicaoBase.porte || "—"}</p>
            </div>
            <div className="area-panel-item">
              <strong>Data de fundação</strong>
              <p>{formatDate(instituicaoBase.data_fundacao)}</p>
            </div>
            <div className="area-panel-item">
              <strong>Código CNAE</strong>
              <p>{instituicaoBase.cnae_principal || "—"}</p>
            </div>
            <div className="area-panel-item">
              <strong>Descrição da Atividade</strong>
              <p>{instituicaoBase.cnae_descricao || "—"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function IdentificacaoPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <IdentificacaoContent />
    </Suspense>
  );
}
