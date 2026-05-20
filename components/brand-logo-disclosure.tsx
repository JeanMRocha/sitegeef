"use client";

import { useState } from "react";

type BrandLogoDisclosureProps = {
  title: string;
  src: string;
  description: string;
  previewBackground: string;
  downloadName: string;
  downloadLabel: string;
  openLabel: string;
  expandLabel: string;
  compactLabel: string;
  accentPreview?: boolean;
};

export function BrandLogoDisclosure({
  title,
  src,
  description,
  previewBackground,
  downloadName,
  downloadLabel,
  openLabel,
  expandLabel,
  compactLabel,
  accentPreview = false,
}: Readonly<BrandLogoDisclosureProps>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="public-trust-item" style={{ padding: "1rem", display: "grid", gap: "0.7rem" }}>
      <button
        type="button"
        className="brand-disclosure-summary"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <span className="brand-disclosure-indicator" aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: expanded ? "190px" : "92px",
          borderRadius: "0.95rem",
          border: "1px solid var(--line)",
          background: previewBackground,
          overflow: "hidden",
          boxShadow: accentPreview ? "inset 0 0 0 1px rgba(255,255,255,0.6)" : "none",
        }}
      >
        <img
          src={src}
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: expanded ? "170px" : "72px",
            objectFit: "contain",
          }}
        />
      </div>

      {expanded ? <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>{description}</p> : null}

      {expanded ? (
        <div
          className="hero-actions"
          style={{
            marginTop: "0.15rem",
            flexWrap: "nowrap",
            gap: "0.6rem",
          }}
        >
          <a href={src} download={downloadName} className="button button-secondary" style={{ flex: "1 1 0" }}>
            {downloadLabel}
          </a>
          <a href={src} target="_blank" rel="noreferrer" className="button button-secondary" style={{ flex: "1 1 0" }}>
            {openLabel}
          </a>
        </div>
      ) : (
        <div style={{ color: "var(--muted)", fontSize: "0.86rem", lineHeight: 1.45 }}>
          {compactLabel} <button type="button" onClick={() => setExpanded(true)} style={{ border: 0, background: "transparent", color: "var(--uva)", padding: 0, cursor: "pointer", font: "inherit" }}>{expandLabel}</button>
        </div>
      )}
    </article>
  );
}
