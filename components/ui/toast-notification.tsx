"use client";

import { useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration?: number;
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleAddToast = (event: CustomEvent) => {
      const toast = event.detail as Toast;
      if (!toast.id) {
        toast.id = Math.random().toString(36).substr(2, 9);
      }
      if (!toast.duration) {
        toast.duration = 4000;
      }

      setToasts((prev) => [...prev, toast]);

      if (toast.duration > 0) {
        const timeout = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);

        return () => clearTimeout(timeout);
      }
    };

    window.addEventListener("addToast", handleAddToast as EventListener);
    return () => window.removeEventListener("addToast", handleAddToast as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxWidth: "400px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              toast.variant === "success"
                ? "rgba(34, 197, 94, 0.95)"
                : toast.variant === "error"
                  ? "rgba(239, 68, 68, 0.95)"
                  : toast.variant === "warning"
                    ? "rgba(251, 146, 60, 0.95)"
                    : "rgba(59, 130, 246, 0.95)",
            color: "white",
            fontSize: "0.95rem",
            lineHeight: 1.4,
            animation: "slideIn 0.3s ease",
          }}
        >
          {toast.title && (
            <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
              {toast.title}
            </div>
          )}
          <div>{toast.message}</div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function showToast(toast: Omit<Toast, "id">) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("addToast", {
        detail: {
          id: Math.random().toString(36).substr(2, 9),
          ...toast,
        },
      })
    );
  }
}
