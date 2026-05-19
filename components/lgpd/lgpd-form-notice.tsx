"use client";

import { LgpdNotice } from "./lgpd-notice";

type LgpdFormNoticeProps = {
  text?: string;
  title?: string;
};

export function LgpdFormNotice({
  title = "Privacidade no formulário",
  text = "Usaremos seus dados só para responder sua solicitação e manter o registro do atendimento.",
}: Readonly<LgpdFormNoticeProps>) {
  return (
    <LgpdNotice
      title={title}
      text={text}
      policyHref="/privacidade"
      policyLabel="Ler política"
      contactHref="/lgpd"
      contactLabel="Canal LGPD"
      className="lgpd-form-notice"
    />
  );
}
