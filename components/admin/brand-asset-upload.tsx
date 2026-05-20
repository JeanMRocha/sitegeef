"use client";

import { useRef, useState } from "react";
import { uploadBrandAssetAction } from "@/app/admin/instituicao/actions";

type BrandAssetSlot = "logo_url" | "logo_com_fundo_url";

type BrandAssetUploadProps = {
  title: string;
  description: string;
  fieldName: BrandAssetSlot;
  currentAsset: string;
};

export function BrandAssetUpload({ title, description, fieldName, currentAsset }: BrandAssetUploadProps) {
  const [preview, setPreview] = useState<string>(currentAsset || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo maior que 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview((e.target?.result as string) || currentAsset || "");
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    setError(undefined);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", fieldName);
      formData.append("field_name", fieldName);

      const result = await uploadBrandAssetAction(formData);

      if (result.success && result.url) {
        setPreview(result.url);
      } else {
        setError(result.error || "Erro ao fazer upload");
        setPreview(currentAsset || "");
      }
    } catch {
      setError("Erro ao fazer upload");
      setPreview(currentAsset || "");
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    setPreview("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="brand-asset-upload">
      <style>{`
        .brand-asset-upload {
          display: grid;
          gap: 0.9rem;
          padding: 1rem;
          border: 1px solid var(--line);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.7);
        }

        .brand-asset-upload-head {
          display: grid;
          gap: 0.2rem;
        }

        .brand-asset-upload-head strong {
          font-size: 0.98rem;
        }

        .brand-asset-upload-head span {
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .brand-asset-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 170px;
          border: 1px dashed var(--line);
          border-radius: 0.95rem;
          background:
            radial-gradient(circle at top left, rgba(138, 0, 90, 0.08), transparent 30%),
            rgba(250, 246, 255, 0.92);
          overflow: hidden;
        }

        .brand-asset-preview img {
          max-width: 100%;
          max-height: 150px;
          object-fit: contain;
        }

        .brand-asset-empty {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .brand-asset-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .brand-asset-btn {
          padding: 0.5rem 0.9rem;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: white;
          cursor: pointer;
          font-size: 0.88rem;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .brand-asset-btn:hover:not(:disabled) {
          background: rgba(138, 0, 90, 0.05);
          border-color: rgba(138, 0, 90, 0.2);
        }

        .brand-asset-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .brand-asset-btn-primary {
          background: var(--uva);
          color: white;
          border-color: var(--uva);
        }

        .brand-asset-btn-primary:hover:not(:disabled) {
          background: var(--uva-strong);
          border-color: var(--uva-strong);
        }

        .brand-asset-error {
          padding: 0.7rem 0.85rem;
          border-radius: 0.8rem;
          background: rgba(239, 68, 68, 0.1);
          color: #991b1b;
          font-size: 0.88rem;
        }

        .brand-asset-hidden {
          display: none;
        }
      `}</style>

      <div className="brand-asset-upload-head">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <div className="brand-asset-preview">
        {preview ? (
          <img src={preview} alt={title} />
        ) : (
          <span className="brand-asset-empty">Nenhuma imagem enviada</span>
        )}
      </div>

      <input type="hidden" name={fieldName} value={preview} />

      {error && <div className="brand-asset-error">{error}</div>}

      <div className="brand-asset-actions">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="brand-asset-btn brand-asset-btn-primary"
        >
          {isLoading ? "Enviando..." : preview ? "Trocar imagem" : "Enviar imagem"}
        </button>
        {preview ? (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="brand-asset-btn"
          >
            Limpar
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="brand-asset-hidden"
      />
    </div>
  );
}
