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
        className={`profile-form-btn profile-form-btn-secondary profile-form-btn-danger ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
      >
        Encerrar todas as ativas
      </button>
    </form>
  );
}
