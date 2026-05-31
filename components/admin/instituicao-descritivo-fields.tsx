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
    <label className="profile-form-field descritivo-field descritivo-field--full">
      <span className="descritivo-field-head">
        <span>{label}</span>
        <span className="descritivo-field-count">
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
      <span className="descritivo-field-note">
        Recomendado: até {recommendedLength} caracteres.
      </span>
    </label>
  );
}
