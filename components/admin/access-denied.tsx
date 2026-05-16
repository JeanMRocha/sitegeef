type AccessDeniedProps = {
  title: string;
  message: string;
};

export function AccessDenied({ title, message }: AccessDeniedProps) {
  return (
    <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
      <div>
        <h1 className="admin-page-title">🔒 Módulo Restrito</h1>
        <p className="admin-page-subtitle">
          {title}: {message}
        </p>
      </div>
    </div>
  );
}
