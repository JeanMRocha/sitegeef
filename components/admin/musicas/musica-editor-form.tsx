"use client";

import { useEffect, useMemo, useState } from "react";
import type { Musica, MusicaParte, MusicaParteTipo } from "@/lib/musicas";

type MusicaEditorFormProps = {
  musica?: Musica | null;
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

export function MusicaEditorForm({ musica, action, submitLabel = "Salvar música" }: MusicaEditorFormProps) {
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

      <div className="musica-editor-grid">
        <label className="musica-field">
          <span>Título</span>
          <input name="titulo" defaultValue={musica?.titulo ?? ""} placeholder="Nome da música" />
        </label>

        <label className="musica-field">
          <span>Autor</span>
          <input name="autor" defaultValue={musica?.autor ?? ""} placeholder="Nome do autor" />
        </label>

        <label className="musica-field">
          <span>Tom</span>
          <input name="tom" defaultValue={musica?.tom ?? ""} placeholder="Ex.: G, C, D" />
        </label>

        <label className="musica-field">
          <span>Versão</span>
          <input name="versao" defaultValue={musica?.versao ?? ""} placeholder="Ex.: versão de Elizabeth Lacerda" />
        </label>

        <label className="musica-field musica-field--wide">
          <span>Status</span>
          <select name="status" defaultValue={musica?.status ?? "ativa"}>
            <option value="ativa">Ativa</option>
            <option value="rascunho">Rascunho</option>
            <option value="inativa">Inativa</option>
          </select>
        </label>

        <label className="musica-field musica-field--wide">
          <span>Observações</span>
          <textarea
            name="observacoes"
            defaultValue={musica?.observacoes ?? ""}
            rows={4}
            placeholder="Contexto, tom de apresentação, observações de uso..."
          />
        </label>
      </div>

      <div className="musica-editor-parts-header">
        <div>
          <p className="content-panel-label">Partes da letra</p>
          <p className="musica-editor-hint">
            Organize estrofes e refrões em blocos. A tela pública vai respeitar a ordem e o destaque.
          </p>
        </div>
        <button type="button" className="button button-secondary" onClick={addParte}>
          + Adicionar parte
        </button>
      </div>

      <div className="musica-editor-parts">
        {partes.map((parte, index) => (
          <section key={`${index}-${parte.ordem}`} className="musica-editor-part">
            <div className="musica-editor-part-top">
              <strong>Parte {index + 1}</strong>
              <button type="button" className="musica-editor-remove" onClick={() => removeParte(index)}>
                Remover
              </button>
            </div>

            <div className="musica-editor-part-grid">
              <label className="musica-field">
                <span>Tipo</span>
                <select
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

              <label className="musica-field">
                <span>Título</span>
                <input
                  value={parte.titulo}
                  onChange={(event) => updateParte(index, { titulo: event.target.value })}
                  placeholder="Ex.: Estrofe 1"
                />
              </label>

              <label className="musica-field musica-field--wide">
                <span>Letra</span>
                <textarea
                  value={parte.conteudo}
                  onChange={(event) => updateParte(index, { conteudo: event.target.value })}
                  rows={8}
                  placeholder="Digite a letra desta parte..."
                />
              </label>

              <label className="musica-field musica-field--wide">
                <span>Cifra</span>
                <textarea
                  value={parte.cifra ?? ""}
                  onChange={(event) => updateParte(index, { cifra: event.target.value })}
                  rows={4}
                  placeholder="Opcional: cifra ou acordes desta parte..."
                />
              </label>

              <label className="musica-field musica-field--checkbox">
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

      <div className="musica-editor-actions">
        <button type="submit" className="button button-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
