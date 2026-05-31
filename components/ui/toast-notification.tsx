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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || toasts.length === 0) {
    return <div className="toast-hidden" />;
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.variant}`}
        >
          {toast.title && (
            <div className="toast-title">
              {toast.title}
            </div>
          )}
          <div>{toast.message}</div>
        </div>
      ))}
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
