"use client";

import { useState, type FormEvent } from "react";

type ContactMessageFormProps = {
  formId: string;
  sendingLabel: string;
  successTitle: string;
  successText: string;
  errorText: string;
};

type ContactFormState = {
  nome: string;
  email: string;
  telefoneDdd: string;
  telefoneNumero: string;
  assunto: string;
  mensagem: string;
};

type ContactFormErrors = {
  email?: string;
  telefone?: string;
};

const INITIAL_FORM_STATE: ContactFormState = {
  nome: "",
  email: "",
  telefoneDdd: "",
  telefoneNumero: "",
  assunto: "",
  mensagem: "",
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatPhoneNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 9);

  if (!digits) {
    return "";
  }

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatTelefoneCompleto(ddd: string, numero: string) {
  const cleanDdd = digitsOnly(ddd).slice(0, 2);
  const cleanNumero = digitsOnly(numero).slice(0, 9);

  if (!cleanDdd && !cleanNumero) {
    return "";
  }

  const numeroFormatado = formatPhoneNumber(cleanNumero);

  if (!cleanDdd) {
    return numeroFormatado;
  }

  return numeroFormatado ? `(${cleanDdd}) ${numeroFormatado}` : `(${cleanDdd})`;
}

function validateEmail(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Informe seu e-mail.";
  }

  return isValidEmail(trimmed) ? "" : "Digite um e-mail válido, como nome@dominio.com.";
}

function validateTelefone(ddd: string, numero: string) {
  const cleanDdd = digitsOnly(ddd);
  const cleanNumero = digitsOnly(numero);

  if (!cleanDdd && !cleanNumero) {
    return "";
  }

  if (cleanDdd.length !== 2) {
    return "Informe o DDD com 2 dígitos.";
  }

  if (cleanNumero.length < 8) {
    return "O número precisa ter 8 ou 9 dígitos.";
  }

  if (cleanNumero.length > 9) {
    return "O número deve ter no máximo 9 dígitos.";
  }

  return "";
}

export function ContactMessageForm({
  formId,
  sendingLabel,
  successTitle,
  successText,
  errorText,
}: Readonly<ContactMessageFormProps>) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [telefoneNumeroFocused, setTelefoneNumeroFocused] = useState(false);

  function updateField<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateEmail(value: string) {
    updateField("email", value);

    if (fieldErrors.email) {
      setFieldErrors((current) => ({
        ...current,
        email: validateEmail(value),
      }));
    }
  }

  function updateTelefoneDdd(value: string) {
    const nextValue = digitsOnly(value).slice(0, 2);
    updateField("telefoneDdd", nextValue);

    if (fieldErrors.telefone) {
      setFieldErrors((current) => ({
        ...current,
        telefone: validateTelefone(nextValue, formData.telefoneNumero),
      }));
    }
  }

  function updateTelefoneNumero(value: string) {
    const nextValue = digitsOnly(value).slice(0, 9);
    updateField("telefoneNumero", nextValue);

    if (fieldErrors.telefone) {
      setFieldErrors((current) => ({
        ...current,
        telefone: validateTelefone(formData.telefoneDdd, nextValue),
      }));
    }
  }

  function handleEmailBlur() {
    setFieldErrors((current) => ({
      ...current,
      email: validateEmail(formData.email),
    }));
  }

  function handleTelefoneBlur() {
    setTelefoneNumeroFocused(false);
    setFieldErrors((current) => ({
      ...current,
      telefone: validateTelefone(formData.telefoneDdd, formData.telefoneNumero),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = String(new FormData(form).get("website") || "").trim();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nextFieldErrors: ContactFormErrors = {
      email: validateEmail(formData.email),
      telefone: validateTelefone(formData.telefoneDdd, formData.telefoneNumero),
    };

    if (nextFieldErrors.email || nextFieldErrors.telefone) {
      setFieldErrors(nextFieldErrors);
      setStatus("error");
      setStatusMessage("Revise os campos destacados antes de enviar.");
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          telefone: formatTelefoneCompleto(formData.telefoneDdd, formData.telefoneNumero),
          assunto: formData.assunto.trim(),
          mensagem: formData.mensagem.trim(),
          honeypot,
          pagina_origem: "/contato",
        }),
      });

      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "send_failed");
      }

      setFormData(INITIAL_FORM_STATE);
      setFieldErrors({});
      setTelefoneNumeroFocused(false);
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
            <input
              name="nome"
              type="text"
              className="contact-form-input"
              autoComplete="name"
              value={formData.nome}
              onChange={(event) => updateField("nome", event.target.value)}
              required
            />
          </label>

          <label className="contact-form-field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              className="contact-form-input"
              autoComplete="email"
              inputMode="email"
              value={formData.email}
              onChange={(event) => updateEmail(event.target.value)}
              onBlur={handleEmailBlur}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby="contact-email-error"
              required
            />
            <span id="contact-email-error" className={`contact-form-field-note ${fieldErrors.email ? "error" : ""}`} aria-live="polite">
              {fieldErrors.email || "Use um e-mail válido para receber resposta."}
            </span>
          </label>

          <div className="contact-form-field">
            <span>Telefone</span>
            <div className="contact-phone-row">
              <label className="contact-form-field contact-phone-part contact-phone-part--ddd">
                <span>DDD</span>
                <input
                  name="telefone_ddd"
                  type="tel"
                  className="contact-form-input"
                  autoComplete="tel-area-code"
                  inputMode="numeric"
                  value={formData.telefoneDdd}
                  onChange={(event) => updateTelefoneDdd(event.target.value)}
                  onBlur={handleTelefoneBlur}
                  placeholder="00"
                  maxLength={2}
                  aria-invalid={Boolean(fieldErrors.telefone)}
                  aria-describedby="contact-telefone-error"
                />
              </label>

              <label className="contact-form-field contact-phone-part contact-phone-part--numero">
                <span>Número</span>
                <input
                  name="telefone_numero"
                  type="tel"
                  className="contact-form-input"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  value={telefoneNumeroFocused ? formData.telefoneNumero : formatPhoneNumber(formData.telefoneNumero)}
                  onChange={(event) => updateTelefoneNumero(event.target.value)}
                  onFocus={() => setTelefoneNumeroFocused(true)}
                  onBlur={handleTelefoneBlur}
                  placeholder="00000-0000"
                  aria-invalid={Boolean(fieldErrors.telefone)}
                  aria-describedby="contact-telefone-error"
                />
              </label>
            </div>
            <span id="contact-telefone-error" className={`contact-form-field-note ${fieldErrors.telefone ? "error" : ""}`} aria-live="polite">
              {fieldErrors.telefone || "DDD separado do número. Ex.: 22 e 99725-1807."}
            </span>
          </div>

          <label className="contact-form-field">
            <span>Assunto</span>
            <input
              name="assunto"
              type="text"
              className="contact-form-input"
              placeholder="Ex.: atendimento, agenda, informação"
              value={formData.assunto}
              onChange={(event) => updateField("assunto", event.target.value)}
              required
            />
          </label>
        </div>

      <label className="contact-form-field contact-message-form-column contact-message-form-column--message">
        <span>Mensagem</span>
        <textarea
          name="mensagem"
          className="contact-form-input contact-form-textarea contact-message-form-textarea"
          rows={9}
          value={formData.mensagem}
          onChange={(event) => updateField("mensagem", event.target.value)}
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
