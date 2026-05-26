"use client";

type EncerrarMusicasSessoesButtonProps = {
  action: () => Promise<void>;
  disabled?: boolean;
  count: number;
};

export function EncerrarMusicasSessoesButton({ action, disabled = false, count }: EncerrarMusicasSessoesButtonProps) {
  const message =
    count === 1
      ? "Encerrar a única sessão ativa agora?"
      : `Encerrar todas as ${count} sessões ativas agora?`;

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="profile-form-btn profile-form-btn-secondary"
        style={
          !disabled
            ? { color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.28)" }
            : { opacity: 0.55, cursor: "not-allowed" }
        }
        disabled={disabled}
      >
        Encerrar todas as ativas
      </button>
    </form>
  );
}
