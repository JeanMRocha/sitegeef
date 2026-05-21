"use client";

import { useState, type FormEvent } from "react";

type ContactMessageFormProps = {
  sendLabel: string;
  sendingLabel: string;
  successTitle: string;
  successText: string;
  errorText: string;
  idleText: string;
};

export function ContactMessageForm({
  sendLabel,
  sendingLabel,
  successTitle,
  successText,
  errorText,
  idleText,
}: Readonly<ContactMessageFormProps>) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setStatusMessage("");

    const payload = {
      nome: String(formData.get("nome") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      telefone: String(formData.get("telefone") || "").trim(),
      assunto: String(formData.get("assunto") || "").trim(),
      mensagem: String(formData.get("mensagem") || "").trim(),
      honeypot: String(formData.get("website") || "").trim(),
      pagina_origem: "/contato",
    };

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "send_failed");
      }

      form.reset();
      setStatus("success");
      setStatusMessage(`${successTitle} ${successText}`);
      return;
    } catch {
      setStatus("error");
      setStatusMessage(errorText);
    }
  }

  return (
    <form className="contact-message-form" onSubmit={handleSubmit}>
      <div className="contact-form-grid">
        <label className="contact-form-field">
          <span>Nome</span>
          <input name="nome" type="text" className="contact-form-input" autoComplete="name" required />
        </label>

        <label className="contact-form-field">
          <span>E-mail</span>
          <input name="email" type="email" className="contact-form-input" autoComplete="email" required />
        </label>

        <label className="contact-form-field">
          <span>Telefone</span>
          <input name="telefone" type="tel" className="contact-form-input" autoComplete="tel" />
        </label>

        <label className="contact-form-field">
          <span>Assunto</span>
          <input name="assunto" type="text" className="contact-form-input" placeholder="Ex.: atendimento, agenda, informação" required />
        </label>
      </div>

      <label className="contact-form-field contact-form-field--full">
        <span>Mensagem</span>
        <textarea
          name="mensagem"
          className="contact-form-input contact-form-textarea"
          rows={7}
          placeholder="Escreva sua mensagem com clareza. A equipe interna receberá o registro no painel do admin."
          required
        />
      </label>

      <label className="contact-form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="contact-form-actions">
        <button type="submit" className="button button-primary contact-form-submit" disabled={status === "sending"}>
          {status === "sending" ? sendingLabel : sendLabel}
        </button>
        <p className={`contact-form-status ${status}`}>
          {statusMessage || idleText}
        </p>
      </div>
    </form>
  );
}
