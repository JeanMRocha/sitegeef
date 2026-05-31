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
    <article className="brand-disclosure-item">
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
        className={`brand-disclosure-preview ${expanded ? 'brand-disclosure-preview-expanded' : 'brand-disclosure-preview-compact'} ${accentPreview ? 'brand-disclosure-preview-accent' : ''}`}
        style={{ background: previewBackground }}
      >
        <img
          src={src}
          alt={title}
          className={`brand-disclosure-image ${expanded ? 'brand-disclosure-image-expanded' : 'brand-disclosure-image-compact'}`}
        />
      </div>

      {expanded ? <p className="brand-disclosure-description">{description}</p> : null}

      {expanded ? (
        <div className="brand-disclosure-actions">
          <a href={src} download={downloadName} className="button button-secondary brand-disclosure-btn">
            {downloadLabel}
          </a>
          <a href={src} target="_blank" rel="noreferrer" className="button button-secondary brand-disclosure-btn">
            {openLabel}
          </a>
        </div>
      ) : (
        <div className="brand-disclosure-compact-hint">
          {compactLabel} <button type="button" onClick={() => setExpanded(true)} className="brand-disclosure-expand-btn">{expandLabel}</button>
        </div>
      )}
    </article>
  );
}
