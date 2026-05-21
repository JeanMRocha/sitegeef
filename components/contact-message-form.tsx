"use client";

import { useState, type FormEvent } from "react";

type ContactMessageFormProps = {
  formId: string;
  sendingLabel: string;
  successTitle: string;
  successText: string;
  errorText: string;
};

export function ContactMessageForm({
  formId,
  sendingLabel,
  successTitle,
  successText,
  errorText,
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
    <form id={formId} className="contact-message-form" onSubmit={handleSubmit}>
      <div className="contact-message-form-split">
        <div className="contact-message-form-column contact-message-form-column--fields">
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

      <label className="contact-form-field contact-message-form-column contact-message-form-column--message">
        <span>Mensagem</span>
        <textarea
          name="mensagem"
          className="contact-form-input contact-form-textarea contact-message-form-textarea"
          rows={9}
          required
        />
      </label>
      </div>

      <label className="contact-form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      {statusMessage ? <p className={`contact-form-status ${status}`}>{statusMessage}</p> : null}
    </form>
  );
}
