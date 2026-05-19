'use client';

import { useState, useRef } from 'react';
import { uploadLogoAction } from '@/app/admin/instituicao/actions';
import { LgpdNotice } from '@/components/lgpd/lgpd-notice';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange?: (url: string) => void;
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentLogo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo maior que 5MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsLoading(true);
    setError(undefined);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadLogoAction(formData);

      if (result.success && result.url) {
        onLogoChange?.(result.url);
      } else {
        setError(result.error || 'Erro ao fazer upload');
        setPreview(currentLogo);
      }
    } catch (err) {
      setError('Erro ao fazer upload');
      setPreview(currentLogo);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setPreview(undefined);
    onLogoChange?.('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="logo-upload-container">
      <LgpdNotice
        title="Upload de imagem"
        text="A imagem enviada será usada apenas no cadastro da instituição e ficará disponível para edição administrativa."
        policyHref="/privacidade"
        policyLabel="Ler política"
        contactHref="/lgpd"
        contactLabel="Canal LGPD"
        className="lgpd-upload-notice"
      />

      <style>{`
        .logo-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .logo-upload-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 200px;
          border: 2px dashed #d4d4d8;
          border-radius: 0.5rem;
          background-color: #f9f9fb;
          overflow: hidden;
        }

        .logo-upload-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .logo-upload-empty {
          color: #a1a1a6;
          font-size: 0.875rem;
        }

        .logo-upload-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .logo-upload-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d4d4d8;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .logo-upload-btn:hover:not(:disabled) {
          background: #f3f3f5;
          border-color: #a1a1a6;
        }

        .logo-upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .logo-upload-btn-primary {
          background: #7c3aed;
          color: white;
          border-color: #7c3aed;
        }

        .logo-upload-btn-primary:hover:not(:disabled) {
          background: #6d28d9;
          border-color: #6d28d9;
        }

        .logo-upload-btn-danger {
          color: #dc2626;
          border-color: #dc2626;
        }

        .logo-upload-btn-danger:hover:not(:disabled) {
          background: #fee2e2;
        }

        .logo-upload-error {
          padding: 0.75rem;
          background: #fee2e2;
          border: 1px solid #dc2626;
          border-radius: 0.375rem;
          color: #991b1b;
          font-size: 0.875rem;
        }

        .logo-upload-input {
          display: none;
        }
      `}</style>

      <div className="logo-upload-preview">
        {preview ? (
          <img src={preview} alt="Logo preview" />
        ) : (
          <span className="logo-upload-empty">Nenhuma logo</span>
        )}
      </div>

      {error && <div className="logo-upload-error">{error}</div>}

      <div className="logo-upload-actions">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="logo-upload-btn logo-upload-btn-primary"
        >
          {isLoading ? 'Enviando...' : preview ? 'Trocar logo' : 'Fazer upload'}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="logo-upload-btn logo-upload-btn-danger"
          >
            Remover
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="logo-upload-input"
      />
    </div>
  );
}
