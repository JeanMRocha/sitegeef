import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getReuniaoById, updateReuniao, deleteReuniao, getPessoasDisponiveis } from '../actions';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';

export const metadata = {
  title: 'Reunião Virtual - Admin GEEF',
};

async function handleSubmit(id: string, formData: FormData) {
  'use server';

  try {
    await updateReuniao(id, {
      titulo: (formData.get('titulo') as string) || undefined,
      plataforma: (formData.get('plataforma') as string) || undefined,
      link: (formData.get('link') as string) || undefined,
      senha: (formData.get('senha') as string) || undefined,
      anfitriao_id: (formData.get('anfitriao_id') as string) || undefined,
      data_hora: (formData.get('data_hora') as string) || undefined,
      status: (formData.get('status') as string) || undefined,
    });

    redirect(buildFlashNoticeUrl(`/admin/reunioes-virtuais/${id}`, { variant: 'success', message: 'Reunião salva.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/reunioes-virtuais/${id}`, { variant: 'error', message: 'Não foi possível salvar a reunião.' }));
    return;
  }
}

async function handleDelete(id: string) {
  'use server';

  try {
    await deleteReuniao(id);
    redirect(buildFlashNoticeUrl('/admin/reunioes-virtuais', { variant: 'success', message: 'Reunião excluída.' }));
  } catch (error) {
    console.error('Erro:', error);
    redirect(buildFlashNoticeUrl(`/admin/reunioes-virtuais/${id}`, { variant: 'error', message: 'Não foi possível excluir a reunião.' }));
    return;
  }
}

async function ReuniaoContent({ id }: { id: string }) {
  const reuniao = await getReuniaoById(id);
  const pessoas = await getPessoasDisponiveis();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{reuniao.titulo}</h1>
          <p className="admin-page-subtitle">
            {reuniao.plataforma && (
              <>
                {reuniao.plataforma === 'zoom' && '🎥 Zoom'}
                {reuniao.plataforma === 'google-meet' && '📹 Google Meet'}
                {reuniao.plataforma === 'teams' && '💬 Microsoft Teams'}
                {reuniao.plataforma === 'jitsi' && '🔗 Jitsi Meet'}
                {!['zoom', 'google-meet', 'teams', 'jitsi'].includes(reuniao.plataforma) && reuniao.plataforma}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 600 }}>Editar Reunião</h2>
        <form action={(formData) => handleSubmit(id, formData)}>
          <div className="admin-form-group">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              defaultValue={reuniao.titulo}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Plataforma</label>
              <select
                name="plataforma"
                defaultValue={reuniao.plataforma || ''}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione uma plataforma</option>
                <option value="zoom">🎥 Zoom</option>
                <option value="google-meet">📹 Google Meet</option>
                <option value="teams">💬 Microsoft Teams</option>
                <option value="jitsi">🔗 Jitsi Meet</option>
                <option value="outra">📡 Outra</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Anfitrião</label>
              <select
                name="anfitriao_id"
                defaultValue={reuniao.anfitriao_id || ''}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Selecione um anfitrião</option>
                {pessoas.map((pessoa: any) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Link de Acesso (URL)</label>
            <input
              type="url"
              name="link"
              defaultValue={reuniao.link || ''}
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-group">
            <label>Senha/PIN</label>
            <input
              type="text"
              name="senha"
              defaultValue={reuniao.senha || ''}
              placeholder="Ex: 123456"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label>Data e Hora</label>
              <input
                type="datetime-local"
                name="data_hora"
                defaultValue={reuniao.data_hora ? new Date(reuniao.data_hora).toISOString().slice(0, 16) : ''}
              />
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                name="status"
                defaultValue={reuniao.status || 'planejada'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '0.6rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  backgroundColor: '#fff',
                }}
              >
                <option value="planejada">📋 Planejada</option>
                <option value="finalizada">✓ Finalizada</option>
              </select>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '0.6rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
              💡 <strong>Dica:</strong> Copie o link e compartilhe com os participantes. A senha é opcional.
            </p>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
        </form>
      </div>

      {reuniao.link && (
        <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '1rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600 }}>Informações de Acesso</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>Link</p>
              <a href={reuniao.link} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', wordBreak: 'break-all' }}>
                {reuniao.link}
              </a>
            </div>
            {reuniao.senha && (
              <div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>Senha</p>
                <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 700 }}>{reuniao.senha}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="admin-card" style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#ef4444' }}>Zona de Perigo</h2>
        <form action={() => handleDelete(id)}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Excluir esta reunião permanentemente.
          </p>
          <button type="submit" className="admin-btn" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>
            🗑️ Excluir Reunião
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function ReuniaoPage({ params }: { params: Promise<any> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <ReuniaoContent id={resolvedParams.id} />
    </Suspense>
  );
}
