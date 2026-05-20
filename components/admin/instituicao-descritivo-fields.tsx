"use client";

import { useMemo, useState } from "react";

type DescritivoFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  rows: number;
  recommendedLength: number;
  placeholder?: string;
};

function countChars(value: string) {
  return value.length;
}

export function DescritivoField({
  name,
  label,
  defaultValue = "",
  rows,
  recommendedLength,
  placeholder,
}: DescritivoFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const currentLength = useMemo(() => countChars(value), [value]);

  return (
    <label className="profile-form-field" style={{ gridColumn: "1 / -1" }}>
      <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
        <span>{label}</span>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
          {currentLength} / {recommendedLength}
        </span>
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        maxLength={recommendedLength}
        placeholder={placeholder}
        className="profile-form-input"
        onChange={(event) => setValue(event.target.value)}
      />
      <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        Recomendado: até {recommendedLength} caracteres.
      </span>
    </label>
  );
}
