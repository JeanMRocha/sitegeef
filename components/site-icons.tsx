type IconProps = {
  className?: string;
};

function IconShell({ children, className }: React.PropsWithChildren<IconProps>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function GroupIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a3 3 0 0 1 0 5.74" />
    </IconShell>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </IconShell>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3 10.3 4.6a5 5 0 0 0-7.1 7.1L12 20l8.8-8.3a5 5 0 0 0 0-7.1z" />
    </IconShell>
  );
}

export function LiveIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M9 16a5 5 0 1 1 0-8" />
      <path d="M15 8a5 5 0 1 1 0 8" />
      <path d="M12 6v12" />
    </IconShell>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M4 6a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z" />
      <path d="M6 4v16" />
      <path d="M9 8h7M9 12h7" />
    </IconShell>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </IconShell>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 15.5h4.5" />
    </IconShell>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconShell>
  );
}
