"use client";

import { useEffect, useMemo, useState } from "react";
import type { Musica, MusicaParte, MusicaParteTipo, MusicaAutor } from "@/lib/musicas";

type MusicaEditorFormProps = {
  musica?: Musica | null;
  autores?: MusicaAutor[];
  action: (formData: FormData) => void;
  submitLabel?: string;
};

const PARTE_TIPOS: Array<{ value: MusicaParteTipo; label: string }> = [
  { value: "estrofe", label: "Estrofe" },
  { value: "refrao", label: "Refrão" },
  { value: "ponte", label: "Ponte" },
  { value: "intro", label: "Introdução" },
  { value: "cifra", label: "Cifra" },
];

function createParte(index: number): MusicaParte {
  return {
    ordem: index + 1,
    tipo: index === 1 ? "refrao" : "estrofe",
    titulo: index === 1 ? "Refrão" : `Parte ${index + 1}`,
    conteudo: "",
    cifra: "",
    destaque: index === 1,
  };
}

export function MusicaEditorForm({ musica, autores = [], action, submitLabel = "Salvar música" }: MusicaEditorFormProps) {
  const initialPartes = useMemo(() => {
    if (musica?.partes?.length) {
      return musica.partes;
    }

    return [createParte(0), createParte(1)];
  }, [musica]);

  const [partes, setPartes] = useState<MusicaParte[]>(initialPartes);

  useEffect(() => {
    setPartes(initialPartes);
  }, [initialPartes]);

  const updateParte = (index: number, patch: Partial<MusicaParte>) => {
    setPartes((current) =>
      current.map((parte, currentIndex) => (currentIndex === index ? { ...parte, ...patch } : parte)),
    );
  };

  const addParte = () => {
    setPartes((current) => [...current, createParte(current.length)]);
  };

  const removeParte = (index: number) => {
    setPartes((current) => current.filter((_, currentIndex) => currentIndex !== index).map((parte, currentIndex) => ({
      ...parte,
      ordem: currentIndex + 1,
    })));
  };

  return (
    <form action={action} className="musica-editor-form">
      <input type="hidden" name="id" defaultValue={musica?.id ?? ""} />
      <input type="hidden" name="partes_json" value={JSON.stringify(partes)} readOnly />

      <div className="module-grid">
        <label className="profile-form-field">
          <span>Título</span>
          <input className="profile-form-input" name="titulo" defaultValue={musica?.titulo ?? ""} placeholder="Nome da música" />
        </label>

        <label className="profile-form-field">
          <span>Autor</span>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select className="profile-form-input" name="autor" defaultValue={musica?.autor ?? ""} style={{ flex: 1 }}>
              <option value="">Selecione um autor...</option>
              {autores.map((autor) => (
                <option key={autor.id} value={autor.nome}>
                  {autor.nome}
                </option>
              ))}
            </select>
            <a
              href="/admin/reuniao-publica/musicas/autores/novo"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-small"
              style={{ whiteSpace: "nowrap", padding: "0.5rem 1rem" }}
              title="Criar novo autor"
            >
              + Novo
            </a>
          </div>
          {autores.length === 0 && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.5rem 0 0" }}>
              Nenhum autor cadastrado. <a href="/admin/reuniao-publica/musicas/autores/novo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Criar novo autor</a>
            </p>
          )}
        </label>

        <label className="profile-form-field">
          <span>Tom</span>
          <input className="profile-form-input" name="tom" defaultValue={musica?.tom ?? ""} placeholder="Ex.: G, C, D" />
        </label>

        <label className="profile-form-field">
          <span>Versão</span>
          <input className="profile-form-input" name="versao" defaultValue={musica?.versao ?? ""} placeholder="Ex.: versão de Elizabeth Lacerda" />
        </label>

        <label className="profile-form-field" style={{ gridColumn: "1/-1" }}>
          <span>Status</span>
          <select className="profile-form-input" name="status" defaultValue={musica?.status ?? "ativa"}>
            <option value="ativa">Ativa</option>
            <option value="rascunho">Rascunho</option>
            <option value="inativa">Inativa</option>
          </select>
        </label>

        <label className="profile-form-field" style={{ gridColumn: "1/-1" }}>
          <span>Observações</span>
          <textarea
            className="profile-form-input"
            name="observacoes"
            defaultValue={musica?.observacoes ?? ""}
            rows={4}
            placeholder="Contexto, tom de apresentação, observações de uso..."
          />
        </label>
      </div>

      <div style={{ marginTop: "2rem", display: "grid", gap: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: "1rem", margin: "0 0 0.25rem" }}>Partes da letra</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
              Organize estrofes e refrões em blocos. A tela pública vai respeitar a ordem e o destaque.
            </p>
          </div>
          <button type="button" className="profile-form-btn profile-form-btn-secondary" onClick={addParte}>
            Adicionar parte
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {partes.map((parte, index) => (
          <section key={`${index}-${parte.ordem}`} className="admin-card" style={{ padding: "1.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <strong>Parte {index + 1}: {parte.titulo}</strong>
              <button
                type="button"
                className="profile-form-btn profile-form-btn-secondary"
                style={{ fontSize: "0.875rem", padding: "0.3rem 0.6rem", color: "#8a005a" }}
                onClick={() => removeParte(index)}
              >
                Remover
              </button>
            </div>

            <div className="module-grid">
              <label className="profile-form-field">
                <span>Tipo</span>
                <select
                  className="profile-form-input"
                  value={parte.tipo}
                  onChange={(event) => updateParte(index, { tipo: event.target.value as MusicaParteTipo })}
                >
                  {PARTE_TIPOS.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-form-field">
                <span>Título</span>
                <input
                  className="profile-form-input"
                  value={parte.titulo}
                  onChange={(event) => updateParte(index, { titulo: event.target.value })}
                  placeholder="Ex.: Estrofe 1"
                />
              </label>

              <label className="profile-form-field" style={{ gridColumn: "1/-1" }}>
                <span>Letra</span>
                <textarea
                  className="profile-form-input"
                  value={parte.conteudo}
                  onChange={(event) => updateParte(index, { conteudo: event.target.value })}
                  rows={8}
                  placeholder="Digite a letra desta parte..."
                />
              </label>

              <label className="profile-form-field" style={{ gridColumn: "1/-1" }}>
                <span>Cifra</span>
                <textarea
                  className="profile-form-input"
                  value={parte.cifra ?? ""}
                  onChange={(event) => updateParte(index, { cifra: event.target.value })}
                  rows={4}
                  placeholder="Opcional: cifra ou acordes desta parte..."
                />
              </label>

              <label className="profile-form-field" style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={parte.destaque}
                  onChange={(event) => updateParte(index, { destaque: event.target.checked })}
                />
                <span>Destaque visual</span>
              </label>
            </div>
          </section>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "2rem" }}>
        <button type="submit" className="profile-form-btn profile-form-btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
