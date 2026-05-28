"use client";

import { useRef } from "react";
import { IconTrash } from "@/components/icons";
import { deleteMusicaAction } from "@/app/admin/reuniao-publica/musicas/actions";

type DeleteMusicaButtonProps = {
  musicaId: string;
  musicaTitulo: string;
  iconOnly?: boolean;
};

export function DeleteMusicaButton({ musicaId, musicaTitulo, iconOnly }: DeleteMusicaButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleCloseDialog = () => {
    dialogRef.current?.close();
  };

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.set("id", musicaId);
    deleteMusicaAction(formData);
  };

  return (
    <>
      <button
        type="button"
        className={iconOnly ? "admin-btn admin-btn-secondary" : "profile-form-btn profile-form-btn-secondary"}
        style={iconOnly ? {} : { color: "#8a005a", marginTop: "1rem" }}
        onClick={handleOpenDialog}
        title={iconOnly ? "Excluir música" : undefined}
        aria-label={iconOnly ? "Excluir música" : undefined}
      >
        {iconOnly ? <IconTrash size={18} /> : "Excluir música"}
      </button>

      <dialog
        ref={dialogRef}
        style={{
          borderRadius: "24px",
          padding: "2rem",
          border: "none",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          maxWidth: "400px",
        }}
      >
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>Excluir música?</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Tem certeza que deseja remover <strong>{musicaTitulo}</strong>? Esta ação não pode ser desfeita.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="profile-form-btn profile-form-btn-secondary"
              onClick={handleCloseDialog}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="profile-form-btn profile-form-btn-secondary"
              style={{ color: "#8a005a" }}
              onClick={handleConfirmDelete}
            >
              Excluir definitivamente
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
