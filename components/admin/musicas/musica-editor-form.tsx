"use client";

import { useRef, useState } from "react";
import { parsePartesFromText } from "@/lib/musicas";
import type { Musica, MusicaAutor, MusicaVersao } from "@/lib/musicas";

type MusicaEditorFormProps = {
  musica?: Musica | null;
  autores?: MusicaAutor[];
  versoes?: MusicaVersao[];
  action: (formData: FormData) => void;
  submitLabel?: string;
};

const TOOLBAR_BUTTONS = [
  { label: "Estrofe", tipo: "ESTROFE" },
  { label: "Refrão", tipo: "REFRAO" },
  { label: "Ponte", tipo: "PONTE" },
  { label: "Introdução", tipo: "INTRO" },
  { label: "Cifra", tipo: "CIFRA" },
];

const STANDARD_TONES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm",
];

export function MusicaEditorForm({ musica, autores: initialAutores = [], versoes: initialVersoes = [], action, submitLabel = "Salvar música" }: MusicaEditorFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [letras, setLetras] = useState(musica?.partes.map((p) => `=== ${p.tipo.toUpperCase()} ===\n${p.conteudo}`).join("\n\n") || "");
  const [youtubeModal, setYoutubeModal] = useState(false);
  const [mp3Modal, setMp3Modal] = useState(false);
  const [autorModal, setAutorModal] = useState(false);
  const [versaoModal, setVersaoModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(musica?.youtube_url ?? "");
  const [audioUrl, setAudioUrl] = useState(musica?.audio_url ?? "");
  const [novoAutor, setNovoAutor] = useState("");
  const [novaVersao, setNovaVersao] = useState("");
  const [autores, setAutores] = useState(initialAutores);
  const [versoes, setVersoes] = useState(initialVersoes);
  const [loadingAutor, setLoadingAutor] = useState(false);
  const [loadingVersao, setLoadingVersao] = useState(false);

  const insertMarker = (tipo: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = letras;
    const selectedText = text.substring(start, end);
    const marker = `=== ${tipo} ===`;
    const newText = text.substring(0, start) + (selectedText ? `${marker}\n${selectedText}` : `${marker}\n`) + text.substring(end);

    setLetras(newText);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + marker.length + 1;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleSaveAutor = async () => {
    if (!novoAutor.trim()) return;
    setLoadingAutor(true);
    try {
      const response = await fetch("/api/musicas/autores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoAutor.trim() }),
      });
      if (response.ok) {
        const novoAutorData = await response.json();
        setAutores([...autores, novoAutorData]);
        setNovoAutor("");
        setAutorModal(false);
      }
    } catch (error) {
      alert("Erro ao criar autor");
    } finally {
      setLoadingAutor(false);
    }
  };

  const handleSaveVersao = async () => {
    if (!novaVersao.trim()) return;
    setLoadingVersao(true);
    try {
      const response = await fetch("/api/musicas/versoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novaVersao.trim() }),
      });
      if (response.ok) {
        const novaVersaoData = await response.json();
        setVersoes([...versoes, novaVersaoData]);
        setNovaVersao("");
        setVersaoModal(false);
      }
    } catch (error) {
      alert("Erro ao criar versão");
    } finally {
      setLoadingVersao(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const partes = parsePartesFromText(letras);
    formData.set("partes_json", JSON.stringify(partes));
    action(formData);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="musica-editor-form">
      <input type="hidden" name="id" defaultValue={musica?.id ?? ""} />

      <div className="module-grid">
        <div style={{ gridColumn: "1/-1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <label className="profile-form-field" style={{ margin: 0 }}>
            <span>Título</span>
            <input className="profile-form-input" name="titulo" defaultValue={musica?.titulo ?? ""} placeholder="Nome da música" />
          </label>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <label className="profile-form-field" style={{ margin: 0, flex: 1 }}>
              <span>Autor</span>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select className="profile-form-input" name="autor" defaultValue={musica?.autor ?? ""} style={{ flex: 1 }}>
                  <option value="">Selecione...</option>
                  {autores.map((autor) => (
                    <option key={autor.id} value={autor.nome}>
                      {autor.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAutorModal(true)}
                  className="admin-btn admin-btn-small"
                  style={{ padding: "0.5rem 0.75rem" }}
                  title="Criar novo autor"
                >
                  +
                </button>
              </div>
            </label>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setYoutubeModal(true)}
              style={{ padding: "0.5rem 1rem" }}
              title="Adicionar YouTube"
            >
              {youtubeUrl ? "✓ YT" : "YT"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setMp3Modal(true)}
              style={{ padding: "0.5rem 1rem" }}
              title="Adicionar MP3"
            >
              {audioUrl ? "✓ MP3" : "MP3"}
            </button>
          </div>
        </div>

        <label className="profile-form-field">
          <span>Tom</span>
          <select className="profile-form-input" name="tom" defaultValue={musica?.tom ?? ""}>
            <option value="">Selecione...</option>
            {STANDARD_TONES.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </label>

        <label className="profile-form-field">
          <span>Versão</span>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <select className="profile-form-input" name="versao" defaultValue={musica?.versao ?? ""} style={{ flex: 1 }}>
              <option value="">Selecione...</option>
              {versoes.map((versao) => (
                <option key={versao.id} value={versao.nome}>
                  {versao.nome}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setVersaoModal(true)}
              className="admin-btn admin-btn-small"
              style={{ padding: "0.5rem 0.75rem" }}
              title="Criar nova versão"
            >
              +
            </button>
          </div>
        </label>

        <label className="profile-form-field">
          <span>Status</span>
          <select className="profile-form-input" name="status" defaultValue={musica?.status ?? "ativa"} style={{ fontSize: "0.9rem" }}>
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
            rows={2}
            placeholder="Contexto, tom de apresentação..."
          />
        </label>

        <input type="hidden" name="youtube_url" value={youtubeUrl} />
        <input type="hidden" name="audio_url" value={audioUrl} />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <p style={{ fontWeight: 600, fontSize: "1rem", margin: "0 0 1rem" }}>Letra e Cifra</p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {TOOLBAR_BUTTONS.map((btn) => (
            <button
              key={btn.tipo}
              type="button"
              className="profile-form-btn profile-form-btn-secondary"
              onClick={() => insertMarker(btn.tipo)}
              style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
              title={`Inserir marcador === ${btn.tipo} ===`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <label className="profile-form-field" style={{ gridColumn: "1/-1" }}>
          <span>Conteúdo</span>
          <textarea
            ref={textareaRef}
            className="profile-form-input"
            value={letras}
            onChange={(e) => setLetras(e.target.value)}
            rows={16}
            placeholder="Cole ou digite a letra aqui. Use os botões acima para marcar tipos de seções."
            style={{ fontFamily: "monospace", fontSize: "0.9rem" }}
          />
        </label>
      </div>

      <input type="hidden" name="_submitLabel" value={submitLabel} />
    </form>

    {youtubeModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setYoutubeModal(false)}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>URL do YouTube</h3>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border-medium)",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              marginBottom: "1.5rem",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setYoutubeModal(false)}
              className="admin-btn admin-btn-secondary"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => {
                setYoutubeModal(false);
              }}
              className="admin-btn admin-btn-primary"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    )}

    {mp3Modal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setMp3Modal(false)}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>URL do MP3</h3>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://... ou caminho do arquivo no Supabase"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border-medium)",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              marginBottom: "1.5rem",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setMp3Modal(false)}
              className="admin-btn admin-btn-secondary"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => {
                setMp3Modal(false);
              }}
              className="admin-btn admin-btn-primary"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    )}

    {autorModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setAutorModal(false)}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>Novo autor</h3>
          <input
            type="text"
            value={novoAutor}
            onChange={(e) => setNovoAutor(e.target.value)}
            placeholder="Nome do autor"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border-medium)",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              marginBottom: "1.5rem",
              boxSizing: "border-box",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSaveAutor();
              }
            }}
          />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setAutorModal(false)}
              className="admin-btn admin-btn-secondary"
              disabled={loadingAutor}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveAutor}
              className="admin-btn admin-btn-primary"
              disabled={loadingAutor}
            >
              {loadingAutor ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    )}

    {versaoModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setVersaoModal(false)}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>Nova versão</h3>
          <input
            type="text"
            value={novaVersao}
            onChange={(e) => setNovaVersao(e.target.value)}
            placeholder="Nome da versão"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border-medium)",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              marginBottom: "1.5rem",
              boxSizing: "border-box",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSaveVersao();
              }
            }}
          />
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setVersaoModal(false)}
              className="admin-btn admin-btn-secondary"
              disabled={loadingVersao}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveVersao}
              className="admin-btn admin-btn-primary"
              disabled={loadingVersao}
            >
              {loadingVersao ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
