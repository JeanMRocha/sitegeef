"use client";

import { useEffect, useState } from "react";

type RequestType = {
  value: string;
  label: string;
};

type LgpdRequestModalProps = {
  title: string;
  lead: string;
  requestTypes: RequestType[];
  requestTypeLabel: string;
  detailsLabel: string;
  detailsPlaceholder: string;
  sendLabel: string;
  openLabel: string;
  closeLabel: string;
  action: (formData: FormData) => Promise<void>;
};

export function LgpdRequestModal({
  title,
  lead,
  requestTypes,
  requestTypeLabel,
  detailsLabel,
  detailsPlaceholder,
  sendLabel,
  openLabel,
  closeLabel,
  action,
}: Readonly<LgpdRequestModalProps>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button type="button" className="lgpd-request-trigger" onClick={() => setOpen(true)}>
        {openLabel}
      </button>

      {open && (
        <div className="lgpd-request-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="lgpd-request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lgpd-request-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lgpd-request-modal-head">
              <div>
                <p className="eyebrow">LGPD</p>
                <h3 id="lgpd-request-modal-title">{title}</h3>
              </div>
              <button type="button" className="lgpd-request-close" onClick={() => setOpen(false)}>
                {closeLabel}
              </button>
            </div>

            <p className="lgpd-request-lead">{lead}</p>

            <form action={action} className="lgpd-request-form">
              <label className="profile-form-field">
                <span>{requestTypeLabel}</span>
                <select name="request_type" className="profile-form-input" defaultValue="revogacao">
                  {requestTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-form-field lgpd-request-details">
                <span>{detailsLabel}</span>
                <textarea
                  name="details"
                  className="profile-form-input"
                  rows={4}
                  placeholder={detailsPlaceholder}
                />
              </label>

              <div className="lgpd-request-actions">
                <button type="submit" className="profile-form-btn profile-form-btn-primary">
                  {sendLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
