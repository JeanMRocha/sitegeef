"use client";

import { useState } from "react";

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isOpen: boolean;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onCancel?.();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleCancel}
    >
      <div
        className="modal-content confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="confirm-modal-title">
          {title}
        </h3>
        <p className="confirm-modal-message">
          {message}
        </p>
        <div className="modal-actions">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="admin-btn admin-btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`admin-btn ${variant === "danger" ? "admin-btn-danger" : "admin-btn-primary"}`}
          >
            {loading ? "Processando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
